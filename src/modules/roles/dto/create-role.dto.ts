import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(90, { message: 'El nombre es demasiado largo' })
  @ApiProperty({ required: true, example: 'Administrador' })
  name: string;
}
