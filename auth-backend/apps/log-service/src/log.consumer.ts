import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { LogService } from './log.service';

@Injectable()
export class LogConsumer implements OnModuleInit, OnModuleDestroy {
  private connection: any = null;
  private channel: any = null;
  private readonly queueName = 'log.events';

  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const rabbitmqUrl = this.configService.get('RABBITMQ_URL', 'amqp://rabbitmq:rabbitmq@localhost:5672');
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });

      console.log('LOG Consumer: Connected to RabbitMQ');

      this.channel.consume(this.queueName, async (msg: any) => {
        if (msg) {
          try {
            const logEntry = JSON.parse(msg.content.toString());
            await this.logService.indexEvent(logEntry);
            this.channel.ack(msg);
          } catch (error) {
            console.error('LOG Consumer: Failed to process message:', error);
            this.channel.nack(msg, false, false);
          }
        }
      });

      console.log(`LOG Consumer: Listening on queue ${this.queueName}`);
    } catch (error) {
      console.error('LOG Consumer: Failed to connect to RabbitMQ:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error('LOG Consumer: Error disconnecting:', error);
    }
  }
}
