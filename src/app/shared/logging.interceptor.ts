import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const copiedRequest = request.clone();
    return next.handle(copiedRequest)
    .pipe(
      tap((event: HttpEvent<any>) => {
        console.log('Logging Interceptors', event.type === 4 ? 'Response' : 'Sent');
      })
    );
  }
}
