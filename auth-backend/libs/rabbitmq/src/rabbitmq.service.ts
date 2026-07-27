import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(@Inject('RABBITMQ_SERVICE') private client: ClientProxy) {}

  async publish(queue: string, pattern: string, data: unknown): Promise<void> {
    await this.client.emit(pattern, data).toPromise();
  }

  async send(queue: string, pattern: string, data: unknown): Promise<unknown> {
    return this.client.send(pattern, data).toPromise();
  }
}
