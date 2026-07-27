import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { QUEUE_NAMES, EVENTS, LogEvent } from '@app/common';

@Injectable()
export class LogProducerService {
  constructor(private readonly rabbitmqService: RabbitMQService) {}

  async publishLogEvent(event: Omit<LogEvent, 'eventId' | 'timestamp'>): Promise<void> {
    const logEvent: LogEvent = {
      ...event,
      eventId: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    await this.rabbitmqService.publish(
      QUEUE_NAMES.LOG_EVENTS,
      EVENTS.EVENT_LOGGED,
      logEvent,
    );
  }
}
