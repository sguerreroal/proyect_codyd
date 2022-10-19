import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('alcance_publicaciones')
export class AlcancePublicacion {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id_alcance_publicaciones',
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
  num_alcance_total_pagina: number;

  @Column({
    nullable: false,
    default: '',
  })
  num_alcance_diario_persona: number;

  @Column({
    nullable: false,
    default: '',
  })
  num_alcance_diario_organico: number;

  @Column({
    nullable: false,
    default: '',
  })
  num_alcance_diario_pagado: number;

  @Column({
    name: 'fecha',
    nullable: false,
    default: '',
  })
  fecha: string;
}
