import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AlcancePagina {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id_no_alcance_pagina',
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
  num_alcance_organico: number;

  @Column({
    nullable: false,
    default: '',
  })
  num_alcance_pago: number;

  @Column({
    name: 'fecha',
    nullable: false,
    default: '',
  })
  fecha: string;
}
