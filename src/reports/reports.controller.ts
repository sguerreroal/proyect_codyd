import { Body, Controller, Post } from '@nestjs/common';
import { ReportDto } from './dto/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @Post()
  async getReports(@Body() body: ReportDto) {
    try {
      await this.reportsService.processReport(body);
      return {
        message: 'Informacion almacenada exitosamente',
      };
    } catch (error) {
      return {
        message: error,
      };
    }
  }
}
