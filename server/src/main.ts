import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 设置全局路由前缀
  // 启用 CORS
  app.enableCors({
    origin: true, // 允许所有源
  });
  await app.listen(process.env.PORT ?? 3000);
  new Logger('listen').log('http://localhost:3000');
}
bootstrap();
