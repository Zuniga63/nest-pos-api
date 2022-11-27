import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schema/user.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  id: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
  })
  users: User[];

  @Prop({
    type: [String],
  })
  permissions: string[];

  @Prop({
    type: String,
    required: [true, 'El nombre es requerido.'],
    maxlength: [45, 'El nombre del rol es demasiado largo'],
  })
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ required: true })
  order: number;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
