import { ApiProperty } from '@nestjs/swagger';
import { ImageDto } from 'src/dto/image.dto';
import { IImage } from 'src/types';
import { ProductCategoryBaseDto } from './product-category-base.dto';

export class ProductCategoryDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ type: ProductCategoryBaseDto })
  mainCategory?: ProductCategoryBaseDto;

  @ApiProperty({ example: 'Category Name' })
  name: string;

  @ApiProperty({ example: 'category-name-hash' })
  slug: string;

  @ApiProperty({ type: ImageDto, readOnly: true })
  image?: IImage;

  @ApiProperty()
  order: number;

  @ApiProperty({ type: ProductCategoryBaseDto })
  subcategories: ProductCategoryBaseDto[];

  @ApiProperty({ example: false })
  isEnabled: boolean;

  @ApiProperty({ example: false })
  isPublished: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ProductCategoryFullDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ type: ProductCategoryDto })
  mainCategory?: ProductCategoryDto;

  @ApiProperty({ example: 'Category Name' })
  name: string;

  @ApiProperty({ example: 'category-name-hash' })
  slug: string;

  @ApiProperty({ type: ImageDto, readOnly: true })
  image?: IImage;

  @ApiProperty()
  order: number;

  @ApiProperty({ type: [ProductCategoryDto] })
  subcategories: ProductCategoryDto[];

  @ApiProperty({ example: false })
  isEnabled: boolean;

  @ApiProperty({ example: false })
  isPublished: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
