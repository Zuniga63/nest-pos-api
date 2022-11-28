import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import ValidationErrorDto from 'src/dto/validation-error.dto';
import { FindOneParams } from './dto/find-one-params.dto';
import { AddRoleParams } from './dto/add-role-params.dto';
import { UserWithFullRoleDto } from './dto/user-with-full-role.dto';
import { UserWithRoleDto } from './dto/user-with-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuards } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/required-permissions.decorator';
import { Permission } from '../auth/permission.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuards)
@ApiTags('Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Only admin can use this end point.' })
@ApiForbiddenResponse({
  description: 'Only user with the permissions can acces to this end points.',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ------------------------------------------------------------------------------------
  // CREATE A NEW USR
  // ------------------------------------------------------------------------------------
  @Post()
  @RequirePermissions(Permission.CREATE_NEW_USER)
  @ApiOperation({
    summary: 'Create new user.',
    description: 'This end point create a new user in the database.',
  })
  @ApiExtraModels(UserDto)
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
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
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return { user: newUser };
  }

  // ------------------------------------------------------------------------------------
  // GET ALL USERS
  // ------------------------------------------------------------------------------------
  @Get()
  @RequirePermissions(Permission.READ_USERS)
  @ApiOperation({
    summary: 'Get all users',
    description: 'This end point get all users with role sort by name',
  })
  @ApiExtraModels(UserWithRoleDto)
  @ApiOkResponse({
    description: 'List of user sort by name',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: { $ref: getSchemaPath(UserWithRoleDto) },
        },
      },
    },
  })
  async findAll() {
    const users = await this.usersService.findAll();
    return { users };
  }

  // ------------------------------------------------------------------------------------
  // GET ONE USER
  // ------------------------------------------------------------------------------------
  @Get(':userId')
  @RequirePermissions(Permission.READ_USER)
  @ApiOperation({
    summary: 'Get one user by ID',
    description: 'This end recover the info of one user',
  })
  @ApiExtraModels(UserWithFullRoleDto)
  @ApiOkResponse({
    description: 'User Info',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(UserWithFullRoleDto) },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not Found',
  })
  async findOne(@Param() params: FindOneParams) {
    const user = await this.usersService.findOne(params.userId);
    return { user };
  }

  // ------------------------------------------------------------------------------------
  // UPDATE USER
  // ------------------------------------------------------------------------------------
  @Patch(':userId')
  @RequirePermissions(Permission.UPDATE_USER)
  @ApiOperation({
    summary: 'Update user',
    description: 'This end point update the name and email.',
  })
  @ApiOkResponse({
    description: 'The updated user',
    schema: {
      type: 'object',
      properties: {
        userUpdated: { $ref: getSchemaPath(UserWithRoleDto) },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not Found',
  })
  async update(
    @Param() { userId }: FindOneParams,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const userUpdated = await this.usersService.update(userId, updateUserDto);
    return { userUpdated };
  }

  // ------------------------------------------------------------------------------------
  // DELETE USER
  // ------------------------------------------------------------------------------------
  @Delete(':userId')
  @RequirePermissions(Permission.DELETE_USER)
  @ApiOperation({
    summary: 'Delete user',
    description:
      'This end point remove the user data and update the role users.',
  })
  @ApiOkResponse({
    description: 'The deleted user',
    schema: {
      type: 'object',
      properties: {
        userDeleted: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not Found',
  })
  async remove(@Param() params: FindOneParams) {
    const userDeleted = await this.usersService.remove(params.userId);
    return { userDeleted };
  }

  // ------------------------------------------------------------------------------------
  // ADD ROLE TO USER
  // ------------------------------------------------------------------------------------
  @Patch(':userId/add-role/:roleId')
  @RequirePermissions(Permission.UPDATE_USER_ROLE)
  @ApiOperation({
    summary: 'Add role to user',
    description: 'This end point add role to user',
  })
  @ApiOkResponse({
    description: 'The user with role',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(UserWithRoleDto) },
        role: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User or Role not Found',
  })
  addRole(@Param() { userId, roleId }: AddRoleParams) {
    return this.usersService.addRole(userId, roleId);
  }

  // ------------------------------------------------------------------------------------
  // REMOVE ROLE TO USER
  // ------------------------------------------------------------------------------------
  @Patch(':userId/remove-role/:roleId')
  @RequirePermissions(Permission.UPDATE_USER_ROLE)
  @ApiOperation({
    summary: 'Remove role to user',
    description: 'This end point remove role to user and update the role',
  })
  @ApiOkResponse({
    description: 'The user without role',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(UserWithRoleDto) },
        role: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User or Role not Found',
  })
  removeRole(@Param() { userId, roleId }: AddRoleParams) {
    return this.usersService.removeRole(userId, roleId);
  }
}
