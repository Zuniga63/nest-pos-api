import { PartialType } from '@nestjs/swagger';
import { CreateProductBrandDto } from './create-product-brand.dto';

export class UpdateProductBrandDto extends PartialType(CreateProductBrandDto) {}
