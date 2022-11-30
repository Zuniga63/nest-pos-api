import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { compareSync } from 'bcrypt';
import { User } from 'src/modules/users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    pass: string
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOneByEmail(username);

    if (user && user.isActive && compareSync(pass, user.password)) {
      const { password: _, ...result } = user.toObject();
      return result;
    }

    return null;
  }

  protected createAccessToken(user: Omit<User, 'password'>) {
    const payload = { username: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async login(user: Omit<User, 'password'>) {
    return { user, access_token: this.createAccessToken(user) };
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }

  async updateProfilePhoto(
    user: Omit<User, 'password'>,
    file: Express.Multer.File
  ) {
    const userUpdated = await this.usersService.updateProfilePhoto(
      user.id,
      file
    );
    return { user: userUpdated };
  }

  async removeProfilePhoto(user: Omit<User, 'password'>) {
    const userUpdated = await this.usersService.removeProfilePhoto(user.id);

    return { user: userUpdated };
  }
}
