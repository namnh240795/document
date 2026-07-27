import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty()
  data!: T;

  @ApiProperty({
    example: {
      requestId: 'req-1234567890',
      timestamp: '2026-07-27T08:00:00.000Z',
    },
    required: false,
  })
  meta?: {
    requestId: string;
    timestamp: string;
  };

  constructor(data: T) {
    this.success = true;
    this.data = data;
    this.meta = {
      requestId: `req-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }
}
