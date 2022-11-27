import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
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

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Only admin can use this end point.' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ------------------------------------------------------------------------------------
  // CREATE A NEW USR
  // ------------------------------------------------------------------------------------
  @Post()
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // ------------------------------------------------------------------------------------
  // GET ALL USERS
  // ------------------------------------------------------------------------------------
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'This end point get all users with role sort by name',
  })
  @ApiOkResponse({
    description: 'List of user sort by name',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(UserDto) },
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  // ------------------------------------------------------------------------------------
  // GET ONE USER
  // ------------------------------------------------------------------------------------
  @Get(':userId')
  @ApiOperation({
    summary: 'Get one user by ID',
    description: 'This end recover the info of one user',
  })
  @ApiOkResponse({
    description: 'User Info',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not Found',
  })
  findOne(@Param() params: FindOneParams) {
    return this.usersService.findOne(params.userId);
  }

  // ------------------------------------------------------------------------------------
  // UPDATE USER
  // ------------------------------------------------------------------------------------
  @Patch(':userId')
  @ApiOperation({
    summary: 'Update user',
    description: 'This end point update the name and email.',
  })
  @ApiOkResponse({
    description: 'The updated user',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not Found',
  })
  update(
    @Param() { userId }: FindOneParams,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  // ------------------------------------------------------------------------------------
  // DELETE USER
  // ------------------------------------------------------------------------------------
  @Delete(':userId')
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
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not Found',
  })
  remove(@Param() params: FindOneParams) {
    return this.usersService.remove(params.userId);
  }

  // ------------------------------------------------------------------------------------
  // ADD ROLE TO USER
  // ------------------------------------------------------------------------------------
  @Patch(':userId/add-role/:roleId')
  @ApiOperation({
    summary: 'Add role to user',
    description: 'This end point add role to user',
  })
  @ApiOkResponse({
    description: 'The user with role',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
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
  @ApiOperation({
    summary: 'Remove role to user',
    description: 'This end point remove role to user and update the role',
  })
  @ApiOkResponse({
    description: 'The user without role',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
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
