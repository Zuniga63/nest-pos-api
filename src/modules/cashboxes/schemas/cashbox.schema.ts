import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schema/user.schema';
import { CashClosingRecord } from './cash-closing-record.schema';
import { CashboxTransaction } from './cashbox-transaction.schema';

export type CashboxDocument = HydratedDocument<Cashbox>;

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class Cashbox {
  id: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  cashier?: User;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'User',
    default: [],
  })
  users: User[];

  @Prop({
    required: true,
    minlength: [3, 'Debe tener minimo 3 caracteres'],
    maxlength: [45, 'Debe tener un maximo de 45 caracteres'],
  })
  name: string;

  @Prop({ required: false })
  cashierName?: string;

  @Prop({ min: [0, 'La base no puede ser negativa'], default: 0 })
  base: number;

  @Prop({ required: false })
  openBox?: Date;

  @Prop({ required: false })
  closed?: Date;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'CashboxTransaction',
    default: [],
  })
  transactions: CashboxTransaction[];

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'CashClosingRecord',
    default: [],
  })
  closingRecords: CashClosingRecord[];

  balance: number;
}

export const CashboxSchema = SchemaFactory.createForClass(Cashbox);

CashboxSchema.virtual('balance').get(function () {
  return this.base;
});
