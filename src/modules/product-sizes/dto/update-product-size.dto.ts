import { PartialType } from '@nestjs/swagger';
import { CreateProductSizeDto } from './create-product-size.dto';

export class UpdateProductSizeDto extends PartialType(CreateProductSizeDto) {}
