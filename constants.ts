
import { Indicator, Product, Sector } from './types';

export const PRODUCTS: Product[] = ['sittax', 'openix'];
export const SECTORS: Sector[] = ['agendamento', 'suporte', 'onboarding', 'ongoing', 'retencao'];

export const LOSS_TARGETS: Record<Product, number> = {
  sittax: 15499.20,
  openix: 8078.40
};

const getIndicatorsForProduct = (product: Product): Record<Sector, Indicator[]> => {
  return {
    agendamento: [
      { id: 'a1', name: "No Show - Onboarding", type: "numerico" },
      { id: 'a2', name: "Agendamentos Realizados 1 Etapa", type: "numerico" },
      { id: 'a3', name: "SLA - Primeiro contato (Pipedrive)", type: "numerico" }
    ],
    suporte: [
      { id: 's1', name: "CSAT", type: "percentual" },
      { id: 's2', name: "Tempo de Espera - WhatsApp", type: "tempo" },
      { id: 's3', name: "Notas Detratoras (%)", type: "percentual" },
      { id: 's4', name: "Taxa de Inatividade (%)", type: "percentual" }
    ],
    onboarding: [
      { id: 'o1', name: "Quantidades de Clientes", type: "numerico" },
      { id: 'o2', name: "Quantidades de Reuniões", type: "numerico" },
      { id: 'o3', name: "CSAT", type: "percentual" },
      { id: 'o4', name: `Migração ${product.charAt(0).toUpperCase() + product.slice(1)}`, type: "numerico" },
      { id: 'o5', name: "Solicitações de Cancelamento", type: "numerico" },
      { id: 'o6', name: "Cancelamentos", type: "numerico" },
      { id: 'o7', name: "Quantidade de Inadimplente", type: "numerico" }
    ],
    ongoing: [
      { id: 'g1', name: "Quantidades de Clientes", type: "numerico" },
      { id: 'g2', name: "Quantidades de contatos efetivos", type: "numerico" },
      { id: 'g3', name: "CSAT", type: "percentual" },
      { id: 'g4', name: "Solicitações de Cancelamento", type: "numerico" },
      { id: 'g5', name: "Cancelamentos", type: "numerico" },
      { id: 'g6', name: "Quantidade de Inadimplente", type: "numerico" }
    ],
    retencao: [
      { id: 'r1', name: "Solicitações de Cancelamento", type: "numerico" },
      { id: 'r2', name: "Reuniões Realizadas", type: "numerico" },
      { id: 'r3', name: "Reversão de Cancelamentos", type: "numerico" },
      { id: 'r4', name: "Cancelamentos", type: "numerico" },
      { id: 'r5', name: "MRR Cancelado (R$)", type: "moeda" },
      { id: 'r7', name: "Cancelamento Automático", type: "numerico" }
    ]
  };
};

export const INITIAL_INDICATORS: Record<Product, Record<Sector, Indicator[]>> = {
  sittax: getIndicatorsForProduct('sittax'),
  openix: getIndicatorsForProduct('openix')
};
