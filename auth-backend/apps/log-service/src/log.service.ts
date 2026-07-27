import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';
import { LogEvent } from '@app/common';

// In-memory fallback for development
const logEvents = new Map<string, LogEvent>();

@Injectable()
export class LogService {
  private client: Client;
  private readonly indexName = 'log-events';

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get('OPENSEARCH_URL', 'http://localhost:9200'),
    });
  }

  // LOG FR-001: Ingest Log Events
  async indexEvent(event: LogEvent) {
    try {
      await this.client.index({
        index: this.indexName,
        id: event.eventId,
        body: event,
      });

      // Also store in memory for development
      logEvents.set(event.eventId, event);
    } catch (error: unknown) {
      console.error('Failed to index event to OpenSearch:', error instanceof Error ? error.message : String(error));
      // Fallback to in-memory storage
      logEvents.set(event.eventId, event);
    }

    return { success: true, eventId: event.eventId };
  }

  // LOG FR-002: Query Logs with filters
  async queryEvents(filters: {
    level?: string;
    source?: string;
    action?: string;
    userId?: string;
    traceId?: string;
    from?: string;
    to?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const offset = (page - 1) * limit;

    try {
      const must: Record<string, unknown>[] = [];
      const filter: Record<string, unknown>[] = [];

      if (filters.level) {
        filter.push({ term: { level: filters.level } });
      }
      if (filters.source) {
        filter.push({ term: { source: filters.source } });
      }
      if (filters.action) {
        filter.push({ term: { action: filters.action } });
      }
      if (filters.userId) {
        filter.push({ term: { userId: filters.userId } });
      }
      if (filters.traceId) {
        filter.push({ term: { traceId: filters.traceId } });
      }
      if (filters.from || filters.to) {
        const range: Record<string, string> = {};
        if (filters.from) range.gte = filters.from;
        if (filters.to) range.lte = filters.to;
        filter.push({ range: { timestamp: range } });
      }
      if (filters.search) {
        must.push({
          multi_match: {
            query: filters.search,
            fields: ['message', 'action', 'error'],
          },
        });
      }

      const body = {
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter,
          },
        },
        sort: [{ timestamp: { order: 'desc' } }],
        from: offset,
        size: limit,
      };

      const result = await this.client.search({
        index: this.indexName,
        body,
      });

      const events = result.body.hits.hits.map((hit: { _source: LogEvent }) => hit._source);
      const total = typeof result.body.hits.total === 'number'
        ? result.body.hits.total
        : result.body.hits.total.value;

      return {
        events,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: unknown) {
      console.error('Failed to query OpenSearch:', error instanceof Error ? error.message : String(error));
      // Fallback to in-memory query
      let events = Array.from(logEvents.values());

      if (filters.level) events = events.filter((e) => e.level === filters.level);
      if (filters.source) events = events.filter((e) => e.source === filters.source);
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        events = events.filter(
          (e) =>
            e.message?.toLowerCase().includes(searchLower) ||
            e.action?.toLowerCase().includes(searchLower),
        );
      }

      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const total = events.length;
      const paginatedEvents = events.slice(offset, offset + limit);

      return {
        events: paginatedEvents,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  }

  // LOG FR-002: Get single log event by ID
  async getEventById(eventId: string) {
    try {
      const result = await this.client.get({
        index: this.indexName,
        id: eventId,
      });

      return result.body._source;
    } catch (error: unknown) {
      // Fallback to in-memory
      const event = logEvents.get(eventId);
      if (!event) {
        throw new NotFoundException('Log event not found');
      }
      return event;
    }
  }

  // LOG FR-003: Log Analytics
  async getAnalytics(filters: { from?: string; to?: string; interval?: string }) {
    const interval = filters.interval || 'day';

    try {
      const must: Record<string, unknown>[] = [];
      const filter: Record<string, unknown>[] = [];

      if (filters.from || filters.to) {
        const range: Record<string, string> = {};
        if (filters.from) range.gte = filters.from;
        if (filters.to) range.lte = filters.to;
        filter.push({ range: { timestamp: range } });
      }

      const body = {
        size: 0,
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter,
          },
        },
        aggs: {
          byLevel: {
            terms: { field: 'level' },
          },
          bySource: {
            terms: { field: 'source.keyword' },
          },
          timeline: {
            date_histogram: {
              field: 'timestamp',
              calendar_interval: interval,
            },
          },
        },
      };

      const result = await this.client.search({
        index: this.indexName,
        body,
      });

      const aggs = result.body.aggregations;

      interface AggBucket {
        key: string;
        doc_count: number;
        key_as_string?: string;
      }

      return {
        totalEvents: result.body.hits.total.value || result.body.hits.total,
        byLevel: aggs.byLevel.buckets.map((b: AggBucket) => ({ level: b.key, count: b.doc_count })),
        bySource: aggs.bySource.buckets.map((b: AggBucket) => ({ source: b.key, count: b.doc_count })),
        timeline: aggs.timeline.buckets.map((b: AggBucket) => ({
          timestamp: b.key_as_string || b.key,
          count: b.doc_count,
        })),
      };
    } catch (error: unknown) {
      console.error('Failed to get analytics from OpenSearch:', error instanceof Error ? error.message : String(error));
      // Fallback to in-memory analytics
      let events = Array.from(logEvents.values());

      if (filters.from) {
        events = events.filter((e) => new Date(e.timestamp) >= new Date(filters.from!));
      }
      if (filters.to) {
        events = events.filter((e) => new Date(e.timestamp) <= new Date(filters.to!));
      }

      const byLevel = events.reduce((acc, e) => {
        acc[e.level] = (acc[e.level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const bySource = events.reduce((acc, e) => {
        acc[e.source] = (acc[e.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalEvents: events.length,
        byLevel: Object.entries(byLevel).map(([level, count]) => ({ level, count })),
        bySource: Object.entries(bySource).map(([source, count]) => ({ source, count })),
        timeline: [],
      };
    }
  }
}
