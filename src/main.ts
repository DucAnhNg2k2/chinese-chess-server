import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { InterceptorResponse } from './commons/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new InterceptorResponse());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
