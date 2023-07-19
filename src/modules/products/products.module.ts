import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductBrandModule } from '../product-brands/product-brands.module';
import { ProductCategoriesModule } from '../product-categories/product-categories.module';
import { ProductColorsModule } from '../product-colors/product-colors.module';
import { ProductSizesModule } from '../product-sizes/product-sizes.module';
import { ProductTagsModule } from '../product-tags/product-tags.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CloudinaryModule,
    ProductBrandModule,
    ProductCategoriesModule,
    ProductColorsModule,
    ProductSizesModule,
    ProductTagsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
