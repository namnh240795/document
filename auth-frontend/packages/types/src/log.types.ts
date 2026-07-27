export interface LogEvent {
  eventId: string;
  source: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  action: string;
  message: string;
  input?: string;
  output?: string;
  error?: string;
  exception?: string;
  metadata?: Record<string, unknown>;
  traceId?: string;
  userId?: string;
  timestamp: string;
}

export interface LogQueryParams {
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
}

export interface LogAnalytics {
  totalEvents: number;
  byLevel: { level: string; count: number }[];
  bySource: { source: string; count: number }[];
  timeline: { timestamp: string; count: number }[];
}
