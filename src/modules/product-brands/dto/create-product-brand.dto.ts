import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateProductBrandDto {
  @ApiProperty({ required: true, example: 'My brand name', description: 'This name must be unique' })
  @MaxLength(45, { message: 'El nombre de usuario es muy largo' })
  @MinLength(3, { message: 'El nombre de usuario es muy corto' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  name: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: Express.Multer.File;
}
