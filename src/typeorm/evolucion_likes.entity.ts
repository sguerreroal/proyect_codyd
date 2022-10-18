import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EvolucionLikes {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id_no_evolucion_likes',
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
  num_likes: number;

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
