import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport, ClientProvider } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';
import { LogProducerService } from './log-producer.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService): ClientProvider => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL', 'amqp://rabbitmq:rabbitmq@localhost:5672')],
            queue: 'main_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [RabbitMQService, LogProducerService],
  exports: [RabbitMQService, LogProducerService, ClientsModule],
})
export class RabbitMQModule {}
