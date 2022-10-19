import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AlcanceInstagram,
  AlcancePagina,
  AlcancePublicacion,
  AlcanceRanking,
  ComentariosRanking,
  Evolucion,
  EvolucionLikes,
  GuardadasRanking,
  ReaccionesRanking,
  SeguidorInstagram,
  SeguidorPagina,
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
      EvolucionLikes,
      SeguidorPagina,
      Evolucion,
      AlcancePagina,
      AlcancePublicacion,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
