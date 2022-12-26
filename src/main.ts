import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { AppModule } from './app.module';

import swaggerConfig from './config/swagger.config';
import validationConfig from './config/validationPipe.config';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';

// *Add virtual for all models
mongoose.set('toJSON', { virtuals: true });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const env = process.env.APP_ENV || 'local';

  // Swagger COnfig
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe(validationConfig));
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  await app.listen(port);

  if (env === 'local') {
    console.log(`App runing on: https://localhost:${port}`);
  }
}
bootstrap();
