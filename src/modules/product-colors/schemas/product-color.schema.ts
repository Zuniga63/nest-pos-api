import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';

export type ProductColorDocument = HydratedDocument<ProductColor>;

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class ProductColor {
  id: string;

  @Prop({
    required: [true, 'El nombre del color es requerido'],
    minlength: [3, 'Nombre muy corto.'],
    maxlength: [45, 'Nombre demasiado largo'],
  })
  name: string;

  @Prop({
    required: [true, 'El codigo de color es requerido'],
    minlength: [4, 'No es un codigo válido'],
    maxlength: [9, 'No es un codigo válido'],
  })
  code: string;

  @Prop({ maxlength: [20, 'Referencia no puede ser mayor a 20 caracteres'], index: { unique: true, sparse: true } })
  colorRef?: string;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Product',
    required: false,
  })
  products: Product[];

  createdAt: Date;

  updatedAt: Date;
}

export const ProductColorSchema = SchemaFactory.createForClass(ProductColor);