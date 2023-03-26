import { PartialType } from '@nestjs/swagger';
import { CreateCashboxDto } from './create-cashbox.dto';

export class UpdateCashboxDto extends PartialType(CreateCashboxDto) {}
