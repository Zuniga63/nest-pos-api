import { ApiProperty } from '@nestjs/swagger';
import { ImageDto } from 'src/dto/image.dto';
import { IImage } from 'src/types';

export class UserDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ example: 'Jhon Doe' })
  name: string;

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  role?: string;

  @ApiProperty({ example: 'jhondoe@example.com' })
  email: string;

  @ApiProperty({ type: ImageDto })
  profilePhoto?: IImage;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  isAdmin: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
