import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/modules/roles/schemas/role.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>
  ) {}

  async create(createUserDto: CreateUserDto) {
    // *The password encrytion ocurrs in the pre.save hook of the model.
    const isFirstUser = (await this.userModel.count()) <= 0;

    const user = await this.userModel.create({
      isAdmin: isFirstUser,
      ...createUserDto,
    });

    const { password: _, ...result } = user.toObject();
    return result;
  }

  async findAll() {
    const users = await this.userModel
      .find({})
      .sort('name')
      .populate<{ role: RoleDocument }>('role', 'name')
      .select('-password');
    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .populate('role', '-users');

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .populate<{ role: RoleDocument }>('role', 'name')
      .select('-password');
    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).select('-password');
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.role) {
      await this.roleModel.findByIdAndUpdate(user.role, {
        $pull: { users: user._id },
      });
    }
    return user;
  }

  async addRole(userId: string, roleId: string) {
    const [userExists, roleExists] = await Promise.all([
      this.userModel.exists({ _id: userId }),
      this.roleModel.exists({ _id: roleId }),
    ]);

    if (!userExists || !roleExists) {
      let message = 'El usuario y el rol no existen.';
      if (userExists) message = 'El rol no existe o fue eliminado.';
      else if (roleExists) message = 'El usuario no existe o fue eliminado.';

      throw new NotFoundException(message);
    }

    const [role, user] = await Promise.all([
      this.roleModel
        .findByIdAndUpdate(
          roleId,
          { $addToSet: { users: userId } },
          { new: true }
        )
        .select('name'),
      this.userModel
        .findByIdAndUpdate(userId, { role: roleId }, { new: true })
        .populate('role', 'name'),
    ]);

    return { role, user };
  }

  async removeRole(userId: string, roleId: string) {
    const [role, user] = await Promise.all([
      this.roleModel
        .findByIdAndUpdate(roleId, { $pull: { users: userId } }, { new: true })
        .select('name'),
      this.userModel.findByIdAndUpdate(
        userId,
        { role: undefined },
        { new: true }
      ),
    ]);

    return { role, user };
  }
}
