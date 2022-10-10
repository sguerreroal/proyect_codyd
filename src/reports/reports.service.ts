import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, map } from 'rxjs/operators';
import { AlcanceInstagram } from 'src/typeorm';
import { Repository } from 'typeorm';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(AlcanceInstagram)
    private readonly alcanceInstagramRepository: Repository<AlcanceInstagram>,
  ) {}

  private user;
  private parseData;
  private body;
  private initialDate;

  getUser(body: ReportDto) {
    return this.httpService
      .post('https://reportes-codyd.herokuapp.com/v1/login', {
        email: body.email,
        password: body.password,
      })
      .pipe(map((response) => response.data))
      .pipe(
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async getReportFacebook(body: ReportDto) {
    this.user = await this.getUser(body).toPromise();
    return this.httpService
      .get(
        `https://reportes-codyd.herokuapp.com/v1/facebook/page/metrics?page_id=${body.client_id}&metrics=${body.metrics}&since=${body.since}&until=${body.until}`,
        {
          headers: {
            Authorization: `Bearer ${this.user.token}`,
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

  async getReportInstagramUser(body: ReportDto) {
    this.user = await this.getUser(body).toPromise();
    this.body = body;
    return this.httpService
      .get(
        `https://reportes-codyd.herokuapp.com/v1/instagram/user/metrics?page_id=${body.client_id}&since=${body.since}&until=${body.until}`,
        {
          headers: {
            Authorization: `Bearer ${this.user.token}`,
          },
        },
      )
      .pipe(
        map((response) => {
          this.parseData = this.transformData(response.data, 'instagram');
          return response.data;
        }),
      )
      .pipe(
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async getReportInstagramPosts(body: ReportDto) {
    this.user = await this.getUser(body).toPromise();
    return this.httpService
      .get(
        `https://reportes-codyd.herokuapp.com/v1/instagram/posts/metrics?page_id=${body.client_id}&since=${body.since}&until=${body.until}`,
        {
          headers: {
            Authorization: `Bearer ${this.user.token}`,
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

  async transformData(data, network) {
    this.initialDate = new Date(this.body.since + 'T12:00:00');
    if (network == 'instagram') {
      let alcances_instagram = data.data[1].rows;
      alcances_instagram = alcances_instagram.map(
        (alcance_instagram) =>
          `${alcance_instagram[0]}-${alcance_instagram[1]}`,
      );

      alcances_instagram.forEach(async (alcance_ig, index) => {
        const values = alcance_ig.split('-');

        const data = {
          identificacion_cliente: this.body.client_id,
          nombre_cliente: this.body.client_name,
          nombre_red_social: 'instagram',
          num_alcance_instagram: values[0],
          fecha:
            index == 0 ? this.body.since : this.increaseDate(this.initialDate),
        };

        const existRecordsWithDate =
          await this.alcanceInstagramRepository.findOne({
            where: {
              fecha: this.initialDate,
            },
          });

        !existRecordsWithDate ? this.insertData(data, 'instagram') : '';
      });
    } else if (network == 'facebook') {
      let likes = data.data[0].rows;
      let ganados = data.data[1].rows;
      let perdidos = data.data[2].rows;
      let crecimiento_comunidad = data.data[3].rows;
      let ganados_crecimiento_comunidad = data.data[4].rows;
      const perdidos_crecimiento_comunidad = data.data[5].rows;
      const engagement = data.data[6].rows;
      const alcance = data.data[7].rows;
      const impresiones = data.data[8].rows;
      const alance_persona = data.data[9].rows;
      const alance_organico_pagina = data.data[10].rows;
      const alance_pago_pagina = data.data[11].rows;
      const alance_total_pagina = data.data[12].rows;
      const alance_diario_persona = data.data[13].rows;
      const alance_diario_organico = data.data[14].rows;
      const alance_diario_pagado = data.data[15].rows;

      likes = likes.map((like) => `${like[0]}-${like[1]}`);
      ganados = ganados.map((ganado) => `${ganado[0]}-${ganado[1]}`);
      perdidos = perdidos.map((perdido) => `${perdido[0]}-${perdido[1]}`);
      crecimiento_comunidad = crecimiento_comunidad.map(
        (crecimiento_comun) =>
          `${crecimiento_comun[0]}-${crecimiento_comun[1]}`,
      );
      ganados_crecimiento_comunidad = ganados_crecimiento_comunidad.map(
        (ganados_crecimiento_comun) =>
          `${ganados_crecimiento_comun[0]}-${ganados_crecimiento_comun[1]}`,
      );
      console.log('data recibida' + JSON.stringify(likes));
    }
  }

  insertData(data, network) {
    if (network == 'instagram') {
      this.alcanceInstagramRepository.save(data);
    }
  }

  increaseDate(date) {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    this.initialDate =
      currentDate.getFullYear() +
      '-' +
      (currentDate.getMonth() + 1) +
      '-' +
      currentDate.getDate();
    return this.initialDate;
  }
}
