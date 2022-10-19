import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Evolucion {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id_evolucion',
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
  num_engagement: number;

  @Column({
    nullable: false,
    default: '',
  })
  num_alcance: number;

  @Column({
    nullable: false,
    default: '',
  })
  num_impresiones: number;

  @Column({
    nullable: false,
    default: '',
  })
  num_alcance_personas_hablando: number;

  @Column({
    name: 'fecha',
    nullable: false,
    default: '',
  })
  fecha: string;
}
