import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductTagDto } from './dto/create-product-tag.dto';
import { UpdateProductTagDto } from './dto/update-product-tag.dto';
import { ProductTag, ProductTagDocument } from './schemas/product-tag.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createSlug } from 'src/utils';

@Injectable()
export class ProductTagsService {
  constructor(@InjectModel(ProductTag.name) private productTagModel: Model<ProductTagDocument>) {}

  async create(createProductTagDto: CreateProductTagDto) {
    const { name } = createProductTagDto;
    const slug = createSlug(name);

    const productTag = await this.productTagModel.create({ name, slug });
    return productTag;
  }

  findAll() {
    return this.productTagModel.find({}).sort('slug');
  }

  async findOne(id: string) {
    const productTag = await this.productTagModel.findById(id);
    if (!productTag) throw new NotFoundException('No se encontró la etiqueta');

    return productTag;
  }

  async update(id: string, updateProductTagDto: UpdateProductTagDto) {
    const { name } = updateProductTagDto;
    const productTag = await this.productTagModel.findById(id);
    if (!productTag) throw new NotFoundException('No se encontró la etiqueta');

    if (name && productTag.name !== name) {
      productTag.name = name;
      productTag.slug = createSlug(name);
      await productTag.save();
    }

    return productTag;
  }

  async remove(id: string) {
    const productTag = await this.productTagModel.findByIdAndDelete(id);
    if (!productTag) throw new NotFoundException('No se encontró la etiqueta');

    return productTag;
  }
}
