import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(createRoleDto: CreateRoleDto) {
    const count = await this.roleModel.count();
    const role = await this.roleModel.create({
      ...createRoleDto,
      order: count + 1,
    });

    return { role };
  }

  async findAll() {
    return await this.roleModel.find({}).sort('order');
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Rol no encontrado');

    return { role };
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { name, order } = updateRoleDto;

    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Rol no encontrado');

    if (name && name !== role.name) {
      role.name = name;
      await role.save();
    }

    if (order && order !== role.order) {
      const count = await this.roleModel.count();

      if (role.order < count) {
        // All roles with higher order are reduced by one degree
        await this.roleModel.updateMany(
          { order: { $gt: role.order } },
          { $inc: { order: -1 } }
        );
      }

      // Update the order of current role
      role.order = order < count ? order : count;
      await role.save({ validateModifiedOnly: true });

      if (role.order !== count) {
        // All roles with equal or higher order are increased by one grade.
        await this.roleModel
          .updateMany({ order: { $gte: role.order } }, { $inc: { order: 1 } })
          .where('_id')
          .ne(role._id);
      }
    }

    return { role };
  }

  async remove(id: string) {
    const roleDeleted = await this.roleModel.findByIdAndDelete(id);
    if (!roleDeleted) throw new NotFoundException('Rol no encontrado');

    // Update the order of rest roles
    await this.roleModel.updateMany(
      { order: { $gt: roleDeleted.order } },
      { $inc: { order: -1 } }
    );

    return { ok: true, role: roleDeleted };
  }

  async updatePermissions(id: string, { permissions }: UpdatePermissionsDto) {
    const role = await this.roleModel.findByIdAndUpdate(
      id,
      { permissions: permissions },
      { new: true }
    );
    if (!role) throw new NotFoundException('Rol no encontrado');

    return { role, permissions };
  }
}
