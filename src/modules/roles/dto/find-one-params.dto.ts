import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class FindOneParams {
  @ApiProperty({
    description: 'Role id',
    required: true,
    type: 'string',
    default: '61d9cfbf17ed7311c4b3e485',
  })
  @IsString()
  @IsMongoId({ message: 'El ID del rol es inválido' })
  roleId: string;
}
