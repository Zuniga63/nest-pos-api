import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Product name' })
  @MaxLength(45, { message: 'Debe tener un maximo de 45 caracteres' })
  @MinLength(3, { message: 'Debe tener minimo 3 caracteres' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  name: string;

  @ApiProperty({ example: 'optional product description', required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '748475849', required: false })
  @MaxLength(20, { message: 'Debe tener un maximo de 20 caracteres' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  @IsOptional()
  barcode?: string;

  @ApiProperty({ example: 'my-ref-459', required: false })
  @MaxLength(20, { message: 'Debe tener un maximo de 20 caracteres' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  @IsOptional()
  productRef?: string;

  @ApiProperty({
    description: 'Categories IDs',
    required: false,
    default: '61d9cfbf17ed7311c4b3e485',
  })
  @IsMongoId({ message: 'El ID de las categorías no tiene el formato correcto', each: true })
  @IsOptional()
  categories?: string[];

  @ApiProperty({
    description: 'Product size ID',
    required: false,
    default: '61d9cfbf17ed7311c4b3e485',
  })
  @IsMongoId({ message: 'El ID de la talla no tiene el formato correcto' })
  @IsOptional()
  size?: string;

  @ApiProperty({
    description: 'Product color ID',
    required: false,
    default: '61d9cfbf17ed7311c4b3e485',
  })
  @IsMongoId({ message: 'El ID del color no tiene el formato correcto' })
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: 'Tags IDs',
    required: false,
    default: '61d9cfbf17ed7311c4b3e485',
  })
  @IsMongoId({ message: 'El ID de las etiquetas no tiene el formato correcto', each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'Product brand ID',
    required: false,
    default: '61d9cfbf17ed7311c4b3e485',
  })
  @IsMongoId({ message: 'El ID del la marca no tiene el formato correcto' })
  @IsOptional()
  brand?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiProperty({ example: 100 })
  @Min(0, { message: 'Debe ser un numero positivo' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un numero' })
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  price: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform((value: any) => value && value === 'true')
  hasDiscount: boolean;

  @ApiProperty({ example: 90, required: false })
  @Min(0, { message: 'Debe ser un numero positivo' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un numero' })
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsOptional()
  priceWithDiscount?: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  @Transform((value: any) => value && value === 'true')
  isInventoriable: boolean;

  @ApiProperty({ example: 10 })
  @Min(0, { message: 'Debe ser un numero positivo' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un numero' })
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsOptional()
  initialStock?: number;

  @ApiProperty({ example: 80, description: 'The value of last buy', required: false })
  @Min(0, { message: 'Debe ser un numero positivo' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un numero' })
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsOptional()
  cost?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform((value: any) => value && value === 'true')
  isEnabled?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @Transform((value: any) => value && value === 'true')
  @IsOptional()
  isPublished?: boolean;
}
