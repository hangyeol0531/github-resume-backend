import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class GithubUserValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value || value === ':userId') {
      throw new BadRequestException('유저 아이디가 올바르지 않습니다.');
    }
    return value;
  }
}
