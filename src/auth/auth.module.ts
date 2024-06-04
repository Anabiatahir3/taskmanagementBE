import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserErrorInterceptor } from 'src/interceptors/errors.interceptor';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserErrorInterceptor, //adding this error to control errors which arent handled such as internal server error when email added is not unique
    },
  ],
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
