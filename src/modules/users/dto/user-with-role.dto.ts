import { ApiProperty, OmitType } from '@nestjs/swagger';
import { RoleDto } from 'src/modules/roles/dto/role.dto';
import { UserDto } from './user.dto';

export class UserWithRoleDto extends OmitType(UserDto, ['role']) {
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
  })
  role?: Pick<RoleDto, 'id' | 'name'>;
}
