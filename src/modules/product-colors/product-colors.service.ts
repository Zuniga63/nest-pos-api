import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductColorDto } from './dto/create-product-color.dto';
import { UpdateProductColorDto } from './dto/update-product-color.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductColor, ProductColorDocument } from './schemas/product-color.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductColorsService {
  constructor(@InjectModel(ProductColor.name) private productColorModel: Model<ProductColorDocument>) {}

  create(createProductColorDto: CreateProductColorDto) {
    return this.productColorModel.create(createProductColorDto);
  }

  findAll() {
    return this.productColorModel.find().sort('name');
  }

  async findOne(id: string) {
    const productColor = await this.productColorModel.findById(id);
    if (!productColor) throw new NotFoundException('El color buscado no existe.');

    return productColor;
  }

  async update(id: string, updateProductColorDto: UpdateProductColorDto) {
    const productColor = await this.productColorModel.findByIdAndUpdate(id, updateProductColorDto, { new: true });
    if (!productColor) throw new NotFoundException('El color a actualizar no existe.');

    return productColor;
  }

  async remove(id: string) {
    const productColor = await this.productColorModel.findByIdAndDelete(id);
    if (!productColor) throw new NotFoundException('El color a eliminar no existe.');
    return productColor;
  }
}
