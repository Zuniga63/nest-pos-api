import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { strongPass } from 'src/utils';
import { Match } from 'src/utils/decorators/match.decorator';

export class CreateUserDto {
  @ApiProperty({ required: true, example: 'Jhon Doe' })
  @MaxLength(90, { message: 'El nombre de usuario es muy largo' })
  @MinLength(3, { message: 'El nombre de usuario es muy corto' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  name: string;

  @ApiProperty({ required: true, example: 'jhondoe@example.com' })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  email: string;

  @ApiProperty({ required: true, example: 'Clave123*' })
  @Matches(strongPass, { message: 'La contraseña no es segura' })
  @MinLength(8, { message: 'La contraseña debe tener minimo 8 caracteres' })
  @IsString()
  password: string;

  @ApiProperty({ required: true, example: 'Clave123*' })
  @Match('password', { message: 'Las contraseñas no coinciden.' })
  @IsString()
  passwordConfirm: string;
}
