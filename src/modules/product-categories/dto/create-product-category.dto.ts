import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsOptional, Min, IsMongoId, IsNumber, IsBoolean } from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty({ required: true, example: 'My categorys name', description: 'This name must be unique' })
  @MaxLength(45, { message: 'Debe tener un maximo de 43 caracteres' })
  @MinLength(3, { message: 'Debe tener minimo 3 caracteres' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  name: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiProperty({ required: false, example: 1 })
  @Min(1, { message: 'Debe ser mayor que cero (0)' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un numero' })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsOptional()
  order?: number;

  @ApiProperty({
    description: 'Product category ID',
    required: false,
    default: '61d9cfbf17ed7311c4b3e485',
  })
  @IsMongoId({ message: 'El ID de la categoría no tiene el formato correcto' })
  @IsOptional()
  mainCategory?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform((value: any) => value && value === 'true')
  isEnabled?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @Transform((value: any) => value && value === 'true')
  @IsOptional()
  isPublished?: boolean;
}
