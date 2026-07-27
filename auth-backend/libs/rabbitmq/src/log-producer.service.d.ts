import { RabbitMQService } from './rabbitmq.service';
import { LogEvent } from '@app/common';
export declare class LogProducerService {
    private readonly rabbitmqService;
    constructor(rabbitmqService: RabbitMQService);
    publishLogEvent(event: Omit<LogEvent, 'eventId' | 'timestamp'>): Promise<void>;
}
