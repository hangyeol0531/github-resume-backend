import {
  CACHE_MANAGER,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManger) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return undefined;
  }
}
