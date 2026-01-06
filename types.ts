
export type Product = 'sittax' | 'openix';
export type Sector = 'agendamento' | 'suporte' | 'onboarding' | 'ongoing' | 'retencao';
export type IndicatorType = 'numerico' | 'percentual' | 'tempo' | 'decimal' | 'moeda';

export interface Indicator {
  id: string;
  name: string;
  type: IndicatorType;
}

export interface IndicatorData {
  [indicatorName: string]: number;
}

export interface SectorData {
  [date: string]: IndicatorData;
}

export interface ProductData {
  [sector: string]: SectorData;
}

export interface MonthData {
  [product: string]: ProductData;
}

export interface IndicatorConfig {
  [product: string]: {
    [sector: string]: Indicator[];
  };
}

export interface MonthOption {
  key: string;
  name: string;
}
