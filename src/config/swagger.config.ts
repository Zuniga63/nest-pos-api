import { DocumentBuilder } from '@nestjs/swagger';

export default new DocumentBuilder()
  .setTitle('Bar and Restaurant')
  .setDescription('This is an API for managment a bar or a restaurant')
  .setVersion('1.0')
  .addTag('Auth', 'End point for register and login')
  .addTag('Users', 'Route for user administration')
  .addTag('Roles', 'Routes for role administration')
  .build();
