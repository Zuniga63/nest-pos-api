import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ format: 'uuid' })
  users: string[];

  @ApiProperty({ example: ['create-role', 'update-role'] })
  permissions: string[];

  @ApiProperty({ example: 'Administrador' })
  name: string;

  @ApiProperty({ example: 'administrador' })
  slug: string;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
