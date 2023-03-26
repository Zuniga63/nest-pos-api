import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, Min } from 'class-validator';

export class OpenBoxDto {
  @ApiProperty({ required: false, example: 100 })
  @Min(0, { message: 'La base no puede ser negativa.' })
  @IsNumber()
  @IsOptional()
  base?: number;

  @ApiProperty({ required: false })
  @IsDate({ message: 'La fecha no tiene el formato adecuado.' })
  @IsOptional()
  @Type(() => Date)
  date?: Date;
}
