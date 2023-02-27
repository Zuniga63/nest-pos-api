import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { Cashbox } from './cashbox.schema';

export type CashboxTransactionDocument = HydratedDocument<CashboxTransaction>;

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class CashboxTransaction {
  id: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Cashbox',
    required: false,
  })
  cashbox?: Cashbox;

  @Prop({ required: [true, 'La fecha es requerida.'] })
  transactionDate: Date;

  @Prop({ required: [true, 'La descripción es requerida.'] })
  description: string;

  @Prop({ required: [true, 'El monto es requerido'] })
  amount: number;

  @Prop({ default: false })
  isTransfer: boolean;
}

export const CashboxTransactionSchema =
  SchemaFactory.createForClass(CashboxTransaction);
