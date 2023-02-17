import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { RequirePermissions } from './modules/auth/decorators/required-permissions.decorator';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { PermissionsGuards } from './modules/auth/guards/permissions.guard';
import { Permission } from './modules/auth/permission.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('config/install-cloudinary-presets')
  @UseGuards(JwtAuthGuard, PermissionsGuards)
  @ApiBearerAuth()
  @RequirePermissions(Permission.INSTALL_CLOUD_PRESETS)
  @ApiCreatedResponse({
    description: 'Return the Cloudinary API response for create presets',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'cloudinary-preset-name' },
        message: {
          type: 'string',
          example: 'created or the message "name has been taken"',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Only super admin can use this end point',
  })
  @ApiForbiddenResponse({
    description: 'Only super admin can access to this end point',
  })
  installPressets() {
    return this.appService.installPressets();
  }
}
