import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schema/user.schema';
import { CashboxTransaction } from './cashbox-transaction.schema';
import { Cashbox } from './cashbox.schema';

export type CashClosingRecordDocument = HydratedDocument<CashClosingRecord>;

@Schema({ timestamps: true })
export class CashClosingRecord {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Cashbox',
    required: false,
  })
  cashbox?: Cashbox;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  user?: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  cashier?: User;

  @Prop({ required: false })
  userName: string;

  @Prop({ required: false })
  cashierName: string;

  @Prop({ required: false })
  boxName: string;

  @Prop({ required: [true, 'La fecha de apertura es requerida.'] })
  opened: Date;

  @Prop({ required: [true, 'La fecha de cierre es requerida.'] })
  closingDate: Date;

  @Prop({ required: [true, 'La base es requerida'] })
  base: number;

  @Prop({ required: false })
  incomes: number;

  @Prop({ required: false })
  expenses: number;

  @Prop({ required: [true, 'Se requiere el arqueo de caja'] })
  cash: number;

  @Prop({ type: Object, required: false })
  coins?: object;

  @Prop({ type: Object, required: false })
  bills?: object;

  @Prop({ required: false })
  leftover?: number;

  @Prop({ required: false })
  missing?: number;

  @Prop({ required: false })
  observation?: string;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'CashboxTransaction',
    default: [],
  })
  transactions: CashboxTransaction[];
}

export const CashClosingRecordSchema = SchemaFactory.createForClass(CashClosingRecord);
