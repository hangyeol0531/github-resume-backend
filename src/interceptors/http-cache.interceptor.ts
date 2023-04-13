import { ExecutionContext, Injectable, CacheInterceptor } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const { method, url } = context.switchToHttp().getRequest();
    if (method !== 'GET') return;
    return url;
  }
}
