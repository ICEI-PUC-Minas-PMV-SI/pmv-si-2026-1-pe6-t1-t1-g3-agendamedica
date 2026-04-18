import React from 'react'
import type { User, Appointment, Notification, Activity } from './types'

export const USER: User = {
  id: 'u-001',
  name: 'Ana Beatriz Lima',
  email: 'ana.lima@medhub.app',
  role: 'PATIENT',
  initials: 'AB',
}

export const APPOINTMENTS: Appointment[] = [
  {
    id: 'a-01',
    date: '2026-04-18T14:30:00',
    status: 'CONFIRMED',
    doctor: 'Dra. Marina Figueiredo',
    specialty: 'Cardiologia',
    clinic: 'Clínica Santa Luz — Unidade Centro',
    mode: 'presencial',
    isToday: true,
  },
  {
    id: 'a-02',
    date: '2026-04-23T09:00:00',
    status: 'PENDING',
    doctor: 'Dr. Rafael Monteiro',
    specialty: 'Clínico Geral',
    clinic: 'Teleconsulta',
    mode: 'tele',
    isToday: false,
  },
  {
    id: 'a-03',
    date: '2026-05-02T16:15:00',
    status: 'RESCHEDULED',
    doctor: 'Dra. Helena Prado',
    specialty: 'Dermatologia',
    clinic: 'Clínica Santa Luz — Pampulha',
    mode: 'presencial',
    isToday: false,
  },
]

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n-01',
    type: 'APPOINTMENT_CONFIRMED',
    title: 'Consulta confirmada',
    message: 'Sua consulta com Dra. Marina Figueiredo hoje às 14:30 foi confirmada pela clínica.',
    createdAt: '2026-04-18T08:12:00',
    read: false,
    appointmentId: 'a-01',
  },
  {
    id: 'n-02',
    type: 'APPOINTMENT_RESCHEDULED',
    title: 'Horário remarcado',
    message: 'Dra. Helena Prado remarcou sua consulta de Dermatologia para 02/mai, 16:15.',
    createdAt: '2026-04-17T17:40:00',
    read: false,
    appointmentId: 'a-03',
  },
  {
    id: 'n-03',
    type: 'APPOINTMENT_CREATED',
    title: 'Lembrete de preparo',
    message:
      'Sua teleconsulta com Dr. Rafael Monteiro é em 5 dias. Tenha seus exames recentes em mãos.',
    createdAt: '2026-04-17T09:02:00',
    read: false,
    appointmentId: 'a-02',
  },
  {
    id: 'n-04',
    type: 'APPOINTMENT_CREATED',
    title: 'Resumo mensal',
    message: 'Você teve 2 consultas realizadas em março. Confira o histórico completo.',
    createdAt: '2026-04-15T11:20:00',
    read: true,
    appointmentId: null,
  },
]

export const ACTIVITY: Activity[] = [
  {
    id: 1,
    type: 'confirmed',
    text: (
      <>
        <b>Dra. Marina Figueiredo</b> confirmou sua consulta de hoje.
      </>
    ),
    time: 'há 2h',
  },
  {
    id: 2,
    type: 'rescheduled',
    text: (
      <>
        <b>Helena Prado</b> remarcou consulta para 02/mai.
      </>
    ),
    time: 'ontem',
  },
  {
    id: 4,
    type: 'confirmed',
    text: (
      <>
        Consulta de <b>Clínica Geral</b> concluída.
      </>
    ),
    time: '18 dias',
  },
]
