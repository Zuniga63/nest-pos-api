import { ApiProperty } from '@nestjs/swagger';

export class ProductColorDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ example: 'My color' })
  name: string;

  @ApiProperty({ example: '#000' })
  code: `#${string}`;

  @ApiProperty({ example: 'my-color-ref' })
  colorRef?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
