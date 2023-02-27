import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { FilterQuery, isValidObjectId, Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
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
    box.transactions.forEach((t) => {
      box.balance += t.amount;
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
    cashbox.depopulate('cashier');

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
}
