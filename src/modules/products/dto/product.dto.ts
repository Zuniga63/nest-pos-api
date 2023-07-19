import { ApiProperty } from '@nestjs/swagger';
import { ImageDto } from 'src/dto/image.dto';
import { ProductBrandDto } from 'src/modules/product-brands/dto/product-brand.dto';
import { ProductCategoryBaseDto } from 'src/modules/product-categories/dto/product-category-base.dto';
import { ProductColorDto } from 'src/modules/product-colors/dto/product-color.dto';
import { ProductSizeDto } from 'src/modules/product-sizes/dto/product-size.dto';
import { ProductTagDto } from 'src/modules/product-tags/dto/product-tag.dto';
import { IImage } from 'src/types';

export class ProductDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ example: 'Product name' })
  name: string;

  @ApiProperty({ example: 'product-name-hz5r' })
  slug: string;

  @ApiProperty({ example: 'optional product description', required: false })
  description?: string;

  @ApiProperty({ example: '748475849', required: false })
  barcode?: string;

  @ApiProperty({ example: 'my-ref-459', required: false })
  productRef?: string;

  @ApiProperty({ type: [ProductCategoryBaseDto], example: '61d9cfbf17ed7311c4b3e485' })
  categories: ProductCategoryBaseDto[];

  @ApiProperty({ type: ProductSizeDto, required: false })
  size?: ProductSizeDto;

  @ApiProperty({ type: ProductColorDto, example: '61d9cfbf17ed7311c4b3e485', required: false })
  color?: ProductColorDto;

  @ApiProperty({ type: [ProductTagDto], example: '61d9cfbf17ed7311c4b3e485' })
  tags: ProductTagDto[];

  @ApiProperty({ type: ProductBrandDto, example: '61d9cfbf17ed7311c4b3e485', required: false })
  brand?: ProductBrandDto;

  @ApiProperty({ type: ImageDto, readOnly: true, required: false })
  image?: IImage;

  @ApiProperty({ type: [ImageDto], readOnly: true })
  gallery: IImage[];

  @ApiProperty({ example: 100 })
  price: number;

  @ApiProperty({ example: false })
  hasDiscount: boolean;

  @ApiProperty({ example: 90, required: false })
  priceWithDiscount?: number;

  @ApiProperty({ example: false })
  isInventoriable: boolean;

  @ApiProperty({ example: 10 })
  stock: number;

  @ApiProperty({ example: 80, description: 'The value of last buy', required: false })
  cost?: number;

  @ApiProperty({ example: 75, required: false })
  averageCost?: number;

  @ApiProperty({ example: 750 })
  inventoryValue: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
