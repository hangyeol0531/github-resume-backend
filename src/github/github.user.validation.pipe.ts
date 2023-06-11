import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { GithubMessage } from './github.message';

@Injectable()
export class GithubUserValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value || value === ':userId') {
      throw new BadRequestException(GithubMessage.NOT_EXISTS_USER_ID);
    }

    const userIdValidationRegex = /^[a-zA-Z\d]([-a-zA-Z\d]){0,38}$/;
    if (!userIdValidationRegex.test(value)) {
      throw new BadRequestException(GithubMessage.NOT_VALID_USER_ID);
    }
    return value;
  }
}
