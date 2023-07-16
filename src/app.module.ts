import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MailModule } from './modules/mail/mail.module';
import { CashboxesModule } from './modules/cashboxes/cashboxes.module';
import { ProductBrandModule } from './modules/product-brands/product-brands.module';
import { ProductTagsModule } from './modules/product-tags/product-tags.module';
import { ProductColorsModule } from './modules/product-colors/product-colors.module';
import { ProductSizesModule } from './modules/product-sizes/product-sizes.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    RolesModule,
    UsersModule,
    AuthModule,
    CloudinaryModule,
    MailModule,
    CashboxesModule,
    ProductBrandModule,
    ProductTagsModule,
    ProductColorsModule,
    ProductSizesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
