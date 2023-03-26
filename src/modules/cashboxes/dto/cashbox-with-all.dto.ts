import { ApiProperty } from '@nestjs/swagger';
import { CashboxUserDto } from './cashbox-user.dto';
import { ClosingRecordDto } from './closing-record.dto';
import { TransactionDto } from './transaction.dto';

export default class CashboxWithAll {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({
    type: CashboxUserDto,
    required: false,
    description: 'This property can be undefined',
  })
  cashier?: CashboxUserDto;

  @ApiProperty({ type: [CashboxUserDto] })
  users: string[];

  @ApiProperty({ example: 'My Box Name' })
  name: string;

  @ApiProperty({
    required: false,
    example: 'Cashier Name',
    description: 'This property can be undefined',
  })
  cashierName?: string;

  @ApiProperty({ example: 0 })
  base: number;

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

  @ApiProperty({ type: [TransactionDto] })
  transactions: TransactionDto[];

  @ApiProperty({ type: [ClosingRecordDto] })
  closingRecords: ClosingRecordDto[];

  @ApiProperty({ example: 0 })
  balance: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
