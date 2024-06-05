import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: UserErrorInterceptor, //adding this error to control errors which arent handled such as internal server error when email added is not unique
    // },
  ],
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    UsersModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
})
export class AuthModule {}
