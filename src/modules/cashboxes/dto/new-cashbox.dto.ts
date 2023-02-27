import { ApiProperty } from '@nestjs/swagger';

export class NewCashboxDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ example: ['61d9cfbf17ed7311c4b3e485'] })
  users: string[];

  @ApiProperty({ example: 'My Box Name' })
  name: string;

  @ApiProperty({ example: 0 })
  base: number;

  @ApiProperty({ example: ['61d9cfbf17ed7311c4b3e485'] })
  transactions: string[];

  @ApiProperty({ example: ['61d9cfbf17ed7311c4b3e485'] })
  closingRecords: string[];

  @ApiProperty({ example: 0 })
  balance: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
