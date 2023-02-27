import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsDate({ message: 'La fecha no tiene un formato adecuado' })
  @IsOptional()
  @Type(() => Date)
  transactionDate?: Date;

  @ApiProperty({ example: 'This is a transaction description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  amount: number;
}
