import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';

export enum ProductSizeEnum {
  SHOES = 'shoes',
  CLOTHES = 'clothes',
}

export type ProductSizeDocument = HydratedDocument<ProductSize>;

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class ProductSize {
  id: string;

  @Prop({
    required: [true, 'El tipo de talla es requerido'],
    enum: ProductSizeEnum,
  })
  type: ProductSizeEnum;

  @Prop({
    required: [true, 'EL valor de la talla es requerido'],
    maxlength: [10, 'No puede ser mayor a 10 caracteres'],
  })
  value: ProductSizeEnum;

  @Prop({ required: true, default: 1, min: [1, 'Debe ser mayor que cero(0)'] })
  order: number;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Product',
    required: false,
  })
  products: Product[];

  createdAt: Date;

  updatedAt: Date;
}

export const ProductSizeSchema = SchemaFactory.createForClass(ProductSize);
