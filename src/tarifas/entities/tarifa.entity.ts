import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tarifas')
export class Tarifa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'enum', enum: ['descuento_largo', 'fin_semana', 'temporada_alta'] })
  tipo: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  porcentaje: number;

  @Column({ type: 'jsonb' })
  vehiculosAplicables: any;

  @Column({ default: true })
  activa: boolean;

  @Column({ nullable: true })
  fechaInicio: string;

  @Column({ nullable: true })
  fechaFin: string;

  @Column({ nullable: true })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
