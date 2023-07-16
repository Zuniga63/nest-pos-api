import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsHexColor, IsOptional } from 'class-validator';

export class CreateProductColorDto {
  @ApiProperty({ required: true, example: 'My color name' })
  @MaxLength(45, { message: 'Debe tener un maximo de 45 caracteres' })
  @MinLength(3, { message: 'Debe tener minimo 3 caracteres' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  name: string;

  @ApiProperty({ required: true, example: '#000' })
  @IsHexColor({ message: 'Debe ser un codigo HEX válido' })
  code: string;

  @ApiProperty({ required: false, example: 'my-color-ref' })
  @MaxLength(20, { message: 'Debe tener un maximo de 45 caracteres' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  @IsOptional()
  colorRef?: string;
}
