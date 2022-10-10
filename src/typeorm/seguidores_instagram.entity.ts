import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seguidores_instagram')
export class SeguidorInstagram {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id_no_comunidad_instagram',
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
  num_comunidad: number;

  @Column({
    name: 'fecha',
    nullable: false,
    default: '',
  })
  fecha: string;
}
