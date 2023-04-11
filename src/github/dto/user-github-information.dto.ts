import { ApiProperty } from '@nestjs/swagger';

class ContactDto {
  @ApiProperty({ description: '유저 이메일' })
  email: string;

  @ApiProperty({ description: '유저 사이트' })
  websiteUrl: string;
}

export class UserDto {
  @ApiProperty({ description: '유저 이이디' })
  id: string;

  @ApiProperty({ description: '유저 이름' })
  name: string;

  @ApiProperty({ description: '유저 소개' })
  introduce: string;

  @ApiProperty({ description: '유저 프로필 이미지 url' })
  imageUrl: string;

  @ApiProperty({ description: '유저 연락처' })
  contact: ContactDto;
}

export class RepositoryDto {
  @ApiProperty({ description: '레파지토리 이름' })
  name: string;

  @ApiProperty({ description: '레파지토리 설정' })
  description: string;

  @ApiProperty({ description: '레파지토리 주소' })
  url: string;

  @ApiProperty({ description: '레파지토리 메인 언어' })
  language: string;

  @ApiProperty({ description: '레파지토리 스타 개수' })
  starCount: number;

  @ApiProperty({ description: '레파지토리 주인' })
  owner: string;
}

export class LanguageRateDto {
  @ApiProperty({ description: '언어 이름' })
  name: string;

  @ApiProperty({ description: '언어 사용률' })
  rate: number;
}

export class UserGithubInformationDto {
  @ApiProperty({ description: '유저의 정보' })
  user: UserDto;

  @ApiProperty({
    description: '유저의 고정된 레파지토리',
    type: RepositoryDto,
    isArray: true,
  })
  repositories: RepositoryDto[];

  @ApiProperty({
    description: '유저의 사용된 언어',
    type: LanguageRateDto,
    isArray: true,
  })
  languages: LanguageRateDto[];
}
