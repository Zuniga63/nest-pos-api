import { ApiProperty } from '@nestjs/swagger';
import { ImageDto } from 'src/dto/image.dto';
import { IImage } from 'src/types';

export class ProductCategoryBaseDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  mainCategory?: string;

  @ApiProperty({ example: 'Category Name' })
  name: string;

  @ApiProperty({ example: 'category-name-hash' })
  slug: string;

  @ApiProperty({ type: ImageDto, readOnly: true })
  image?: IImage;

  @ApiProperty()
  order: number;

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  subcategories: string[];

  @ApiProperty({ example: false })
  isEnabled: boolean;

  @ApiProperty({ example: false })
  isPublished: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
