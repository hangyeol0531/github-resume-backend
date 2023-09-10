import { ApiProperty } from '@nestjs/swagger';
import { YearAndMonthDateDto } from '../../common/dto/common.dto';
import SocialAccountProvider from '../../github-client/types/SocialAccountProvider';

export class SocialAccountDto {
  @ApiProperty({
    description: '소셜 타입',
    enum: SocialAccountProvider,
  })
  name: SocialAccountProvider;

  @ApiProperty({
    description: '소셜 계정 url',
  })
  url: string;
}

class ContactDto {
  @ApiProperty({ description: '유저 이메일' })
  email: string;

  @ApiProperty({ description: '유저 사이트' })
  websiteUrl: string;

  @ApiProperty({
    description: '유저 소셜 계정들',
    type: SocialAccountDto,
    isArray: true,
  })
  socialAccounts: SocialAccountDto[];
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

  @ApiProperty({ description: '레파지토리 개수' })
  repositoryCount: number;

  @ApiProperty({ description: '팔로워 수' })
  followerCount: number;

  @ApiProperty({ description: '총 스타 수' })
  startCount: number;

  @ApiProperty({ description: '총 포크 수' })
  forkCount: number;

  @ApiProperty({ description: '계정 생성 후 지난 일' })
  daysSinceAccountCreation: number;
}

export class RepositoryDto {
  @ApiProperty({ description: '레파지토리 이름' })
  name: string;

  @ApiProperty({ description: '레파지토리 설정' })
  description: string;

  @ApiProperty({ description: '레파지토리 주소' })
  url: string;

  @ApiProperty({ description: '홈페이지 주소' })
  homepageUrl: string;

  @ApiProperty({ description: '레파지토리 메인 언어' })
  language: string;

  @ApiProperty({ description: '레파지토리 스타 개수' })
  starCount: number;

  @ApiProperty({ description: '레파지토리 포크 개수' })
  forkCount: number;

  @ApiProperty({
    description: '레파지토리 토픽(태그) 정보',
    isArray: true,
  })
  topics: string[];

  @ApiProperty({ description: '레파지토리 주인' })
  owner: string;
}

export class LanguageRateDto {
  @ApiProperty({ description: '언어 이름' })
  name: string;

  @ApiProperty({ description: '언어 사용률' })
  rate: number;

  @ApiProperty({ description: '언어 색깔' })
  color: string;
}

export class MonthlyContributionHistory {
  @ApiProperty({ description: '해당 날짜' })
  date: YearAndMonthDateDto;

  @ApiProperty({ description: '기여 횟수' })
  contributionCount: number;
}

export class LatestCommittedRepositoryDto {
  @ApiProperty({ description: '레파지토리 이름' })
  name: string;

  @ApiProperty({ description: '레파지토리 url' })
  url: string;
}

export class ContributionDto {
  @ApiProperty({ description: '이번 년도' })
  year: number;

  @ApiProperty({ description: '이번 년도 커밋 개수' })
  commitCount: number;

  @ApiProperty({ description: '최근 N개월 범위' })
  recentMonthRange: number;

  @ApiProperty({
    description: '최근에 커밋한 레파지토리',
    type: LatestCommittedRepositoryDto,
  })
  latestCommittedRepository: LatestCommittedRepositoryDto;

  @ApiProperty({
    description: '월간 활동 정보',
    type: MonthlyContributionHistory,
    isArray: true,
  })
  monthlyContributionHistories: MonthlyContributionHistory[];
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

  @ApiProperty({
    description: '기여(활동) 정보',
  })
  contributions: ContributionDto;
}
