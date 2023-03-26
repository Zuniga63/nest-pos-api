import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { CashboxTransaction } from './cashbox-transaction.schema';
import { Cashbox } from './cashbox.schema';

export type CashTransferDocument = HydratedDocument<CashTransfer>;

Schema({ timestamps: true });
export class CashTransfer {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Cashbox',
    required: [true, 'La caja remitente es requerida'],
  })
  senderBox: Cashbox;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Cashbox',
    required: [true, 'La caja destino es requerida'],
  })
  addresseeBox: Cashbox;

  @Prop({ required: [true, 'La fecha es requerida.'] })
  transferDate: Date;

  @Prop({ required: [true, 'El monto es requerido'] })
  amount: number;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'CashboxTransaction',
    default: [],
  })
  transactions: CashboxTransaction[];
}

export const CashTransferSchema = SchemaFactory.createForClass(CashTransfer);
