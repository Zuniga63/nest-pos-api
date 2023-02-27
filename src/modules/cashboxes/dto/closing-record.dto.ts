import { ApiProperty } from '@nestjs/swagger';

export class ClosingRecordDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({
    required: false,
    example: 'Cashier Name',
    description: 'This property can be undefined',
  })
  cashierName?: string;

  @ApiProperty()
  opened: Date;

  @ApiProperty()
  closingDate: Date;

  @ApiProperty({ example: 1000 })
  balance: number;

  @ApiProperty({ example: 1000 })
  base: number;

  @ApiProperty({ example: 1000 })
  incomes: number;

  @ApiProperty({ example: 1000 })
  cash: number;

  @ApiProperty({ example: 1000 })
  leftover: number;

  @ApiProperty({ example: 1000 })
  missing: number;

  @ApiProperty()
  observation?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
