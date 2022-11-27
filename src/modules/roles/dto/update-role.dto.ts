import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  name?: string | undefined;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'El orden debe ser mayor que cero (0)' })
  @ApiProperty({ example: 1 })
  order?: number | undefined;
}
