import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LogService } from './log.service';
import { LogQueryDto, LogAnalyticsDto } from '@app/common';

@ApiTags('logs')
@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  @ApiOperation({ summary: 'Query logs with filters' })
  async queryLogs(@Query() query: LogQueryDto) {
    return this.logService.queryEvents(query);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get log analytics' })
  async getAnalytics(@Query() query: LogAnalyticsDto) {
    return this.logService.getAnalytics(query);
  }

  @Get(':eventId')
  @ApiOperation({ summary: 'Get log event by ID' })
  async getEvent(@Param('eventId') eventId: string) {
    return this.logService.getEventById(eventId);
  }
}
