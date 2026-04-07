import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['confirmacion', 'cancelacion', 'recibo', 'recordatorio'] })
  tipo: string;

  @Column()
  destinatario: string;

  @Column()
  email: string;

  @Column()
  asunto: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ nullable: true })
  reservaId: string;

  @Column({ type: 'enum', enum: ['enviado', 'fallido', 'pendiente'], default: 'pendiente' })
  estado: string;

  @Column({ nullable: true })
  tenantId: string;

  @CreateDateColumn()
  fecha: Date;
}
