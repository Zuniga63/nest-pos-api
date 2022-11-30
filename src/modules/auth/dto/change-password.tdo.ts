import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { strongPass } from 'src/utils';
import { Match } from 'src/utils/decorators/match.decorator';

export class ChangePasswordDto {
  @ApiProperty({ required: true, example: 'Clave123*' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true, example: 'Clave123*' })
  @Matches(strongPass, { message: 'La contraseña no es segura' })
  @MinLength(8, { message: 'La contraseña debe tener minimo 8 caracteres' })
  @IsString()
  newPassword: string;

  @ApiProperty({ required: true, example: 'Clave123*' })
  @Match('newPassword', { message: 'Las contraseñas no coinciden.' })
  @IsString()
  passwordConfirm: string;
}
