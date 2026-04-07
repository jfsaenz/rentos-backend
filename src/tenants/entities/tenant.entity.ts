import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tenantId: string;

  @Column()
  nombreAgencia: string;

  @Column()
  emailAdmin: string;

  @Column({ type: 'enum', enum: ['basico', 'profesional', 'empresarial'] })
  plan: string;

  @Column({ type: 'enum', enum: ['activo', 'suspendido', 'inactivo'], default: 'activo' })
  estado: string;

  @Column()
  fechaSuscripcion: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @Column({ default: 0 })
  vehiculosRegistrados: number;

  @Column()
  limiteVehiculos: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
