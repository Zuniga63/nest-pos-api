import { ApiProperty } from '@nestjs/swagger';
import { IImage } from 'src/utils';

export class UserDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ example: 'Jhon Doe' })
  name: string;

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  role?: string;

  @ApiProperty({ example: 'jhondoe@example.com' })
  email: string;

  @ApiProperty({ deprecated: true })
  profilePhoto?: IImage;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
