import { ExecutionContext, Injectable, CacheInterceptor } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  private allowCacheMethods = ['GET'];

  trackBy(context: ExecutionContext): string | undefined {
    const { method, url } = context.switchToHttp().getRequest();
    if (this.allowCacheMethods.includes(method)) return url;
    return null;
  }
}
