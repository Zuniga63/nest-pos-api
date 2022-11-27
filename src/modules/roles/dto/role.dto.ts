import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ example: ['61d9cfbf17ed7311c4b3e485'] })
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
