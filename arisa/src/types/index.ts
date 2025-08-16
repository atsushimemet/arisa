export enum Area {
  SHIBUYA = 'SHIBUYA',
  SHINJUKU = 'SHINJUKU',
  GINZA = 'GINZA',
  ROPPONGI = 'ROPPONGI',
  IKEBUKURO = 'IKEBUKURO',
  AKASAKA = 'AKASAKA',
  KABUKICHO = 'KABUKICHO',
  OTHER = 'OTHER'
}

export enum ServiceType {
  KYABA = 'KYABA',
  GIRLS_BAR = 'GIRLS_BAR',
  SNACK = 'SNACK',
  LOUNGE = 'LOUNGE',
  CLUB = 'CLUB',
  OTHER = 'OTHER'
}

export enum BudgetRange {
  UNDER_10K = 'UNDER_10K',
  FROM_10K_TO_20K = 'FROM_10K_TO_20K',
  FROM_20K_TO_30K = 'FROM_20K_TO_30K',
  FROM_30K_TO_50K = 'FROM_30K_TO_50K',
  OVER_50K = 'OVER_50K'
}

export interface Cast {
  id: string
  name: string
  snsLink: string
  storeLink?: string
  area: Area
  serviceType: ServiceType
  budgetRange: BudgetRange
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface OnboardingData {
  area?: Area
  serviceType?: ServiceType
  budgetRange?: BudgetRange
}

export const AREA_LABELS: Record<Area, string> = {
  [Area.SHIBUYA]: '渋谷',
  [Area.SHINJUKU]: '新宿',
  [Area.GINZA]: '銀座',
  [Area.ROPPONGI]: '六本木',
  [Area.IKEBUKURO]: '池袋',
  [Area.AKASAKA]: '赤坂',
  [Area.KABUKICHO]: '歌舞伎町',
  [Area.OTHER]: 'その他'
}

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [ServiceType.KYABA]: 'キャバクラ',
  [ServiceType.GIRLS_BAR]: 'ガールズバー',
  [ServiceType.SNACK]: 'スナック',
  [ServiceType.LOUNGE]: 'ラウンジ',
  [ServiceType.CLUB]: 'クラブ',
  [ServiceType.OTHER]: 'その他'
}

export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  [BudgetRange.UNDER_10K]: '〜1万円',
  [BudgetRange.FROM_10K_TO_20K]: '1万円〜2万円',
  [BudgetRange.FROM_20K_TO_30K]: '2万円〜3万円',
  [BudgetRange.FROM_30K_TO_50K]: '3万円〜5万円',
  [BudgetRange.OVER_50K]: '5万円〜'
}