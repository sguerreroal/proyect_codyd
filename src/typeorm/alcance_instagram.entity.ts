import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AlcanceInstagram {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id_no_alcance_pagina_instagram',
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
  num_alcance_instagram: number;

  @Column({
    name: 'fecha',
    nullable: false,
    default: '',
  })
  fecha: string;
}
