import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const fileUpload = require('express-fileupload');

const config = require('config');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(fileUpload())
  await app.listen(process.env.PORT || config.get('PORT'));
}
bootstrap();
