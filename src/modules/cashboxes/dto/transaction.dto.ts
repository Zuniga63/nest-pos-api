import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  cashbox: string;

  @ApiProperty()
  transactionDate: Date;

  @ApiProperty({ example: 'This is a transaction description' })
  description: string;

  @ApiProperty({ example: false })
  isTransfer: boolean;

  @ApiProperty({ example: 1000 })
  amount: number;

  @ApiProperty({ example: 1000 })
  balance: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
