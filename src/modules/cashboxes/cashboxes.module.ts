import { Module } from '@nestjs/common';
import { CashboxesService } from './cashboxes.service';
import { CashboxesController } from './cashboxes.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Cashbox, CashboxSchema } from './schemas/cashbox.schema';
import {
  CashboxTransaction,
  CashboxTransactionSchema,
} from './schemas/cashbox-transaction.schema';
import {
  CashClosingRecord,
  CashClosingRecordSchema,
} from './schemas/cash-closing-record.schema';
import { User, UserSchema } from '../users/schema/user.schema';
import {
  CashTransfer,
  CashTransferSchema,
} from './schemas/cash-transfer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cashbox.name, schema: CashboxSchema },
      { name: CashboxTransaction.name, schema: CashboxTransactionSchema },
      { name: CashClosingRecord.name, schema: CashClosingRecordSchema },
      { name: CashTransfer.name, schema: CashTransferSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CashboxesController],
  providers: [CashboxesService],
})
export class CashboxesModule {}
