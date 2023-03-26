import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService
  ) {}

  getHello(): string {
    return `Welcome to ${this.configService.get<string>('APP_NAME')}`;
  }

  installPressets() {
    return this.cloudinaryService.createPresets();
  }
}
