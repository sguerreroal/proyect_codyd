import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ReportsService {
  constructor(private readonly httpService: HttpService) {}

  getReports(body) {
    return this.httpService
      .get(
        'https://reportes-codyd.herokuapp.com/v1/facebook/page/metrics?page_id=554684771219613&metrics=page_fans,page_fan_adds,page_fan_removes,page_follows,page_daily_follows,page_daily_unfollows,page_engaged_users,page_impressions_unique,page_impressions,page_impressions_viral_unique,page_impressions_organic_unique,page_impressions_paid_unique,page_posts_impressions_unique,page_posts_impressions_viral_unique,page_posts_impressions_organic_unique,page_posts_impressions_paid_unique&since=2022-05-01&until=2022-07-31',
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJWOGU3VENRVmhPYUhuV1NER1Z3WG1YNUd5VnoxIiwiZXhwIjoxNjYyMjQxODE4fQ.V9D6mBFk4MwuU2aQhXLxEOxumGG2wohxY8PNc6tjKQ0',
          },
        },
      )
      .pipe(
        map((response) => {
            
          const likes = response.data.data[0];
          const ganados = response.data.data[1];
          const perdidos = response.data.data[2];
          const crecimiento_comunidad = response.data.data[3];
          const ganados_crecimiento_comunidad = response.data.data[4];
          const perdidos_crecimiento_comunidad = response.data.data[5];
          const engagement = response.data.data[6];
          const alcance = response.data.data[7];
          const impresiones = response.data.data[8];
          const alance_persona = response.data.data[9];
          const alance_organico_pagina = response.data.data[10];
          const alance_pago_pagina = response.data.data[11];
          const alance_total_pagina = response.data.data[12];
          const alance_diario_persona = response.data.data[13];
          const alance_diario_organico = response.data.data[14];
          const alance_diario_pagado = response.data.data[15];

          return response.data.data[0];
        }),
      )
      .pipe(
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }
}
