import { ApiProperty } from '@nestjs/swagger';

export class YearAndMonthDateDto {
  @ApiProperty({ description: '해당 년도' })
  year: number;

  @ApiProperty({ description: '해당 월' })
  month: number;
}
