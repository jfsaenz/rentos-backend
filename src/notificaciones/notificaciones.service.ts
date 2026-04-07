import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private notificacionRepository: Repository<Notificacion>,
  ) {}

  async enviar(createNotificacionDto: CreateNotificacionDto): Promise<Notificacion> {
    // Simular envío de email (90% éxito)
    const estado = Math.random() > 0.1 ? 'enviado' : 'fallido';

    const notificacion = this.notificacionRepository.create({
      ...createNotificacionDto,
      estado,
    });

    return await this.notificacionRepository.save(notificacion);
  }

  async findAll(tenantId?: string): Promise<Notificacion[]> {
    const where = tenantId ? { tenantId } : {};
    return await this.notificacionRepository.find({
      where,
      order: { fecha: 'DESC' },
      take: 100,
    });
  }

  async enviarConfirmacionReserva(
    reservaId: string,
    cliente: string,
    email: string,
    vehiculo: string,
    fechas: string,
    tenantId?: string,
  ): Promise<Notificacion> {
    return this.enviar({
      tipo: 'confirmacion',
      destinatario: cliente,
      email,
      asunto: `Confirmación de Reserva #${reservaId}`,
      mensaje: `Tu reserva ha sido confirmada para el vehículo ${vehiculo} ${fechas}.`,
      reservaId,
      tenantId,
    });
  }

  async enviarCancelacion(
    reservaId: string,
    cliente: string,
    email: string,
    tenantId?: string,
  ): Promise<Notificacion> {
    return this.enviar({
      tipo: 'cancelacion',
      destinatario: cliente,
      email,
      asunto: `Cancelación de Reserva #${reservaId}`,
      mensaje: 'Tu reserva ha sido cancelada. El reembolso se procesará en 3-5 días hábiles.',
      reservaId,
      tenantId,
    });
  }

  async enviarRecibo(
    reservaId: string,
    cliente: string,
    email: string,
    monto: number,
    tenantId?: string,
  ): Promise<Notificacion> {
    return this.enviar({
      tipo: 'recibo',
      destinatario: cliente,
      email,
      asunto: `Recibo de Pago - Reserva #${reservaId}`,
      mensaje: `Gracias por tu preferencia. El monto total de $${monto} ha sido procesado exitosamente.`,
      reservaId,
      tenantId,
    });
  }
}
