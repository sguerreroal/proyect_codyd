import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReaccionesRanking {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id_reacciones_ranking_instagram',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  identificacion_cliente: string;

  @Column({
    nullable: false,
    default: '',
  })
  nombre_cliente: string;

  @Column({
    nullable: false,
    default: '',
  })
  nombre_red_social: string;

  @Column({
    nullable: false,
    default: '',
  })
  publicacion: string;

  @Column({
    nullable: false,
    default: '',
  })
  link: string;

  @Column({
    nullable: false,
    default: '',
  })
  num_reacciones: number;

  @Column({
    name: 'fecha',
    nullable: false,
    default: '',
  })
  fecha: string;
}
