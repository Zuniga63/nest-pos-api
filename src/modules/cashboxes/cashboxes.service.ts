import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { FilterQuery, isValidObjectId, Model, Types } from 'mongoose';
import { IValidationError } from 'src/utils/all-exceptions.filter';
import { User, UserDocument } from '../users/schema/user.schema';
import { CashTransferDto } from './dto/cash-transfer.dto';
import { CloseBoxDto } from './dto/close-box.dto';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { CreateTransactionDto } from './dto/create-transation.dto';
import { OpenBoxDto } from './dto/open-box.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';
import {
  CashClosingRecord,
  CashClosingRecordDocument,
} from './schemas/cash-closing-record.schema';
import {
  CashTransfer,
  CashTransferDocument,
} from './schemas/cash-transfer.schema';
import {
  CashboxTransaction,
  CashboxTransactionDocument,
} from './schemas/cashbox-transaction.schema';
import { Cashbox, CashboxDocument } from './schemas/cashbox.schema';

@Injectable()
export class CashboxesService {
  constructor(
    @InjectModel(Cashbox.name) private cashboxModel: Model<CashboxDocument>,
    @InjectModel(CashboxTransaction.name)
    private transactionModel: Model<CashboxTransactionDocument>,
    @InjectModel(CashClosingRecord.name)
    private closingModel: Model<CashClosingRecordDocument>,
    @InjectModel(CashTransfer.name)
    private cashTransferModel: Model<CashTransferDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  // --------------------------------------------------------------------------
  // UTILS
  // --------------------------------------------------------------------------
  /**
   * This method validates thath they are valid mongose ids and remove duplicates.
   * @param userIds
   * @returns
   */
  protected getUniqueIds(userIds?: string[], currentUserId?: string): string[] {
    const ids = userIds
      ? [
          ...new Set(
            userIds
              .filter((id) => isValidObjectId(id))
              .map((id) => id.toLocaleLowerCase())
          ),
        ]
      : [];

    if (currentUserId && !ids.includes(currentUserId)) {
      ids.push(currentUserId);
    }

    return ids;
  }

  /**
   * This method get the users with their ids and repéctive boxes.
   * @param userIds
   * @param user
   * @returns
   */
  protected async getUsers(userIds?: string[], user?: User) {
    // Validate IDs and remove duplicate
    const ids = this.getUniqueIds(userIds, user?.id);

    const users = await this.userModel
      .find({ _id: { $in: ids } })
      .select('boxes');

    return users.filter((item) => Boolean(item)) as UserDocument[];
  }

  protected async getUsersWithPopulateBoxes(userIds?: string[], user?: User) {
    const ids = this.getUniqueIds(userIds, user?.id);
    const users = await this.userModel
      .find({ _id: { $in: ids } })
      .select('boxes')
      .populate('boxes', '_id');

    return users.filter((user) => Boolean(user)) as UserDocument[];
  }

  protected buildCashboxFilter(user: User, id?: string) {
    const filterQuery: FilterQuery<CashboxDocument> = {};

    if (!user.isAdmin) {
      filterQuery.users = user.id;
    }

    if (id) {
      filterQuery._id = id;
    }

    return filterQuery;
  }

  // --------------------------------------------------------------------------
  // CASHBOX CRUD
  // --------------------------------------------------------------------------

  async create(createCashboxDto: CreateCashboxDto, user: User) {
    const { name, userIds } = createCashboxDto;
    const users = await this.getUsers(userIds, user);
    const cashbox = await this.cashboxModel.create({ name, users });

    // Add the new box to the users
    await Promise.all(
      users.map((user) => {
        user?.boxes.push(cashbox);
        return user?.save({ validateBeforeSave: false });
      })
    );

    return cashbox;
  }

  async findAll(user: User) {
    // Get the cashboxes that the user can see
    const filter = this.buildCashboxFilter(user);

    const boxes = await this.cashboxModel
      .find(filter)
      .sort('name')
      .populate('cashier', 'name');

    // For each casbox, the sum of the transactions is recovered
    const sums = await this.transactionModel
      .aggregate<{
        _id: Types.ObjectId | null;
        amount: number;
      }>()
      .match({
        cashbox: { $in: boxes.map((item) => item._id) },
      })
      .group({ _id: '$cashbox', amount: { $sum: '$amount' } });

    // Update the balance of each box
    return boxes.map((boxItem) => {
      const sum = sums.find((sumItem) => sumItem._id?.equals(boxItem._id));
      const box = boxItem.toObject();
      box.balance += sum?.amount || 0;
      return box;
    });
  }

  async findOne(id: string, user: User) {
    const filter = this.buildCashboxFilter(user, id);

    const boxDocument = await this.cashboxModel
      .findOne(filter)
      .populate('cashier', 'name')
      .populate({
        path: 'users',
        select: 'name',
        options: { sort: { name: 1 } },
      })
      .populate({
        path: 'transactions',
        options: { sort: { transactionDate: 1 } },
      })
      .populate({
        path: 'closingRecords',
        select:
          'cashierName opened closingDate base incomes cash leftover missing observation',
        options: { sort: { closingDate: -1 }, limit: 10 },
      });

    if (!boxDocument) {
      throw new NotFoundException('Caja no encontrada');
    }

    // Update the box balance
    const box = boxDocument.toObject();

    box.transactions = box.transactions.map((transaction) => {
      box.balance += transaction.amount;
      transaction.balance = box.balance;
      return transaction;
    });

    return box;
  }

  async update(id: string, updateCashboxDto: UpdateCashboxDto, user: User) {
    const { name, userIds } = updateCashboxDto;
    const updates: Promise<any>[] = [];
    const filter = this.buildCashboxFilter(user, id);

    const boxDocument = await this.cashboxModel
      .findOne(filter)
      .populate('transactions', 'amount')
      .populate('users', '_id');

    if (!boxDocument) {
      throw new NotFoundException('Caja no encontrada');
    }

    if (name) {
      boxDocument.name = name;
    }

    if (userIds) {
      const [newUsers, currentUsers] = await Promise.all([
        this.getUsersWithPopulateBoxes(userIds, user),
        this.getUsersWithPopulateBoxes(boxDocument.users.map(({ id }) => id)),
      ]);

      // Add cashbox to new user
      newUsers.forEach((newUser) => {
        if (!currentUsers.some(({ id }) => id === newUser.id)) {
          newUser.boxes.push(boxDocument);
          updates.push(newUser.save({ validateBeforeSave: false }));
        }
      });

      // Remove cashbox to the curren user
      currentUsers.forEach((currentUser) => {
        if (!newUsers.some(({ id }) => currentUser.id === id)) {
          const { boxes } = currentUser;
          currentUser.boxes = boxes.filter(({ id }) => id !== boxDocument.id);
          updates.push(currentUser.save({ validateBeforeSave: false }));
        }
      });

      boxDocument.users = newUsers;
    }

    updates.push(boxDocument.save({ validateModifiedOnly: true }));

    await Promise.all(updates);

    const boxBalance = boxDocument.transactions.reduce(
      (balance, { amount }) => balance + amount,
      boxDocument.base
    );

    boxDocument.depopulate('transactions').depopulate('users');

    const box = boxDocument.toObject();
    box.balance = boxBalance;

    return box;
  }

  async remove(id: string, user: User) {
    const promises: Promise<any>[] = [];
    const filter = this.buildCashboxFilter(user, id);
    const cashbox = await this.cashboxModel.findOne(filter);

    if (!cashbox) {
      throw new NotFoundException('Caja no encontrada');
    }

    if (cashbox.openBox) {
      throw new BadRequestException('La caja debe cerrarse primero');
    }

    // Remove box from each user
    const boxUsers = await this.userModel
      .find({ _id: { $in: cashbox.users } })
      .select('boxes')
      .populate('boxes', '_id');

    boxUsers.forEach((boxUser) => {
      boxUser.boxes = boxUser.boxes.filter(({ id }) => id !== cashbox.id);
      promises.push(boxUser.save({ validateBeforeSave: false }));
    });

    await this.closingModel.updateMany(
      { cashbox: cashbox.id },
      { $set: { cashbox: undefined } }
    );

    // delete the box
    promises.push(cashbox.remove());

    await Promise.all(promises);

    return cashbox;
  }

  // --------------------------------------------------------------------------
  // CASHBOX OPERATIONS
  // --------------------------------------------------------------------------
  async openCashbox(id: string, openBoxDto: OpenBoxDto, user: User) {
    const { base, date } = openBoxDto;

    // Get the cashbox
    const filter = this.buildCashboxFilter(user, id);
    const cashbox = await this.cashboxModel
      .findOne(filter)
      .where('openBox', null);

    if (!cashbox) {
      throw new NotFoundException();
    }

    cashbox.base = base || 0;
    cashbox.openBox = dayjs().toDate();
    cashbox.cashier = user;
    cashbox.cashierName = user.name;
    cashbox.closed = undefined;

    if (date && dayjs(date).isValid()) {
      const { closed } = cashbox;
      cashbox.openBox = closed && dayjs(closed).isAfter(date) ? closed : date;
    }

    await cashbox.save({ validateModifiedOnly: true });
    await cashbox.populate('cashier', 'name');

    return cashbox;
  }

  async closeCashbox(id: string, closeBoxDto: CloseBoxDto, user: User) {
    const { cash, observation } = closeBoxDto;
    const filter = this.buildCashboxFilter(user, id);
    const closeDate = dayjs().toDate();

    // Get the cashbox
    const cashbox = await this.cashboxModel
      .findOne(filter)
      .populate('cashier', 'name')
      .where('openBox')
      .ne(null);

    if (!cashbox) throw new NotFoundException();

    let incomes = 0;
    let expenses = 0;
    let balance = cashbox.base;
    let leftover: number | undefined;
    let missing: number | undefined;
    const promises: Promise<any>[] = [];
    const transactions = await this.transactionModel.find({
      cashbox: cashbox.id,
    });

    transactions.forEach((transaction) => {
      const { amount } = transaction;
      transaction.cashbox = undefined;

      if (amount > 0) incomes += amount;
      else expenses += Math.abs(amount);

      balance += amount;
    });

    if (balance > cash) {
      missing = balance - cash;
      const missingDescription = `Faltante de la caja ${
        cashbox.name
      } a cargo del cajero ${cashbox.cashier?.name || cashbox.cashierName}`;

      const missingTransaction = new this.transactionModel({
        transactionDate: closeDate,
        description: missingDescription,
        amount: missing * -1,
      });

      transactions.push(missingTransaction);
    } else if (balance < cash) {
      leftover = cash - balance;
      const leftoverDescription = `Sobrante de la caja ${
        cashbox.name
      } a cargo del cajero ${cashbox.cashier?.name || cashbox.cashierName}`;

      const letfoverTransaction = new this.transactionModel({
        transactionDate: closeDate,
        description: leftoverDescription,
        amount: leftover,
      });

      transactions.push(letfoverTransaction);
    }

    const closing = new this.closingModel({
      cashbox: cashbox.id,
      user: user,
      cashier: cashbox.cashier?.id,
      username: user.name,
      cashierName: cashbox.cashier?.name || cashbox.cashierName,
      boxName: cashbox.name,
      opened: cashbox.openBox,
      closingDate: closeDate,
      base: cashbox.base,
      incomes: incomes > 0 ? incomes : undefined,
      expenses: expenses > 0 ? expenses : undefined,
      cash,
      leftover,
      missing,
      transactions,
      observation,
    });

    cashbox.cashier = undefined;
    cashbox.base = 0;
    cashbox.openBox = undefined;
    cashbox.closed = closeDate;
    cashbox.transactions = [];
    cashbox.closingRecords.push(closing);

    promises.push(cashbox.save({ validateBeforeSave: false }));
    promises.push(
      ...transactions.map((t) => t.save({ validateBeforeSave: false }))
    );
    promises.push(closing.save());

    await Promise.all(promises);

    return cashbox.depopulate('transactions');
  }

  async addTransaction(
    id: string,
    createTransactionDto: CreateTransactionDto,
    user: User
  ) {
    // Get the cashbox
    const filter = this.buildCashboxFilter(user, id);
    const cashbox = await this.cashboxModel
      .findOne(filter)
      .where('openBox')
      .ne(null);
    if (!cashbox) throw new NotFoundException();

    // Create transaction
    const date = dayjs(createTransactionDto.transactionDate);
    const openBox = dayjs(cashbox.openBox);
    const transactionDate = date.isBefore(openBox)
      ? openBox.add(1, 'millisecond')
      : date;

    const transaction = await this.transactionModel.create({
      ...createTransactionDto,
      cashbox: cashbox.id,
      transactionDate,
    });

    // Update cashbox
    cashbox.transactions.push(transaction);
    await cashbox.save({ validateBeforeSave: false });

    return transaction;
  }

  async deleteTransaction(boxId: string, transactionId: string, user: User) {
    // Get the cashbox and transaction
    const filter = this.buildCashboxFilter(user, boxId);

    const [cashbox, transaction] = await Promise.all([
      this.cashboxModel
        .findOne(filter)
        .where('openBox')
        .populate('transactions', 'id')
        .ne(null),
      this.transactionModel.findById(transactionId),
    ]);
    if (!transaction || !cashbox) throw new NotFoundException();

    // Remove the transaction from cashbox
    cashbox.transactions = cashbox.transactions.filter(
      (boxTransaction) => boxTransaction.id !== transaction.id
    );

    // Delete transaction and update the cashbox
    await Promise.all([
      transaction.remove(),
      cashbox.save({ validateBeforeSave: false }),
    ]);

    return transaction;
  }

  // --------------------------------------------------------------------------
  // CASHBOX TRANSFER
  // --------------------------------------------------------------------------
  /**
   * Verify that IDs are differents and have a valid format.
   * @param senderBoxId ID of cashbox sending the found
   * @param addresseeBoxId ID of the cashbox receiving the found
   */
  protected validateCashTransferIds(
    senderBoxId: string,
    addresseeBoxId: string
  ) {
    const validationErrors: IValidationError = {};
    let hasError = false;

    if (senderBoxId === addresseeBoxId) {
      validationErrors.addresseeBoxId = {
        message: 'No se puede transferir fondos a la misma caja',
      };
      hasError = true;
    } else {
      if (!isValidObjectId(senderBoxId)) {
        validationErrors.senderBoxId = {
          message: 'No es una caja válida',
          value: senderBoxId,
        };

        hasError = true;
      }

      if (!isValidObjectId(addresseeBoxId)) {
        validationErrors.addresseeBoxId = {
          message: 'No es una caja válida',
          value: senderBoxId,
        };

        hasError = true;
      }
    }

    if (hasError) {
      throw new BadRequestException({ validationErrors });
    }
  }

  protected async validateCashTransfer(
    senderId: string,
    addresseeId: string,
    transferDate: Date,
    transferAmount: number,
    user: User
  ): Promise<[CashboxDocument, CashboxDocument]> {
    const validationErrors: IValidationError = {};
    let senderError: string | undefined;
    let addresseeError: string | undefined;

    const senderFilter = this.buildCashboxFilter(user, senderId);
    const addresseeFilter = this.buildCashboxFilter(user, addresseeId);

    const [senderBox, addresseeBox] = await Promise.all([
      this.cashboxModel
        .findOne(senderFilter)
        .populate('transactions', 'amount'),
      this.cashboxModel.findOne(addresseeFilter),
    ]);

    if (!senderBox) {
      senderError = 'La caja remitente no fue encontrada ';
      senderError += 'o no tienes acceso a ella';
    } else if (!senderBox.openBox) {
      senderError = 'La caja que envía los fondos no está abierta';
    } else if (dayjs(transferDate).isBefore(senderBox.openBox)) {
      senderError = 'La fecha de la transferencia ';
      senderError += 'es anterior a la apertura de la caja';
    } else {
      const amountSum = senderBox.transactions.reduce(
        (current, { amount }) => current + amount,
        0
      );
      const balance = senderBox.base + amountSum;

      if (balance < transferAmount) {
        senderError = 'Fondos insuficientes';
      }
    }

    if (!addresseeBox) {
      addresseeError = 'La caja destino no fue encontrada ';
      addresseeError += 'o no tienes acceso a ella';
    } else if (!addresseeBox.openBox) {
      addresseeError = 'La caja que recibe los fondos no está abierta';
    } else if (dayjs(transferDate).isBefore(addresseeBox.openBox)) {
      addresseeError = 'La fecha de la transferencia ';
      addresseeError += 'es anterior a la apertura de la caja';
    }

    if (senderError || addresseeError) {
      if (senderError) {
        validationErrors.senderBoxId.message = senderError;
        validationErrors.senderBoxId.value = senderId;
      }

      if (addresseeError) {
        validationErrors.addresseeBoxId.message = addresseeError;
        validationErrors.addresseeBoxId.value = addresseeId;
      }

      throw new BadRequestException({ validationErrors });
    }

    // ! Este caso no es probable
    if (!senderBox || !addresseeBox) {
      throw new NotFoundException('Alguna de las cajas no fue encontrada');
    }

    return [senderBox, addresseeBox];
  }

  async cashTransfer(cashTransferDto: CashTransferDto, user: User) {
    const { senderBoxId, addresseeBoxId, amount, description } =
      cashTransferDto;
    const transferDate = cashTransferDto.transferDate || dayjs().toDate();

    const [senderBox, addresseeBox] = await this.validateCashTransfer(
      senderBoxId,
      addresseeBoxId,
      transferDate,
      amount,
      user
    );
    let senderDescription = `Transferencia de fondos a la caja ${addresseeBox.name}`;
    let addresseeDescription = `Deposito de fondos desde la caja ${senderBox.name}`;

    if (description) {
      senderDescription += `: ${description}`;
      addresseeDescription += `: ${description}`;
    }

    const senderTransaction = new this.transactionModel({
      cashbox: senderBox._id,
      transactionDate: transferDate,
      description: senderDescription,
      amount: amount * -1,
    });

    const addresseeTransaction = new this.transactionModel({
      cashbox: addresseeBox._id,
      transactionDate: transferDate,
      description: addresseeDescription,
      amount,
    });

    senderBox.transactions.push(senderTransaction.id);
    addresseeBox.transactions.push(addresseeTransaction.id);

    const transferReport = new this.cashTransferModel({
      senderBox,
      addresseeBox,
      transferDate,
      amount,
      transactions: [senderTransaction._id, addresseeTransaction._id],
    });

    senderTransaction.isTransfer = transferReport.id;
    addresseeTransaction.isTransfer = transferReport.id;

    await Promise.all([
      senderBox.save({ validateBeforeSave: false }),
      senderTransaction.save(),
      addresseeBox.save({ validateBeforeSave: false }),
      addresseeTransaction.save(),
      transferReport.save(),
    ]);

    return {
      senderBoxId: senderBox.id,
      addresseeBoxId: addresseeBox.id,
      senderTransaction: senderTransaction,
    };
  }

  // --------------------------------------------------------------------------
  // TRANSACTIONS
  // --------------------------------------------------------------------------

  async findAllTransactions() {
    const transactionDocuments = await this.transactionModel
      .find({
        isTransfer: null,
      })
      .sort('transactionDate')
      .populate('cashbox', 'name');

    let balance = 0;
    return transactionDocuments.map((document) => {
      balance += document.amount;
      return { ...document.toObject(), balance };
    });
  }

  async getGlobalBalance() {
    const sums = await this.transactionModel
      .aggregate<{ _id: null; balance: number }>()
      .group({ _id: null, balance: { $sum: '$amount' } });

    const globalSum = sums.find((item) => item._id === null);
    if (globalSum) {
      return globalSum.balance;
    }

    return 0;
  }

  async deleteMainTransaction(transactionId: string) {
    const transaction = await this.transactionModel.findByIdAndDelete(
      transactionId
    );
    if (!transaction) throw new NotFoundException();

    return transaction;
  }

  async storeMainTransaction(createTransactionDto: CreateTransactionDto) {
    // Create transaction
    const transactionDate = dayjs(createTransactionDto.transactionDate);

    const transaction = await this.transactionModel.create({
      ...createTransactionDto,
      transactionDate,
    });

    return transaction;
  }
}
