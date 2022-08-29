import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const config = require('config');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || config.get('PORT'));
}
bootstrap();
