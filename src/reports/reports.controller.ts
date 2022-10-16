import { Body, Controller, Post } from '@nestjs/common';
import { ReportDto } from './dto/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @Post()
  async getReports(@Body() body: ReportDto) {
    await this.reportsService.processReport(body);
    return {
      message: 'Informacion almacenada exitosamente',
    };
    // return this.reporsService.getReportFacebook(body);
  }
}
