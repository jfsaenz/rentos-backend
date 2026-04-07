import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehiculo } from '../../vehiculos/entities/vehiculo.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehiculoId: number;

  @ManyToOne(() => Vehiculo)
  @JoinColumn({ name: 'vehiculoId' })
  vehiculo: Vehiculo;

  @Column()
  clienteId: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column()
  fechaInicio: string;

  @Column()
  fechaFin: string;

  @Column({ type: 'jsonb' })
  desglose: {
    dias: number;
    precioDia: number;
    totalExtras: number;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalFinal: number;

  @Column({ type: 'enum', enum: ['confirmada', 'cancelada', 'finalizada'], default: 'confirmada' })
  estado: string;

  @Column({ type: 'jsonb' })
  pago: {
    metodoPago: string;
    estado: string;
    fechaOperacion: string;
    referencia: string;
  };

  @Column({ nullable: true })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
