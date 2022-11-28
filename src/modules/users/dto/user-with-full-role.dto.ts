import { UserDto } from './user.dto';
import { RoleDto } from 'src/modules/roles/dto/role.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UserWithFullRoleDto extends OmitType(UserDto, ['role'] as const) {
  @ApiProperty({
    type: OmitType(RoleDto, ['users']),
  })
  role: Omit<RoleDto, 'users'>;
}
