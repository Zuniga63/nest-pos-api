import { Module } from '@nestjs/common';
import { ProductColorsService } from './product-colors.service';
import { ProductColorsController } from './product-colors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductColor, ProductColorSchema } from './schemas/product-color.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductColor.name, schema: ProductColorSchema }])],
  controllers: [ProductColorsController],
  providers: [ProductColorsService],
})
export class ProductColorsModule {}
