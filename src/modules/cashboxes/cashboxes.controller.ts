import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import ValidationErrorDto from 'src/dto/validation-error.dto';
import { RequirePermissions } from '../auth/decorators/required-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuards } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/permission.enum';
import { User } from '../users/schema/user.schema';
import { CashboxesService } from './cashboxes.service';
import CashboxWithAll from './dto/cashbox-with-all.dto';
import { CashboxDto } from './dto/cashbox.dto';
import { CloseBoxDto } from './dto/close-box.dto';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { CreateTransactionDto } from './dto/create-transation.dto';
import { NewCashboxDto } from './dto/new-cashbox.dto';
import { OpenBoxDto } from './dto/open-box.dto';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';

@Controller('cashboxes')
@UseGuards(JwtAuthGuard, PermissionsGuards)
@ApiTags('Cashboxes')
@ApiBearerAuth()
@ApiForbiddenResponse({
  description: 'Only user with the permissions can acces to this end points.',
})
export class CashboxesController {
  constructor(private readonly cashboxesService: CashboxesService) {}

  // ------------------------------------------------------------------------------------
  // CRATE CASHBOX
  // ------------------------------------------------------------------------------------
  @Post()
  @RequirePermissions(Permission.CREATE_NEW_CASHBOX)
  @ApiOperation({
    summary: 'Create New Cashbox',
    description: 'This end point create a new cashbox.',
  })
  @ApiCreatedResponse({
    description: 'The cashbox has been successfully create',
    type: NewCashboxDto,
  })
  @ApiBadRequestResponse({
    description:
      'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  create(@Body() createCashboxDto: CreateCashboxDto, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException();
    return this.cashboxesService.create(createCashboxDto, req.user as User);
  }

  // ------------------------------------------------------------------------------------
  // GET ALL CASHBOX
  // ------------------------------------------------------------------------------------
  @Get()
  @RequirePermissions(Permission.READ_CASHBOX)
  @ApiOperation({
    summary: 'Get all cashbox',
    description: 'This end point return a cashbox list that user can access',
  })
  @ApiOkResponse({ description: 'Ok', type: [CashboxDto] })
  findAll(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException();
    return this.cashboxesService.findAll(req.user as User);
  }

  // ------------------------------------------------------------------------------------
  // GET ONE CASHBOX
  // ------------------------------------------------------------------------------------
  @Get(':id')
  @RequirePermissions(Permission.READ_CASHBOX)
  @ApiOperation({ summary: 'Get cashbox by Id' })
  @ApiOkResponse({ type: CashboxWithAll })
  @ApiNotFoundResponse({
    description:
      'The searched box was not found or you do not have access to it',
  })
  findOne(@Param('id') id: string, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException();
    return this.cashboxesService.findOne(id, req.user as User);
  }

  // ------------------------------------------------------------------------------------
  // UPDATE CASHBOX BY ID
  // ------------------------------------------------------------------------------------
  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_CASHBOX)
  @ApiOperation({ summary: 'Update cashbox by Id' })
  @ApiOkResponse({ description: 'Ok', type: CashboxDto })
  @ApiNotFoundResponse({
    description:
      'The cashbox was not found or you do not have access to update',
  })
  @ApiBadRequestResponse({
    description:
      'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateCashboxDto: UpdateCashboxDto,
    @Req() req: Request
  ) {
    if (!req.user) throw new UnauthorizedException();
    return this.cashboxesService.update(id, updateCashboxDto, req.user as User);
  }

  // ------------------------------------------------------------------------------------
  // DELETE CASHBOX BY ID
  // ------------------------------------------------------------------------------------
  @Delete(':id')
  @RequirePermissions(Permission.DELETE_CASHBOX)
  @ApiOkResponse({ description: 'Ok', type: CashboxDto })
  @ApiOperation({ summary: 'Delete cashbox by Id' })
  @ApiNotFoundResponse({
    description:
      'The cashbox was not found or you do not have access to deleted',
  })
  @ApiBadRequestResponse({ description: 'The box is open' })
  remove(@Param('id') id: string, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException();
    return this.cashboxesService.remove(id, req.user as User);
  }

  // ------------------------------------------------------------------------------------
  // OPEN CASHBOX
  // ------------------------------------------------------------------------------------
  @Patch(':id/open-box')
  @RequirePermissions(Permission.OPEN_CASHBOX)
  @ApiOperation({
    summary: 'Open cashbox with a base',
    description:
      'By default the base is set to zero and the date at this time or after last close',
  })
  @ApiOkResponse({ description: 'The box is open', type: CashboxDto })
  @ApiNotFoundResponse({
    description: 'The cashbox not found or already in operation',
  })
  @ApiBadRequestResponse({
    description:
      'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  openCashbox(
    @Param('id') id: string,
    @Body() openBoxDto: OpenBoxDto,
    @Req() req: Request
  ) {
    if (!req.user) throw new UnauthorizedException();
    return this.cashboxesService.openCashbox(id, openBoxDto, req.user as User);
  }

  // ------------------------------------------------------------------------------------
  // CLOSE CASHBOX
  // ------------------------------------------------------------------------------------
  @Patch(':id/close-box')
  @RequirePermissions(Permission.CLOSE_CASHBOX)
  @ApiOperation({
    summary: 'Close the current box',
  })
  @ApiOkResponse({ description: 'The box is close', type: CashboxDto })
  @ApiNotFoundResponse({
    description: 'The cashbox not found or out of service',
  })
  @ApiBadRequestResponse({
    description:
      'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  closeCashbox(
    @Param('id') id: string,
    @Body() closeBoxDto: CloseBoxDto,
    @Req() req: Request
  ) {
    if (!req.user) throw new UnauthorizedException();
    return this.cashboxesService.closeCashbox(
      id,
      closeBoxDto,
      req.user as User
    );
  }
  // ------------------------------------------------------------------------------------
  // TRANSACTIONS
  // ------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------
  // CREATE TRANSACTIONS
  // ------------------------------------------------------------------------------------
  @Post(':id/transactions')
  @RequirePermissions(Permission.ADD_TRANSACTION)
  @ApiOperation({
    summary: 'Add transaction to the cashbox',
  })
  @ApiCreatedResponse({
    description: 'The transaction was success create',
    type: TransactionDto,
  })
  @ApiBadRequestResponse({
    description:
      'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  addTransaction(
    @Param('id') id: string,
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: Request
  ) {
    if (!req.user) throw new UnauthorizedException();
    return this.cashboxesService.addTransaction(
      id,
      createTransactionDto,
      req.user as User
    );
  }
  // ------------------------------------------------------------------------------------
  // DELETE TRANSACTIONS
  // ------------------------------------------------------------------------------------
  @Delete(':boxId/transactions/:transactionId')
  @RequirePermissions(Permission.DELETE_TRANSACTION)
  @ApiOperation({
    summary: 'Delete transaction to the cashbox',
  })
  @ApiOkResponse({
    description: 'The transaction was success deleted',
    type: TransactionDto,
  })
  @ApiNotFoundResponse({
    description:
      'The cashbox or transaction not found or dont has permission for deleted',
  })
  deleteTransaction(
    @Param('boxId') boxId: string,
    @Param('transactionId') transactionId: string,
    @Req() req: Request
  ) {
    if (!req.user) throw new UnauthorizedException();
    return this.cashboxesService.deleteTransaction(
      boxId,
      transactionId,
      req.user as User
    );
  }
}
