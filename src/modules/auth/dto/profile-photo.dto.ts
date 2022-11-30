import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProfilePhotoDto {
  @IsNotEmpty({ message: 'Se requiere la imagen' })
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
