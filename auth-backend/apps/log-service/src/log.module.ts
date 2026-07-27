import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { LogConsumer } from './log.consumer';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [LogController],
  providers: [LogService, LogConsumer],
})
export class LogModule {}
