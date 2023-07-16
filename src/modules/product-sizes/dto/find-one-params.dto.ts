import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class FindOneParams {
  @ApiProperty({
    description: 'Product size ID',
    required: true,
    type: 'string',
    default: '61d9cfbf17ed7311c4b3e485',
  })
  @IsString()
  @IsMongoId({ message: 'El ID de la talla no tiene el formato correcto' })
  id: string;
}
