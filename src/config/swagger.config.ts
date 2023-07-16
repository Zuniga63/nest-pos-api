import { DocumentBuilder } from '@nestjs/swagger';

export default new DocumentBuilder()
  .setTitle('Nest Auth Template')
  .setDescription('This is an API for managment the auth users')
  .setVersion('1.0')
  .addTag('Auth', 'End point for register and login')
  .addTag('Users', 'Route for user administration')
  .addTag('Roles', 'Routes for role administration')
  .addTag('Cashboxes', 'Routes for boxes administration')
  .addTag('Brands', 'End points for products brand admin')
  .addTag('Tags', 'CRUD for product tags')
  .addTag('Product Colors', 'CRUD for product color')
  .addBearerAuth()
  .build();
