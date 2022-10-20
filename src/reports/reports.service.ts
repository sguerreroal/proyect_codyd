import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { catchError, map } from 'rxjs/operators';
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
import { Repository } from 'typeorm';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(AlcanceInstagram)
    private readonly alcanceInstagramRepository: Repository<AlcanceInstagram>,
    @InjectRepository(SeguidorInstagram)
    private readonly seguidorInstagramRepository: Repository<SeguidorInstagram>,
    @InjectRepository(ReaccionesRanking)
    private readonly reaccionRankingRepository: Repository<ReaccionesRanking>,
    @InjectRepository(ComentariosRanking)
    private readonly comentarioRankingRepository: Repository<ComentariosRanking>,
    @InjectRepository(GuardadasRanking)
    private readonly guardadaRankingRepository: Repository<GuardadasRanking>,
    @InjectRepository(AlcanceRanking)
    private readonly alcanceRankingRepository: Repository<AlcanceRanking>,
    @InjectRepository(EvolucionLikes)
    private readonly evolucionLikesRepository: Repository<EvolucionLikes>,
    @InjectRepository(SeguidorPagina)
    private readonly seguidorPaginaRepository: Repository<SeguidorPagina>,
    @InjectRepository(Evolucion)
    private readonly evolucionRepository: Repository<Evolucion>,
    @InjectRepository(AlcancePagina)
    private readonly alcancePaginaRepository: Repository<AlcancePagina>,
    @InjectRepository(AlcancePublicacion)
    private readonly alcancePublicacionRepository: Repository<AlcancePublicacion>,
  ) {}

  private user;
  private body;
  private initialDate;
  private igDate;

  async processReport(body: ReportDto) {
    return Promise.allSettled([
      (await this.getReportInstagramUser(body)).toPromise(),
      (await this.getReportInstagramPosts(body)).toPromise(),
      (await this.getReportFacebookUser(body)).toPromise(),
      (await this.getReportFacebookPostsMetrics(body)).toPromise(),
      (await this.getReportFacebookPostsShares(body)).toPromise(),
      (await this.getReportFacebookPostsReactions(body)).toPromise(),
    ]);
  }

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

  async getReportFacebookUser(body: ReportDto) {
    this.user = await this.getUser(body).toPromise();
    this.body = body;

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
          this.transformData(response.data, 'facebook');
        }),
      )
      .pipe(
        catchError((e) => {
          console.error(`
          Informacion Facebook error -
          ${body.client_name}
          ${body.client_id}
          ${body.since}
          ${body.until}
          - ERROR
          ${e.response.data}
          `);
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async getReportFacebookPostsMetrics(body: ReportDto) {
    this.user = await this.getUser(body).toPromise();
    this.body = body;
    return this.httpService
      .get(
        `https://reportes-codyd.herokuapp.com/v1/facebook/posts/metrics?page_id=${body.client_id}&since=${body.since}&until=${body.until}`,
        {
          headers: {
            Authorization: `Bearer ${this.user.token}`,
          },
        },
      )
      .pipe(
        map((response) => {
          return this.transformData(response.data, 'facebook_posts_metrics');
        }),
      )
      .pipe(
        catchError((e) => {
          console.error(`
          Informacion Facebook Posts error -
          ${body.client_name}
          ${body.client_id}
          ${body.since}
          ${body.until}
          - ERROR
          ${e.response.data}
          `);
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async getReportFacebookPostsShares(body: ReportDto) {
    this.user = await this.getUser(body).toPromise();
    this.body = body;
    return this.httpService
      .get(
        `https://reportes-codyd.herokuapp.com/v1/facebook/posts/shares?page_id=${body.client_id}&since=${body.since}&until=${body.until}`,
        {
          headers: {
            Authorization: `Bearer ${this.user.token}`,
          },
        },
      )
      .pipe(
        map((response) => {
          return this.transformData(response.data, 'facebook_posts_shares');
        }),
      )
      .pipe(
        catchError((e) => {
          console.error(`
          Informacion Facebook Posts error -
          ${body.client_name}
          ${body.client_id}
          ${body.since}
          ${body.until}
          - ERROR
          ${e.response.data}
          `);
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async getReportFacebookPostsReactions(body: ReportDto) {
    this.user = await this.getUser(body).toPromise();
    this.body = body;
    return this.httpService
      .get(
        `https://reportes-codyd.herokuapp.com/v1/facebook/posts/reactions?page_id=${body.client_id}&since=${body.since}&until=${body.until}`,
        {
          headers: {
            Authorization: `Bearer ${this.user.token}`,
          },
        },
      )
      .pipe(
        map((response) => {
          return this.transformData(response.data, 'facebook_posts_reactions');
        }),
      )
      .pipe(
        catchError((e) => {
          console.error(`
          Informacion Facebook Posts error -
          ${body.client_name}
          ${body.client_id}
          ${body.since}
          ${body.until}
          - ERROR
          ${e.response.data}
          `);
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async getReportInstagramUser(body: ReportDto) {
    this.user = await this.getUser(body).toPromise();
    this.body = body;

    return this.httpService
      .get(
        `https://reportes-codyd.herokuapp.com/v1/instagram/user/metrics?page_id=${
          body.client_id
        }&since=${this.getDatesIg('since')}&until=${this.getDatesIg('until')}`,
        {
          headers: {
            Authorization: `Bearer ${this.user.token}`,
          },
        },
      )
      .pipe(
        map((response) => {
          return this.transformData(response.data, 'instagram');
        }),
      )
      .pipe(
        catchError((e) => {
          console.error(`
          Informacion Instagram User error -
          ${body.client_name}
          ${body.client_id}
          ${body.since}
          ${body.until}
          - ERROR
          ${e.response.data}
          `);
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async getReportInstagramPosts(body: ReportDto) {
    this.user = await this.getUser(body).toPromise();
    this.body = body;
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
          return this.transformData(response.data, 'instagram_posts');
        }),
      )
      .pipe(
        catchError((e) => {
          console.error(`
          Informacion Instagram Posts error -
          ${body.client_name}
          ${body.client_id}
          ${body.since}
          ${body.until}
          - ERROR
          ${e.response.data}
          `);
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async transformData(data, network) {
    this.initialDate = new Date(this.body.since + 'T12:00:00');
    const SQL_QUERY = {
      identificacion_cliente: this.body.client_id,
      fecha: this.initialDate,
    };

    const globalData = {
      identificacion_cliente: this.body.client_id,
      nombre_cliente: this.body.client_name,
    };
    if (network == 'instagram') {
      let seguidores_instagram = data.data[0].rows;
      let alcances_instagram = data.data[1].rows;

      seguidores_instagram = seguidores_instagram.map(
        (seguidor_instagram) =>
          `${seguidor_instagram[0]}-${seguidor_instagram[1]}`,
      );

      seguidores_instagram.forEach(async (seguidor_ig, index) => {
        const values = seguidor_ig.split('-');

        const data = {
          ...globalData,
          nombre_red_social: 'instagram',
          num_comunidad: values[0],
          fecha:
            index == 0 ? this.body.since : this.increaseDate(this.initialDate),
        };

        const existRecordsWithDate =
          await this.seguidorInstagramRepository.findOne({
            where: SQL_QUERY,
          });

        !existRecordsWithDate
          ? this.insertData(data, 'instagram_seguidores')
          : '';
      });

      this.initialDate = new Date(this.body.since + 'T12:00:00');

      alcances_instagram = alcances_instagram.map(
        (alcance_instagram) =>
          `${alcance_instagram[0]}-${alcance_instagram[1]}`,
      );

      alcances_instagram.forEach(async (alcance_ig, index) => {
        const values = alcance_ig.split('-');

        const data = {
          ...globalData,
          nombre_red_social: 'instagram',
          num_alcance_instagram: values[0],
          fecha:
            index == 0 ? this.body.since : this.increaseDate(this.initialDate),
        };

        const existRecordsWithDate =
          await this.alcanceInstagramRepository.findOne({
            where: SQL_QUERY,
          });

        !existRecordsWithDate ? this.insertData(data, 'instagram_alcance') : '';
      });

      console.info(`
        Informacion Instagram User procesada -
        ${this.body.client_name}
        ${this.body.client_id}
        ${this.body.since}
        ${this.body.until}
        `);
    } else if (network == 'facebook') {
      let likes = data.data[0].rows;
      let ganados = data.data[1].rows;
      let perdidos = data.data[2].rows;
      let crecimiento_comunidad = data.data[3].rows;
      let ganados_crecimiento_comunidad = data.data[4].rows;
      let perdidos_crecimiento_comunidad = data.data[5].rows;
      let engagement = data.data[6].rows;
      let alcance = data.data[7].rows;
      let impresiones = data.data[8].rows;
      let alcance_persona = data.data[9].rows;
      let alcance_organico_pagina = data.data[10].rows;
      let alcance_pago_pagina = data.data[11].rows;
      let alcance_total_pagina = data.data[12].rows;
      let alcance_diario_persona = data.data[13].rows;
      let alcance_diario_organico = data.data[14].rows;
      let alcance_diario_pagado = data.data[15].rows;

      likes = likes.map((like) => `${like[0]}-split${like[1]}`);
      ganados = ganados.map((ganado) => `${ganado[0]}-split${ganado[1]}`);
      perdidos = perdidos.map((perdido) => `${perdido[0]}-split${perdido[1]}`);

      // ------- EVOLUCIONES LIKES --------

      for (let index = 0; index < likes.length; index++) {
        const likes_values = likes[index].split('-split');
        const ganados_values = ganados[index].split('-split');
        const perdidos_values = perdidos[index].split('-split');

        const data = {
          ...globalData,
          nombre_red_social: 'facebook',
          num_likes: likes_values[0],
          num_ganados: ganados_values[0],
          num_perdidos: perdidos_values[0],
          fecha: this.detectDateByString(
            `${likes_values[1]}${this.initialDate.getFullYear()}`,
          ),
        };

        const existRecordsWithDate =
          await this.evolucionLikesRepository.findOne({
            where: {
              identificacion_cliente: this.body.client_id,
              fecha: data.fecha,
            },
          });

        !existRecordsWithDate
          ? this.insertData(data, 'facebook_evolucion_likes')
          : '';
      }

      // ------- SEGUIDORES PAGINA --------

      crecimiento_comunidad = crecimiento_comunidad.map(
        (crecimiento_comun) =>
          `${crecimiento_comun[0]}-split${crecimiento_comun[1]}`,
      );
      ganados_crecimiento_comunidad = ganados_crecimiento_comunidad.map(
        (ganado_crecimiento_comunidad) =>
          `${ganado_crecimiento_comunidad[0]}-split${ganado_crecimiento_comunidad[1]}`,
      );
      perdidos_crecimiento_comunidad = perdidos_crecimiento_comunidad.map(
        (perdido_crecimiento_comunidad) =>
          `${perdido_crecimiento_comunidad[0]}-split${perdido_crecimiento_comunidad[1]}`,
      );

      for (let index = 0; index < crecimiento_comunidad.length; index++) {
        const crecimiento_comunidad_values =
          crecimiento_comunidad[index].split('-split');
        const ganados_crecimiento_comunidad_values =
          ganados_crecimiento_comunidad[index].split('-split');
        const perdidos_crecimiento_comunidad_values =
          perdidos_crecimiento_comunidad[index].split('-split');

        const data = {
          ...globalData,
          nombre_red_social: 'facebook',
          num_seguidores: crecimiento_comunidad_values[0],
          num_ganados: ganados_crecimiento_comunidad_values[0],
          num_perdidos: perdidos_crecimiento_comunidad_values[0],
          fecha: this.detectDateByString(
            `${
              crecimiento_comunidad_values[1]
            }${this.initialDate.getFullYear()}`,
          ),
        };

        const existRecordsWithDate =
          await this.seguidorPaginaRepository.findOne({
            where: {
              identificacion_cliente: this.body.client_id,
              fecha: data.fecha,
            },
          });

        !existRecordsWithDate
          ? this.insertData(data, 'facebook_seguidores')
          : '';
      }

      // ------- EVOLUCION --------

      engagement = engagement.map(
        (engagement) => `${engagement[0]}-split${engagement[1]}`,
      );
      alcance = alcance.map((alcance) => `${alcance[0]}-split${alcance[1]}`);
      impresiones = impresiones.map(
        (impresiones) => `${impresiones[0]}-split${impresiones[1]}`,
      );
      alcance_persona = alcance_persona.map(
        (alcance_persona) => `${alcance_persona[0]}-split${alcance_persona[1]}`,
      );

      for (let index = 0; index < engagement.length; index++) {
        const engagement_values = engagement[index].split('-split');
        const alcance_values = alcance[index].split('-split');
        const impresiones_values = impresiones[index].split('-split');
        const alcance_persona_values = alcance_persona[index].split('-split');

        const data = {
          ...globalData,
          nombre_red_social: 'facebook',
          num_engagement: engagement_values[0],
          num_alcance: alcance_values[0],
          num_impresiones: impresiones_values[0],
          num_alcance_personas_hablando: alcance_persona_values[0],
          fecha: this.detectDateByString(
            `${engagement_values[1]}${this.initialDate.getFullYear()}`,
          ),
        };

        const existRecordsWithDate = await this.evolucionRepository.findOne({
          where: {
            identificacion_cliente: this.body.client_id,
            fecha: data.fecha,
          },
        });

        !existRecordsWithDate
          ? this.insertData(data, 'facebook_evolucion')
          : '';
      }

      // ------- ALCANCE PAGINA --------

      alcance_organico_pagina = alcance_organico_pagina.map(
        (alcance_organico_pagina) =>
          `${alcance_organico_pagina[0]}-split${alcance_organico_pagina[1]}`,
      );
      alcance_pago_pagina = alcance_pago_pagina.map(
        (alcance_pago_pagina) =>
          `${alcance_pago_pagina[0]}-split${alcance_pago_pagina[1]}`,
      );

      for (let index = 0; index < alcance_organico_pagina.length; index++) {
        const alcance_organico_pagina_values =
          alcance_organico_pagina[index].split('-split');
        const alcance_pago_pagina_values =
          alcance_pago_pagina[index].split('-split');

        const data = {
          ...globalData,
          nombre_red_social: 'facebook',
          num_alcance_organico: alcance_organico_pagina_values[0],
          num_alcance_pago: alcance_pago_pagina_values[0],
          fecha: this.detectDateByString(
            `${
              alcance_organico_pagina_values[1]
            }${this.initialDate.getFullYear()}`,
          ),
        };

        const existRecordsWithDate = await this.alcancePaginaRepository.findOne(
          {
            where: {
              identificacion_cliente: this.body.client_id,
              fecha: data.fecha,
            },
          },
        );

        !existRecordsWithDate
          ? this.insertData(data, 'facebook_alcance_pag')
          : '';
      }

      // ------- ALCANCE PUBLICACIONES --------

      alcance_total_pagina = alcance_total_pagina.map(
        (alcance_total_pagina) =>
          `${alcance_total_pagina[0]}-split${alcance_total_pagina[1]}`,
      );
      alcance_diario_persona = alcance_diario_persona.map(
        (alcance_diario_persona) =>
          `${alcance_diario_persona[0]}-split${alcance_diario_persona[1]}`,
      );
      alcance_diario_organico = alcance_diario_organico.map(
        (alcance_diario_organico) =>
          `${alcance_diario_organico[0]}-split${alcance_diario_organico[1]}`,
      );
      alcance_diario_pagado = alcance_diario_pagado.map(
        (alcance_diario_pagado) =>
          `${alcance_diario_pagado[0]}-split${alcance_diario_pagado[1]}`,
      );

      for (let index = 0; index < alcance_total_pagina.length; index++) {
        const alcance_total_pagina_values =
          alcance_total_pagina[index].split('-split');
        const alcance_diario_persona_values =
          alcance_diario_persona[index].split('-split');
        const alcance_diario_organico_values =
          alcance_diario_organico[index].split('-split');
        const alcance_diario_pagado_values =
          alcance_diario_pagado[index].split('-split');

        const data = {
          ...globalData,
          nombre_red_social: 'facebook',
          num_alcance_total_pagina: alcance_total_pagina_values[0],
          num_alcance_diario_persona: alcance_diario_persona_values[0],
          num_alcance_diario_organico: alcance_diario_organico_values[0],
          num_alcance_diario_pagado: alcance_diario_pagado_values[0],
          fecha: this.detectDateByString(
            `${
              alcance_total_pagina_values[1]
            }${this.initialDate.getFullYear()}`,
          ),
        };

        const existRecordsWithDate =
          await this.alcancePublicacionRepository.findOne({
            where: {
              identificacion_cliente: this.body.client_id,
              fecha: data.fecha,
            },
          });

        !existRecordsWithDate
          ? this.insertData(data, 'facebook_alcance_publicacion')
          : '';
      }
    } else if (network == 'instagram_posts') {
      let reacciones_ranking_ig = data.data[0].rows;
      let comentarios_ranking_ig = data.data[1].rows;
      let alcances_ranking_ig = data.data[2].rows;
      let guardadas_ranking_ig = data.data[3].rows;

      // ------- REACCIONES RANKING --------

      reacciones_ranking_ig = reacciones_ranking_ig.map(
        (reaccion_ranking_ig) =>
          `${reaccion_ranking_ig[0]}-split${reaccion_ranking_ig[2]}-split${reaccion_ranking_ig[3]}-split${reaccion_ranking_ig[4]}`,
      );

      reacciones_ranking_ig.forEach(async (reaccion_ranking_ig) => {
        const values = reaccion_ranking_ig.split('-split');

        const data = {
          ...globalData,
          nombre_red_social: 'instagram',
          publicacion: values[1],
          link: values[2],
          num_reacciones: values[3],
          fecha: this.detectDateByString(
            `${values[0]}${this.initialDate.getFullYear()}`,
          ),
        };

        const existRecordsWithDate =
          await this.reaccionRankingRepository.findOne({
            where: {
              identificacion_cliente: this.body.client_id,
              fecha: data.fecha,
            },
          });

        !existRecordsWithDate
          ? this.insertData(data, 'reacciones_ranking')
          : '';
      });

      // ------- COMENTARIOS RANKING --------

      comentarios_ranking_ig = comentarios_ranking_ig.map(
        (comentario_ranking_ig) =>
          `${comentario_ranking_ig[0]}-split${comentario_ranking_ig[2]}-split${comentario_ranking_ig[3]}-split${comentario_ranking_ig[4]}`,
      );

      comentarios_ranking_ig.forEach(async (comentario_ranking_ig) => {
        const values = comentario_ranking_ig.split('-split');

        const data = {
          ...globalData,
          nombre_red_social: 'instagram',
          publicacion: values[1],
          link: values[2],
          num_comentarios: values[3],
          fecha: this.detectDateByString(
            `${values[0]}${this.initialDate.getFullYear()}`,
          ),
        };

        const existRecordsWithDate =
          await this.comentarioRankingRepository.findOne({
            where: {
              identificacion_cliente: this.body.client_id,
              fecha: data.fecha,
            },
          });

        !existRecordsWithDate
          ? this.insertData(data, 'comentarios_ranking')
          : '';
      });

      // ------- GUARDADAS RANKING --------

      guardadas_ranking_ig = guardadas_ranking_ig.map(
        (guardada_ranking_ig) =>
          `${guardada_ranking_ig[0]}-split${guardada_ranking_ig[2]}-split${guardada_ranking_ig[3]}-split${guardada_ranking_ig[4]}`,
      );

      guardadas_ranking_ig.forEach(async (guardada_ranking_ig) => {
        const values = guardada_ranking_ig.split('-split');

        const data = {
          ...globalData,
          nombre_red_social: 'instagram',
          publicacion: values[1],
          link: values[2],
          num_guardados: values[3],
          fecha: this.detectDateByString(
            `${values[0]}${this.initialDate.getFullYear()}`,
          ),
        };

        const existRecordsWithDate =
          await this.guardadaRankingRepository.findOne({
            where: {
              identificacion_cliente: this.body.client_id,
              fecha: data.fecha,
            },
          });

        !existRecordsWithDate ? this.insertData(data, 'guardadas_ranking') : '';
      });

      // ------- ALCANCES RANKING --------

      alcances_ranking_ig = alcances_ranking_ig.map(
        (alcance_ranking_ig) =>
          `${alcance_ranking_ig[0]}-split${alcance_ranking_ig[2]}-split${alcance_ranking_ig[3]}-split${alcance_ranking_ig[4]}`,
      );

      alcances_ranking_ig.forEach(async (alcance_ranking_ig) => {
        const values = alcance_ranking_ig.split('-split');

        const data = {
          ...globalData,
          nombre_red_social: 'instagram',
          tipo_anuncio: 'no aplica',
          publicacion: values[1],
          link: values[2],
          num_alcance: values[3],
          fecha: this.detectDateByString(
            `${values[0]}${this.initialDate.getFullYear()}`,
          ),
        };

        const existRecordsWithDate =
          await this.alcanceRankingRepository.findOne({
            where: {
              identificacion_cliente: this.body.client_id,
              fecha: data.fecha,
            },
          });

        !existRecordsWithDate ? this.insertData(data, 'alcance_ranking') : '';
      });
      console.info(`
        Informacion Instagram Posts procesada -
        ${this.body.client_name}
        ${this.body.client_id}
        ${this.body.since}
        ${this.body.until}
        `);
    } else if (network == 'facebook_posts_metrics') {
      let publicaciones_alcance_organico_fb = data.data[0].rows;
      let publicaciones_alcance_pago_fb = data.data[1].rows;

      // ------- PUBLICACIONES MAS ALCANCE ORGANICO --------

      publicaciones_alcance_organico_fb = publicaciones_alcance_organico_fb.map(
        (publicacion_alcance_organico_fb) =>
          `${publicacion_alcance_organico_fb[0]}-split${publicacion_alcance_organico_fb[2]}-split${publicacion_alcance_organico_fb[3]}-split${publicacion_alcance_organico_fb[4]}`,
      );

      publicaciones_alcance_organico_fb.forEach(
        async (publicacion_alcance_organico_fb) => {
          const values = publicacion_alcance_organico_fb.split('-split');

          const data = {
            ...globalData,
            nombre_red_social: 'facebook',
            tipo_anuncio: 'organico',
            publicacion: values[1],
            link: values[2],
            num_alcance: values[3],
            fecha: this.detectDateByString(
              `${values[0]}${this.initialDate.getFullYear()}`,
            ),
          };

          const existRecordsWithDate =
            await this.alcanceRankingRepository.findOne({
              where: {
                identificacion_cliente: this.body.client_id,
                fecha: data.fecha,
                num_alcance: data.num_alcance,
              },
            });

          !existRecordsWithDate ? this.insertData(data, 'alcance_ranking') : '';
        },
      );

      // ------- PUBLICACIONES MAS ALCANCE PAGO --------

      publicaciones_alcance_pago_fb = publicaciones_alcance_pago_fb.map(
        (publicacion_alcance_pago_fb) =>
          `${publicacion_alcance_pago_fb[0]}-split${publicacion_alcance_pago_fb[2]}-split${publicacion_alcance_pago_fb[3]}-split${publicacion_alcance_pago_fb[4]}`,
      );

      publicaciones_alcance_pago_fb.forEach(
        async (publicacion_alcance_pago_fb) => {
          const values = publicacion_alcance_pago_fb.split('-split');

          const data = {
            ...globalData,
            nombre_red_social: 'facebook',
            tipo_anuncio: 'pago',
            publicacion: values[1],
            link: values[2],
            num_alcance: values[3],
            fecha: this.detectDateByString(
              `${values[0]}${this.initialDate.getFullYear()}`,
            ),
          };

          const existRecordsWithDate =
            await this.alcanceRankingRepository.findOne({
              where: {
                identificacion_cliente: this.body.client_id,
                fecha: data.fecha,
                num_alcance: data.num_alcance,
              },
            });

          !existRecordsWithDate ? this.insertData(data, 'alcance_ranking') : '';
        },
      );

      console.info(`
        Informacion Facebook Metrics procesada -
        ${this.body.client_name}
        ${this.body.client_id}
        ${this.body.since}
        ${this.body.until}
        `);
    } else if (network == 'facebook_posts_shares') {
      let publicaciones_compartidas_fb = data.data.rows;

      // ------- PUBLICACIONES MAS COMENTARIOS --------

      publicaciones_compartidas_fb = publicaciones_compartidas_fb.map(
        (publicacion_compartidas_fb) =>
          `${publicacion_compartidas_fb[0]}-split${publicacion_compartidas_fb[2]}-split${publicacion_compartidas_fb[3]}-split${publicacion_compartidas_fb[4]}`,
      );

      publicaciones_compartidas_fb.forEach(
        async (publicacion_compartidas_fb) => {
          const values = publicacion_compartidas_fb.split('-split');

          const data = {
            ...globalData,
            nombre_red_social: 'facebook',
            publicacion: values[1],
            link: values[2],
            num_guardados: values[3],
            fecha: this.detectDateByString(
              `${values[0]}${this.initialDate.getFullYear()}`,
            ),
          };

          const existRecordsWithDate =
            await this.guardadaRankingRepository.findOne({
              where: {
                identificacion_cliente: this.body.client_id,
                fecha: data.fecha,
                num_guardados: data.num_guardados,
              },
            });

          !existRecordsWithDate
            ? this.insertData(data, 'guardadas_ranking')
            : '';
        },
      );

      console.info(`
        Informacion Facebook Shares procesada -
        ${this.body.client_name}
        ${this.body.client_id}
        ${this.body.since}
        ${this.body.until}
        `);
    } else if (network == 'facebook_posts_reactions') {
      let publicaciones_reacciones_fb = data.data.rows;

      // ------- PUBLICACIONES MAS REACCIONES --------

      publicaciones_reacciones_fb = publicaciones_reacciones_fb.map(
        (publicacion_reacciones_fb) =>
          `${publicacion_reacciones_fb[0]}-split${publicacion_reacciones_fb[2]}-split${publicacion_reacciones_fb[3]}-split${publicacion_reacciones_fb[4]}`,
      );

      publicaciones_reacciones_fb.forEach(async (publicacion_reacciones_fb) => {
        const values = publicacion_reacciones_fb.split('-split');

        const data = {
          ...globalData,
          nombre_red_social: 'facebook',
          publicacion: values[1],
          link: values[2],
          num_reacciones: values[3],
          fecha: this.detectDateByString(
            `${values[0]}${this.initialDate.getFullYear()}`,
          ),
        };

        const existRecordsWithDate =
          await this.reaccionRankingRepository.findOne({
            where: {
              identificacion_cliente: this.body.client_id,
              fecha: data.fecha,
              num_reacciones: data.num_reacciones,
            },
          });

        !existRecordsWithDate
          ? this.insertData(data, 'reacciones_ranking')
          : '';
      });

      console.info(`
        Informacion Facebook Reactions procesada -
        ${this.body.client_name}
        ${this.body.client_id}
        ${this.body.since}
        ${this.body.until}
        `);
    }
  }

  insertData(data, table) {
    if (table == 'instagram_alcance') {
      this.alcanceInstagramRepository.save(data);
    } else if (table == 'instagram_seguidores') {
      this.seguidorInstagramRepository.save(data);
    } else if (table == 'reacciones_ranking') {
      this.reaccionRankingRepository.save(data);
    } else if (table == 'comentarios_ranking') {
      this.comentarioRankingRepository.save(data);
    } else if (table == 'guardadas_ranking') {
      this.guardadaRankingRepository.save(data);
    } else if (table == 'alcance_ranking') {
      this.alcanceRankingRepository.save(data);
    } else if (table == 'facebook_evolucion_likes') {
      this.evolucionLikesRepository.save(data);
    } else if (table == 'facebook_seguidores') {
      this.seguidorPaginaRepository.save(data);
    } else if (table == 'facebook_evolucion') {
      this.evolucionRepository.save(data);
    } else if (table == 'facebook_alcance_pag') {
      this.alcancePaginaRepository.save(data);
    } else if (table == 'facebook_alcance_publicacion') {
      this.alcancePublicacionRepository.save(data);
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

  detectDateByString(date) {
    const dateDetected = moment(new Date(date)).format('YYYY-MM-DD');
    return dateDetected;
  }

  getDatesIg(periodDate) {
    const currentDate = new Date();
    if (periodDate == 'since') {
      currentDate.setDate(currentDate.getDate() - 30);
      this.igDate =
        currentDate.getFullYear() +
        '-' +
        ('0' + (currentDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + currentDate.getDate()).slice(-2);
    } else {
      this.igDate =
        currentDate.getFullYear() +
        '-' +
        ('0' + (currentDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + currentDate.getDate()).slice(-2);
    }

    return this.igDate;
  }
}
