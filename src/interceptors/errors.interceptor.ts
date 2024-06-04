import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

export class UserErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(
        catchError((err) =>
          throwError(() => new HttpException('intercepted error', 500)),
        ),
      );
  }
}
