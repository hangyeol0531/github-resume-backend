import { ApiOperation, ApiProperty } from '@nestjs/swagger';

export class UserCareerInformationDto {
  @ApiProperty({ description: '회사명' })
  name: string;

  @ApiProperty({ description: '직책' })
  position: string;

  @ApiProperty({ description: '시작일' })
  startAt: string;

  @ApiProperty({ description: '종료일' })
  endAt: string;

  @ApiProperty({ description: '내용' })
  content: string;
}

export class UserActivityInformationDto {
  @ApiProperty({ description: '소속명' })
  name: string;

  @ApiProperty({ description: '시작일' })
  startAt: string;

  @ApiProperty({ description: '종료일' })
  endAt: string;

  @ApiProperty({ description: '내용' })
  content: string;
}

export class UserCertificateInformationDto {
  @ApiProperty({ description: '자격증명' })
  name: string;

  @ApiProperty({ description: '취득일' })
  startAt: string;

  @ApiProperty({ description: '만료일' })
  endAt: string;

  @ApiProperty({ description: '발행 기관' })
  issuer: string;
}

export class UserSchoolInformationDto {
  @ApiProperty({ description: '학교명' })
  name: string;

  @ApiProperty({ description: '학과명' })
  major: string;

  @ApiProperty({ description: '입학일' })
  startAt: string;

  @ApiProperty({ description: '졸업일' })
  endAt: string;
}

export class UserCustomInformationDto {
  @ApiProperty({
    description: '회사 정보',
    type: UserCareerInformationDto,
    isArray: true,
  })
  company: UserCareerInformationDto[];

  @ApiProperty({
    description: '활동 정보',
    type: UserActivityInformationDto,
    isArray: true,
  })
  activity: UserActivityInformationDto[];

  @ApiProperty({
    description: '자격증 정보',
    type: UserCertificateInformationDto,
    isArray: true,
  })
  certificate: UserCertificateInformationDto[];

  @ApiProperty({
    description: '학교 정보',
    type: UserSchoolInformationDto,
    isArray: true,
  })
  school: UserSchoolInformationDto;
}
