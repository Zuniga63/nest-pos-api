import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Permission } from 'src/modules/auth/permission.enum';

export class UpdatePermissionsDto {
  @ApiProperty({ required: true, enum: Permission, isArray: true })
  @IsEnum(Permission, {
    each: true,
    message: 'Cada permiso debe ter un valor valido',
  })
  permissions: Permission[];
}
