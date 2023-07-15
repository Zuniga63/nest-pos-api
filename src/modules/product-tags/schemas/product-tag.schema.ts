import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

  createdAt: Date;

  updatedAt: Date;
}

export const ProductTagSchema = SchemaFactory.createForClass(ProductTag);
