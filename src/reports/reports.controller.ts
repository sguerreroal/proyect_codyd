import { Body, Controller, Post } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ReportDto } from './dto/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reporsService: ReportsService) {}
  @Post()
  async getReports(@Body() body: ReportDto) {
    await this.reporsService.getReportInstagramUser(body);
    console.info(`
    Informacion Instagram User procesada - 
    ${body.client_name}
    ${body.client_id}
    ${body.since}
    ${body.until}
    `);
    await this.reporsService.getReportInstagramPosts(body);
    console.info(`
    Informacion Instagram Posts procesada - 
    ${body.client_name}
    ${body.client_id}
    ${body.since}
    ${body.until}
    `);
    return {
      message: 'Informacion almacenada exitosamente',
    };
    // return this.reporsService.getReportFacebook(body);
  }
}
