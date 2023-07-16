import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductSizeDto } from './dto/create-product-size.dto';
import { UpdateProductSizeDto } from './dto/update-product-size.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductSize, ProductSizeDocument } from './schemas/product-size.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductSizesService {
  constructor(@InjectModel(ProductSize.name) private productSizeModel: Model<ProductSizeDocument>) {}

  create(createProductSizeDto: CreateProductSizeDto) {
    return this.productSizeModel.create(createProductSizeDto);
  }

  findAll() {
    return this.productSizeModel.find().sort('type').sort('order');
  }

  async findOne(id: string) {
    const productSize = await this.productSizeModel.findById(id);
    if (!productSize) throw new NotFoundException('La talla no existe.');

    return productSize;
  }

  async update(id: string, updateProductSizeDto: UpdateProductSizeDto) {
    const productSize = await this.productSizeModel.findByIdAndUpdate(id, updateProductSizeDto, { new: true });
    if (!productSize) throw new NotFoundException('La talla a actualizar no existe.');

    return productSize;
  }

  async remove(id: string) {
    const productSize = await this.productSizeModel.findByIdAndDelete(id);
    if (!productSize) throw new NotFoundException('La talla a eliminar no existe.');

    return productSize;
  }
}
