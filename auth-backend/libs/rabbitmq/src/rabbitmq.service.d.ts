import { ClientProxy } from '@nestjs/microservices';
export declare class RabbitMQService {
    private client;
    constructor(client: ClientProxy);
    publish(queue: string, pattern: string, data: unknown): Promise<void>;
    send(queue: string, pattern: string, data: unknown): Promise<unknown>;
}
