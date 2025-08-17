export enum Area {
  // 東京
  SHIBUYA = 'SHIBUYA',
  SHINJUKU = 'SHINJUKU',
  GINZA = 'GINZA',
  ROPPONGI = 'ROPPONGI',
  IKEBUKURO = 'IKEBUKURO',
  AKASAKA = 'AKASAKA',
  KABUKICHO = 'KABUKICHO',
  
  // 関東
  YOKOHAMA = 'YOKOHAMA',
  OMIYA = 'OMIYA',
  CHIBA = 'CHIBA',
  
  // 北海道・東北
  SUSUKINO = 'SUSUKINO',
  SENDAI = 'SENDAI',
  
  // 中部
  NISHIKI = 'NISHIKI',
  SAKAE = 'SAKAE',
  SHIZUOKA = 'SHIZUOKA',
  NIIGATA = 'NIIGATA',
  
  // 関西
  KITASHINCHI = 'KITASHINCHI',
  NAMBA = 'NAMBA',
  UMEDA = 'UMEDA',
  TOBITA = 'TOBITA',
  KYOTO_GION = 'KYOTO_GION',
  KYOTO_PONTOCHO = 'KYOTO_PONTOCHO',
  KOBE_SANNOMIYA = 'KOBE_SANNOMIYA',
  KOBE_KITANO = 'KOBE_KITANO',
  
  // 中国・四国
  HIROSHIMA = 'HIROSHIMA',
  OKAYAMA = 'OKAYAMA',
  MATSUYAMA = 'MATSUYAMA',
  TAKAMATSU = 'TAKAMATSU',
  
  // 九州・沖縄
  NAKASU = 'NAKASU',
  TENJIN = 'TENJIN',
  KUMAMOTO = 'KUMAMOTO',
  KAGOSHIMA = 'KAGOSHIMA',
  NAHA = 'NAHA',
  KOKUSAIDORI = 'KOKUSAIDORI',
  
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

export interface AreaMaster {
  id: string
  key: string
  label: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface OnboardingData {
  area?: Area
  serviceType?: ServiceType
  budgetRange?: BudgetRange
}

export const AREA_LABELS: Record<Area, string> = {
  // 東京
  [Area.SHIBUYA]: '渋谷',
  [Area.SHINJUKU]: '新宿',
  [Area.GINZA]: '銀座',
  [Area.ROPPONGI]: '六本木',
  [Area.IKEBUKURO]: '池袋',
  [Area.AKASAKA]: '赤坂',
  [Area.KABUKICHO]: '歌舞伎町',
  
  // 関東
  [Area.YOKOHAMA]: '横浜',
  [Area.OMIYA]: '大宮',
  [Area.CHIBA]: '千葉',
  
  // 北海道・東北
  [Area.SUSUKINO]: 'すすきの',
  [Area.SENDAI]: '仙台',
  
  // 中部
  [Area.NISHIKI]: '錦',
  [Area.SAKAE]: '栄',
  [Area.SHIZUOKA]: '静岡',
  [Area.NIIGATA]: '新潟',
  
  // 関西
  [Area.KITASHINCHI]: '北新地',
  [Area.NAMBA]: '難波',
  [Area.UMEDA]: '梅田',
  [Area.TOBITA]: '飛田',
  [Area.KYOTO_GION]: '祇園',
  [Area.KYOTO_PONTOCHO]: '先斗町',
  [Area.KOBE_SANNOMIYA]: '三宮',
  [Area.KOBE_KITANO]: '北野',
  
  // 中国・四国
  [Area.HIROSHIMA]: '広島',
  [Area.OKAYAMA]: '岡山',
  [Area.MATSUYAMA]: '松山',
  [Area.TAKAMATSU]: '高松',
  
  // 九州・沖縄
  [Area.NAKASU]: '中洲',
  [Area.TENJIN]: '天神',
  [Area.KUMAMOTO]: '熊本',
  [Area.KAGOSHIMA]: '鹿児島',
  [Area.NAHA]: '那覇',
  [Area.KOKUSAIDORI]: '国際通り',
  
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