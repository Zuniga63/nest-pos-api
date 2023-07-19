import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { ProductBrand } from 'src/modules/product-brands/schemas/product-brand.schema';
import { ProductCategory } from 'src/modules/product-categories/schemas/product-category.schema';
import { ProductColor } from 'src/modules/product-colors/schemas/product-color.schema';
import { ProductSize } from 'src/modules/product-sizes/schemas/product-size.schema';
import { ProductTag } from 'src/modules/product-tags/schemas/product-tag.schema';
import { IImage } from 'src/types';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class Product {
  id: string;

  @Prop({
    required: [true, 'El nombre del producto es requerido'],
    minlength: [3, 'Minimo debe tener 3 caracteres'],
    maxlength: [45, 'Maximo debe terner 45 caracteres'],
  })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: false })
  description?: string;

  @Prop({
    maxlength: [20, 'Maximo debe terner 45 caracteres'],
    index: { unique: true, sparse: true },
  })
  barcode?: string;

  @Prop({
    maxlength: [20, 'Maximo debe terner 45 caracteres'],
    required: false,
  })
  productRef?: string;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'ProductCategory',
    required: false,
  })
  categories: ProductCategory[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ProductSize',
    required: false,
  })
  size?: ProductSize;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ProductColor',
    required: false,
  })
  color?: ProductColor;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'ProductTag',
    required: false,
  })
  tags: ProductTag[];

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'ProductBrand',
    required: false,
  })
  productBrand?: ProductBrand;

  @Prop({ type: Object, required: false })
  image?: IImage;

  @Prop({ type: [Object], required: false })
  gallery: IImage[];

  @Prop({ required: true, default: 0, min: [0, 'Debe ser un valor positivo'] })
  price: number;

  @Prop({ required: true, default: false })
  hasDiscount: boolean;

  @Prop({ required: false, min: [0, 'Debe ser un valor positivo'] })
  priceWithDiscount?: number;

  @Prop({ required: true, default: false })
  isInventoriable: boolean;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ required: false })
  cost?: number;

  @Prop({ required: false })
  averageCost?: number;

  @Prop({ required: true, default: 0 })
  inventoryValue: number;

  @Prop({ required: true, default: true })
  isEnabled: boolean;

  @Prop({ required: true, default: true })
  isPublished: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
