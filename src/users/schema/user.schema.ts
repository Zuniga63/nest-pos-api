import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';
import { emailRegex, IImage } from 'src/utils';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  id: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Role' })
  role: Role;

  @Prop({
    required: [true, 'El nombre de usuario es requerido'],
    minlength: [3, 'El nombre de usuario es muy corto.'],
    maxlength: [90, 'El nombre de usuario es muy largo'],
  })
  name: string;

  @Prop({
    unique: true,
    match: [emailRegex, 'No es un correo electronico válido'],
  })
  email: string;

  @Prop({ type: Date, required: false })
  emailVerifiedAt?: Date;

  @Prop({ required: [true, 'Se requeire una contraseña'] })
  password: string;

  @Prop({ type: Object })
  profilePhoto?: IImage;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
