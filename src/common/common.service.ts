import { Injectable } from '@nestjs/common';
import { YearAndMonthDateDto } from './dto/common.dto';

@Injectable()
export class CommonService {
  getYearAndMonthDateDto(range: number): YearAndMonthDateDto[] {
    const yearAndMonthDateDtos: YearAndMonthDateDto[] = [];

    const date: Date = new Date();
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    yearAndMonthDateDtos.push({
      year,
      month,
    });

    for (let i = 1; i < range; i++) {
      const lastMonth: YearAndMonthDateDto = yearAndMonthDateDtos[i - 1];
      const isLastMonthJanuary = lastMonth.month === 1;
      yearAndMonthDateDtos.push({
        year: isLastMonthJanuary ? lastMonth.year - 1 : lastMonth.year,
        month: isLastMonthJanuary ? 12 : lastMonth.month - 1,
      });
    }
    return yearAndMonthDateDtos;
  }
}
