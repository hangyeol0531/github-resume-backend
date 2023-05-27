import { ExecutionContext, Injectable, CacheInterceptor } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  private allowCacheMethods = ['GET'];

  trackBy(context: ExecutionContext): string | undefined {
    const { method, url, ip } = context.switchToHttp().getRequest();
    const isTestRequest = ip === '::ffff:127.0.0.1';

    if (isTestRequest || !this.allowCacheMethods.includes(method)) {
      return null;
    }
    return url;
  }
}
