import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { NotMatch } from 'src/utils/decorators/no-match.decorator';

export class CashTransferDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485', required: true })
  @IsMongoId({ message: 'No es una caja válida' })
  @IsNotEmpty()
  @IsString()
  senderBoxId: string;

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485', required: true })
  @NotMatch('senderBoxId', {
    message: 'No se puede transferir fondos a la misma caja',
  })
  @IsMongoId({ message: 'No es una caja válida' })
  @IsNotEmpty()
  @IsString()
  addresseeBoxId: string;

  @ApiProperty()
  @IsDate({ message: 'La fecha no tiene un formato adecuado' })
  @IsOptional()
  @Type(() => Date)
  transferDate?: Date;

  @ApiProperty({ example: 100000, required: true })
  @Min(0.01, { message: 'Debe ser mayor que cero' })
  @IsNumber()
  amount: number;
}
