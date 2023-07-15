import { ApiProperty } from '@nestjs/swagger';

export class ProductTagDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ example: 'My Tag' })
  name: string;

  @ApiProperty({ example: 'my-tag' })
  slug: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
