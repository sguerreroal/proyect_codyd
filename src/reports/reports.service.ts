import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly httpService: HttpService) {
  }

  private user;

  getUser(body: ReportDto){
    return this.httpService
      .post(
        'https://reportes-codyd.herokuapp.com/v1/login',
        {
            "email": body.email,
            "password": body.password
        },
      )
      .pipe(
        map((response) => response.data)
      )
      .pipe(
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async getReports(body: ReportDto) {

    this.user = await this.getUser(body).toPromise();    
    return this.httpService
      .get(
        `https://reportes-codyd.herokuapp.com/v1/facebook/page/metrics?page_id=${body.client_id}&metrics=${body.metrics}&since=${body.since}&until=${body.until}`,
        {
          headers: {
            Authorization:
              `Bearer ${this.user.token}`,
          },
        },
      )
      .pipe(
        map((response) => {
        //   this.transformData(response.data);
          return response.data;
        }),
      )
      .pipe(
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  transformData(data){
    let likes = data.data[0].rows;
    let ganados = data.data[1].rows;
    let perdidos = data.data[2].rows;
    let crecimiento_comunidad = data.data[3].rows;
    let ganados_crecimiento_comunidad = data.data[4].rows;
    let perdidos_crecimiento_comunidad = data.data[5].rows;
    let engagement = data.data[6].rows;
    let alcance = data.data[7].rows;
    let impresiones = data.data[8].rows;
    let alance_persona = data.data[9].rows;
    let alance_organico_pagina = data.data[10].rows;
    let alance_pago_pagina = data.data[11].rows;
    let alance_total_pagina = data.data[12].rows;
    let alance_diario_persona = data.data[13].rows;
    let alance_diario_organico = data.data[14].rows;
    let alance_diario_pagado = data.data[15].rows;

    likes = likes.map(like => `${like[0]}-${like[1]}`)
    ganados = ganados.map(ganado => `${ganado[0]}-${ganado[1]}`)
    perdidos = perdidos.map(perdido => `${perdido[0]}-${perdido[1]}`)
    crecimiento_comunidad = crecimiento_comunidad.map(crecimiento_comun => `${crecimiento_comun[0]}-${crecimiento_comun[1]}`)
    ganados_crecimiento_comunidad = ganados_crecimiento_comunidad.map(ganados_crecimiento_comun => `${ganados_crecimiento_comun[0]}-${ganados_crecimiento_comun[1]}`)

    console.log('data recibida' + JSON.stringify(likes));
  }
}
