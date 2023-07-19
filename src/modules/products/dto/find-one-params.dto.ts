import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class FindOneParams {
  @ApiProperty({
    description: 'Product ID',
    required: true,
    type: 'string',
    default: '61d9cfbf17ed7311c4b3e485',
  })
  @IsMongoId({ message: 'El ID del producto no tiene el formato correcto' })
  id: string;
}
