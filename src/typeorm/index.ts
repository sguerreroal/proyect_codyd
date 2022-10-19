import { AlcanceInstagram } from './alcance_instagram.entity';
import { AlcancePagina } from './alcance_pagina.entity';
import { AlcancePublicacion } from './alcance_publicaciones.entity';
import { AlcanceRanking } from './alcance_ranking.entity';
import { ComentariosRanking } from './comentarios_ranking.entity';
import { Evolucion } from './evolucion.entity';
import { EvolucionLikes } from './evolucion_likes.entity';
import { GuardadasRanking } from './guardadas_ranking.entity';
import { ReaccionesRanking } from './reacciones_ranking.entity';
import { SeguidorInstagram } from './seguidores_instagram.entity';
import { SeguidorPagina } from './seguidores_pagina.entity';

const entities = [
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
];

export {
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
};
export default entities;
