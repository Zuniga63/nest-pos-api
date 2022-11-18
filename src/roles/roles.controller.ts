import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { RoleDto } from './dto/role.dto';
import ValidationErrorDto from '../dto/validation-error.dto';
import { FindOneParams } from './dto/find-one-params.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Only admin can access.' })
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // ------------------------------------------------------------------------------------
  // CREATE A NEW ROLE
  // ------------------------------------------------------------------------------------
  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiCreatedResponse({
    description: 'Role has been succesfully created.',
    type: RoleDto,
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
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  // ------------------------------------------------------------------------------------
  // FIND ALL ROLES
  // ------------------------------------------------------------------------------------
  @Get()
  @ApiOperation({ summary: 'Get all roles sort by order' })
  @ApiOkResponse({
    description: 'List of registered roles',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(RoleDto) },
    },
  })
  findAll() {
    return this.rolesService.findAll();
  }

  // ------------------------------------------------------------------------------------
  // FIND ROLE BY ID
  // ------------------------------------------------------------------------------------
  @Get(':roleId')
  @ApiOperation({ summary: 'Get the Role by ID' })
  @ApiOkResponse({
    description: 'The role data',
    schema: {
      type: 'object',
      properties: {
        role: { $ref: getSchemaPath(RoleDto) },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'If the ID of role is not a MongoId valid',
  })
  @ApiNotFoundResponse({
    description: 'The role not found',
  })
  findOne(@Param() params: FindOneParams) {
    return this.rolesService.findOne(params.roleId);
  }

  // ------------------------------------------------------------------------------------
  // UPDATE ROLE BY ID
  // ------------------------------------------------------------------------------------
  @Patch(':roleId')
  @ApiOperation({ summary: 'Update Role by ID and return Role updated' })
  @ApiOkResponse({
    description: 'The role was successfully update',
    schema: {
      type: 'object',
      properties: {
        role: { $ref: getSchemaPath(RoleDto) },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'If the ID of role is not a MongoId valid',
  })
  @ApiNotFoundResponse({
    description: 'The role not found',
  })
  update(@Param() params: FindOneParams, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(params.roleId, updateRoleDto);
  }

  // ------------------------------------------------------------------------------------
  // DELETE ROLE BY ID
  // ------------------------------------------------------------------------------------
  @Delete(':roleId')
  @ApiOperation({ summary: 'Delete role by ID and get the delete role' })
  @ApiOkResponse({
    description: 'The role was successfully removed',
    schema: {
      type: 'object',
      properties: {
        ok: { type: 'boolean' },
        role: { $ref: getSchemaPath(RoleDto) },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'If the ID of role is not a MongoId valid',
  })
  @ApiNotFoundResponse({
    description: 'The role not found',
  })
  remove(@Param() params: FindOneParams) {
    return this.rolesService.remove(params.roleId);
  }
}
