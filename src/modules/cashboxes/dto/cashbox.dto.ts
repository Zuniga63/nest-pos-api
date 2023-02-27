import { ApiProperty } from '@nestjs/swagger';
import { CashboxUserDto } from './cashbox-user.dto';
import { NewCashboxDto } from './new-cashbox.dto';

export class CashboxDto extends NewCashboxDto {
  @ApiProperty({
    type: CashboxUserDto,
    required: false,
    description: 'This property can be undefined',
  })
  cashier?: CashboxUserDto;

  @ApiProperty({
    required: false,
    example: 'Cashier Name',
    description: 'This property can be undefined',
  })
  cashierName?: string;

  @ApiProperty({
    required: false,
    description: 'This property can be undefined',
  })
  openBox?: Date;

  @ApiProperty({
    required: false,
    description: 'This property can be undefined',
  })
  closed?: Date;
}
