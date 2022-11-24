import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { genSaltSync, hashSync } from 'bcrypt';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function encryptPassword(next) {
            const saltRounds = 10;

            if (this.isModified('password') || this.isNew) {
              const salt = genSaltSync(saltRounds);
              const hash = hashSync(this.password, salt);
              this.password = hash;
            }

            next();
          });

          return schema;
        },
      },
    ]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
