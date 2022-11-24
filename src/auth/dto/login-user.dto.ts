import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'User Email' })
  email: string;

  @IsString()
  @ApiProperty({ required: true, description: 'User password' })
  password: string;
}
