import { Module } from '@nestjs/common';
import { ProductSizesService } from './product-sizes.service';
import { ProductSizesController } from './product-sizes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSize, ProductSizeSchema } from './schemas/product-size.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductSize.name, schema: ProductSizeSchema }])],
  controllers: [ProductSizesController],
  providers: [ProductSizesService],
  exports: [ProductSizesService],
})
export class ProductSizesModule {}
