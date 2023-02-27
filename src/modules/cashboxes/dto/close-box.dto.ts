import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CloseBoxDto {
  @ApiProperty({ required: true, example: 100 })
  @Min(0, { message: 'La base no puede ser negativa.' })
  @IsNumber()
  @IsNotEmpty()
  cash: number;

  @ApiProperty({ required: false, example: 'This is a close.' })
  @IsString()
  @IsOptional()
  observation?: string;
}
