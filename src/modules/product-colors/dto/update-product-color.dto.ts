import { PartialType } from '@nestjs/swagger';
import { CreateProductColorDto } from './create-product-color.dto';

export class UpdateProductColorDto extends PartialType(CreateProductColorDto) {}
