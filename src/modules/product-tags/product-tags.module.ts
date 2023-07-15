import { Module } from '@nestjs/common';
import { ProductTagsService } from './product-tags.service';
import { ProductTagsController } from './product-tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductTag, ProductTagSchema } from './schemas/product-tag.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductTag.name, schema: ProductTagSchema }])],
  controllers: [ProductTagsController],
  providers: [ProductTagsService],
})
export class ProductTagsModule {}
