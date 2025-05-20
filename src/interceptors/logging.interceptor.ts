import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const now = Date.now();

    // 排除登录注册接口
    if (!['/auth/login', '/auth/register'].includes(request.url)) {
      const token = request.headers['authorization'];
      if (!token) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    console.log('Before...');
    console.log(`Request Method: ${request.method}`);
    console.log(`Request URL: ${request.url}`);
    console.log(`Request Body: ${JSON.stringify(request.body)}`);

    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}