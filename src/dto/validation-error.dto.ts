import { ApiProperty } from '@nestjs/swagger';

export default class ValidationErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ format: 'url' })
  path: string;

  @ApiProperty({ example: 'ValidationError' })
  errorType: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty({ example: 'Error in the general validation' })
  errorMessage?: string;

  @ApiProperty({
    type: 'object',
    properties: {
      propertyName: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'A message for some validation',
          },
          value: {
            type: 'string',
            example: 'The value of wrong property',
          },
        },
      },
    },
  })
  errors?: {
    propertyName: {
      message: string;
      value: any;
    };
  };
}
