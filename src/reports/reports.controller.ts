import { Body, Controller, Post } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ReportDto } from './dto/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reporsService: ReportsService) {}
  @Post()
  async getReports(@Body() body: ReportDto) {
    return this.reporsService.getReports(body);
  }
}
