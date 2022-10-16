import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AlcanceInstagram,
  AlcanceRanking,
  ComentariosRanking,
  GuardadasRanking,
  ReaccionesRanking,
  SeguidorInstagram,
} from 'src/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([
      AlcanceInstagram,
      SeguidorInstagram,
      ReaccionesRanking,
      ComentariosRanking,
      GuardadasRanking,
      AlcanceRanking,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
