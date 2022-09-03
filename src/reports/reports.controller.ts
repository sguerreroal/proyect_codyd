import { Body, Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reporsService: ReportsService) {}
  @Get()
  getReports(@Body() body) {
    return this.reporsService.getReports(body);
  }
}
