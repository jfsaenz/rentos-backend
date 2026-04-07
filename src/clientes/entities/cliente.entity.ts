import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'enum', enum: ['CC', 'Pasaporte', 'CE'] })
  tipoDocumento: string;

  @Column({ unique: true })
  numeroDocumento: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

  @Column()
  fechaNacimiento: string;

  @Column({ type: 'jsonb' })
  licencia: {
    numero: string;
    categoria: string;
    fechaVencimiento: string;
  };

  @Column()
  direccion: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 0 })
  reservasTotales: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalGastado: number;

  @Column({ default: 0 })
  cancelaciones: number;

  @Column({ default: 100 })
  score: number;

  @Column({ nullable: true })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
