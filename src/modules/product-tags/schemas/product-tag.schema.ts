import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';

export type ProductTagDocument = HydratedDocument<ProductTag>;

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class ProductTag {
  id: string;

  @Prop({
    required: [true, 'El nombre de la marca es requerido'],
    minlength: [3, 'Nombre muy corto.'],
    maxlength: [45, 'Nombre demsiado largo'],
    unique: true,
  })
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Product',
    required: false,
  })
  products: Product[];

  createdAt: Date;

  updatedAt: Date;
}

export const ProductTagSchema = SchemaFactory.createForClass(ProductTag);
