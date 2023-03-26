import { ApiProperty } from '@nestjs/swagger';

export class CashboxUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'User name' })
  name: string;
}
