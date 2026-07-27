import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({
    example: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request data',
    },
  })
  error!: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };

  constructor(code: string, message: string, details?: Record<string, unknown>) {
    this.success = false;
    this.error = { code, message, details };
  }
}
