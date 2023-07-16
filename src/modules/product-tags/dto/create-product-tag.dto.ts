import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateProductTagDto {
  @ApiProperty({ required: true, example: 'My tag name', description: 'This name must be unique' })
  @MaxLength(45, { message: 'Debe tener un maximo de 45 caracteres' })
  @MinLength(3, { message: 'Debe tener minimo 3 caracteres' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  name: string;
}
