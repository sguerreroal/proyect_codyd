import { AlcanceInstagram } from './alcance_instagram.entity';
import { AlcanceRanking } from './alcance_ranking.entity';
import { ComentariosRanking } from './comentarios_ranking.entity';
import { EvolucionLikes } from './evolucion_likes.entity';
import { GuardadasRanking } from './guardadas_ranking.entity';
import { ReaccionesRanking } from './reacciones_ranking.entity';
import { SeguidorInstagram } from './seguidores_instagram.entity';

const entities = [
  AlcanceInstagram,
  SeguidorInstagram,
  ReaccionesRanking,
  ComentariosRanking,
  GuardadasRanking,
  AlcanceRanking,
  EvolucionLikes,
];

export {
  AlcanceInstagram,
  SeguidorInstagram,
  ReaccionesRanking,
  ComentariosRanking,
  GuardadasRanking,
  AlcanceRanking,
  EvolucionLikes,
};
export default entities;
