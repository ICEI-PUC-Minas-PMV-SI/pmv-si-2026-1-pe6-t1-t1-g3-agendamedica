import type { Activity } from './types'

export const ACTIVITY: Activity[] = [
  {
    id: 1,
    type: 'confirmed',
    text: '<b>Dra. Marina Figueiredo</b> confirmou sua consulta de hoje.',
    time: 'há 2h',
  },
  {
    id: 2,
    type: 'rescheduled',
    text: '<b>Helena Prado</b> remarcou consulta para 02/mai.',
    time: 'ontem',
  },
  {
    id: 4,
    type: 'confirmed',
    text: 'Consulta de <b>Clínica Geral</b> concluída.',
    time: '18 dias',
  },
]
