import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seguidores_pagina')
export class SeguidorPagina {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id_no_seguidores',
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
  num_seguidores: number;

  @Column({
    nullable: false,
    default: '',
  })
  num_ganados: number;

  @Column({
    nullable: false,
    default: '',
  })
  num_perdidos: number;

  @Column({
    name: 'fecha',
    nullable: false,
    default: '',
  })
  fecha: string;
}
