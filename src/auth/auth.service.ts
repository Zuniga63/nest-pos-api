import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcrypt';
import { User } from 'src/users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';

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

  async login(user: Omit<User, 'password'>) {
    const payload = { username: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
