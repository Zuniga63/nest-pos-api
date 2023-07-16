import { ApiProperty } from '@nestjs/swagger';
import { ProductSizeEnum } from '../schemas/product-size.schema';

export class ProductSizeDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ example: 'clothes', enum: ProductSizeEnum })
  type: ProductSizeEnum;

  @ApiProperty({ example: 'xxl' })
  value: string;

  @ApiProperty({ example: 1 })
  order?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
