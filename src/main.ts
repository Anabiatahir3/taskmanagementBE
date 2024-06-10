import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserErrorInterceptor } from './interceptors/errors.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //app.useGlobalInterceptors(new UserErrorInterceptor());
  await app.listen(3000);
}
bootstrap();
