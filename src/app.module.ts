import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  // imports: [
  //   ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.local.env'] }),
  //   TypeOrmModule.forRootAsync({
  //     imports: [ConfigModule],
  //     inject: [ConfigService],
  //     useFactory: (configService: ConfigService) => ({
  //       type: 'mysql',
  //       host: configService.get('DATABASE_HOST'),
  //       port: +configService.get<number>('DATABASE_PORT'),
  //       username: configService.get('DATABASE_USERNAME'),
  //       password: configService.get('DATABASE_PASSWORD'),
  //       synchronize: configService.get<boolean>('DATABASE_SYNC'),
  //       logging: configService.get<boolean>('DATABASE_LOGGING'),
  //       entities: [],
  //       database: configService.get('DATABASE_NAME'),
  //     }),
  //   }),
  // ],
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345',
      database: 'tododb',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
