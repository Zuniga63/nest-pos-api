import { ApiProperty } from '@nestjs/swagger';
import { ImageDto } from 'src/dto/image.dto';
import { IImage } from 'src/types';

export class ProductBaseDto {
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

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  categories: string[];

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485', required: false })
  size?: string;

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485', required: false })
  color?: string;

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  tags: string[];

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485', required: false })
  brand?: string;

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
