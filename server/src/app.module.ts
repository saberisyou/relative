import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite', // 数据库文件名
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 实体文件路径
      synchronize: true, // 在开发环境中使用，生产环境中建议设置为 false
      // 添加以下配置
      enableWAL: true, // 启用 Write-Ahead Logging
      extra: {
        pragma: ['PRAGMA journal_mode = WAL', 'PRAGMA busy_timeout = 5000'],
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
