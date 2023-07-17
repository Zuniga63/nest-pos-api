import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { IImage } from 'src/types';

export type ProductCategoryDocument = HydratedDocument<ProductCategory>;

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class ProductCategory {
  id: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ProductCategory',
    required: false,
  })
  mainCategory?: ProductCategory;

  @Prop({
    required: [true, 'El nombre de la categoría es requerido'],
    minlength: [3, 'Nombre muy corto.'],
    maxlength: [45, 'Nombre demsiado largo'],
  })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true, default: 1, min: [1, 'Debe ser mayor que cero(0)'] })
  order: number;

  @Prop({ type: Object, required: false })
  image?: IImage;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'ProductCategory',
    required: false,
  })
  subcategories: ProductCategory[];

  @Prop({ required: true, default: true })
  isEnabled: boolean;

  @Prop({ required: true, default: true })
  isPublished: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export const ProductCategorySchema = SchemaFactory.createForClass(ProductCategory);
