import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import * as amqp from 'amqplib';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private connection: any = null;
  private channel: any = null;
  private readonly queueName = 'log.events';
  private readonly rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://rabbitmq:rabbitmq@localhost:5672';

  constructor() {
    this.connectToRabbitMQ();
  }

  private async connectToRabbitMQ(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
      console.log('Connected to RabbitMQ for logging');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ for logging:', error);
      setTimeout(() => this.connectToRabbitMQ(), 5000);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers, user, ip } = request;
    const traceId = headers['x-trace-id'] || uuidv4();
    const startTime = Date.now();

    const logData = {
      eventId: uuidv4(),
      traceId,
      action: `${method} ${url}`,
      ip: ip || request.connection?.remoteAddress || null,
      userId: user?.id || null,
      input: body ? JSON.stringify(body) : null,
      timestamp: new Date().toISOString(),
    };

    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - startTime;
          const logEntry = {
            ...logData,
            source: this.getServiceName(),
            level: 'info',
            message: `${method} ${url} completed`,
            output: JSON.stringify(response),
            duration,
          };

          console.log(JSON.stringify(logEntry));
          this.publishToRabbitMQ(logEntry);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const logEntry = {
            ...logData,
            source: this.getServiceName(),
            level: 'error',
            message: `${method} ${url} failed`,
            error: error.message,
            exception: error.stack,
            duration,
          };

          console.error(JSON.stringify(logEntry));
          this.publishToRabbitMQ(logEntry);
        },
      }),
    );
  }

  private getServiceName(): string {
    const app = process.env.nest_app || process.env.NODE_APP || '';
    if (app.includes('auth')) return 'auth';
    if (app.includes('sms')) return 'sms';
    if (app.includes('email')) return 'email';
    if (app.includes('log')) return 'log';
    return 'unknown';
  }

  private publishToRabbitMQ(logEntry: Record<string, unknown>): void {
    try {
      if (this.channel) {
        this.channel.sendToQueue(
          this.queueName,
          Buffer.from(JSON.stringify(logEntry)),
          { persistent: true },
        );
      }
    } catch (error) {
      console.error('Failed to publish log to RabbitMQ:', error);
    }
  }
}
