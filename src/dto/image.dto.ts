import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @ApiProperty()
  publicId: string;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  format: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  url: string;
}
