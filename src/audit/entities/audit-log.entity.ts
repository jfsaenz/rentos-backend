import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  action: string; // CREATE, UPDATE, DELETE, LOGIN, LOGOUT

  @Column()
  entity: string; // vehiculo, cliente, reserva, etc.

  @Column({ nullable: true })
  entityId: string;

  @Column('jsonb', { nullable: true })
  oldValue: any;

  @Column('jsonb', { nullable: true })
  newValue: any;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  tenantId: string;
}
