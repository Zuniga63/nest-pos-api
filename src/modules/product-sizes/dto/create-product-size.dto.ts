import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ProductSizeEnum } from '../schemas/product-size.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductSizeDto {
  @ApiProperty({ enum: ProductSizeEnum, required: true })
  @IsEnum(ProductSizeEnum, { message: 'Debe ser un tipo de talla válido' })
  type: ProductSizeEnum;

  @ApiProperty({ required: true, example: 'xxl' })
  @MaxLength(10, { message: 'Debe tener un maximo de 10 caracteres' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'EL valor de la talla es requerido' })
  value: string;

  @ApiProperty({ required: false, example: 1 })
  @Min(1, { message: 'Debe ser mayor que cero (0)' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Debe ser un numero entero' })
  @IsOptional()
  order?: number;
}
