import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IImage } from 'src/types';

export type ProductBrandDocument = HydratedDocument<ProductBrand>;

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class ProductBrand {
  id: string;

  @Prop({
    required: [true, 'El nombre de la marca es requerido'],
    minlength: [3, 'Nombre muy corto.'],
    maxlength: [45, 'Nombre demsiado largo'],
    unique: true,
  })
  name: string;

  @Prop({ type: Object })
  image?: IImage;

  createdAt: Date;

  updatedAt: Date;
}

export const ProductBrandSchema = SchemaFactory.createForClass(ProductBrand);
