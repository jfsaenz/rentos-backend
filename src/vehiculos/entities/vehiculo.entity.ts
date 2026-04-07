import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modelo: string;

  @Column()
  marca: string;

  @Column()
  anio: number;

  @Column({ unique: true })
  placa: string;

  @Column()
  kilometraje: number;

  @Column()
  proximoMantenimiento: number;

  @Column({ type: 'enum', enum: ['available', 'maintenance', 'rented'], default: 'available' })
  estado: string;

  @Column({ type: 'enum', enum: ['Sport', 'Adventure', 'Naked', 'Cruiser'] })
  tipo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioDia: number;

  @Column()
  foto: string;

  @Column({ nullable: true })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
