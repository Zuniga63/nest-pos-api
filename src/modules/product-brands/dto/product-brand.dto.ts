import { ApiProperty } from '@nestjs/swagger';
import { ImageDto } from 'src/dto/image.dto';
import { IImage } from 'src/types';

export class ProductBrandDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ example: 'The amazing brand name' })
  name: string;

  @ApiProperty({ type: ImageDto, readOnly: true })
  image?: IImage;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
