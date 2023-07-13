import { Module } from '@nestjs/common';
import { ProductBrandService } from './product-brands.service';
import { ProductBrandController } from './product-brands.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductBrand, ProductBrandSchema } from './schemas/product-brand.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductBrand.name, schema: ProductBrandSchema }])],
  controllers: [ProductBrandController],
  providers: [ProductBrandService],
  exports: [ProductBrandService],
})
export class ProductBrandModule {}
