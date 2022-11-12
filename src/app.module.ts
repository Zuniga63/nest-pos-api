import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const useles;

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/api-rest')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
