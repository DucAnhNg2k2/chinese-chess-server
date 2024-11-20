import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { InterceptorResponse } from './commons/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionResponse } from './commons/exceptions/http.exception';
import { WsExceptionResponse } from './commons/exceptions/ws.exception';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new InterceptorResponse());
  app.useGlobalFilters(new HttpExceptionResponse(), new WsExceptionResponse());
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors();
  const configService = app.get(ConfigService);
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
