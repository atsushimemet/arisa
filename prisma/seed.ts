import { PrismaClient, Area, ServiceType, BudgetRange } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('シードデータを作成中...')

  // 管理者アカウントを作成
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@arisa.com' },
    update: {},
    create: {
      email: 'admin@arisa.com',
      password: hashedPassword,
      name: 'Arisa Admin'
    }
  })

  console.log('管理者アカウントを作成しました:', admin.email)

  // エリアマスターデータを作成
  const sampleAreas = [
    // 東京
    { key: 'SHIBUYA', label: '渋谷', sortOrder: 0 },
    { key: 'SHINJUKU', label: '新宿', sortOrder: 1 },
    { key: 'GINZA', label: '銀座', sortOrder: 2 },
    { key: 'ROPPONGI', label: '六本木', sortOrder: 3 },
    { key: 'IKEBUKURO', label: '池袋', sortOrder: 4 },
    { key: 'AKASAKA', label: '赤坂', sortOrder: 5 },
    { key: 'KABUKICHO', label: '歌舞伎町', sortOrder: 6 },
    
    // 関東
    { key: 'YOKOHAMA', label: '横浜', sortOrder: 10 },
    { key: 'OMIYA', label: '大宮', sortOrder: 11 },
    { key: 'CHIBA', label: '千葉', sortOrder: 12 },
    
    // 北海道・東北
    { key: 'SUSUKINO', label: 'すすきの', sortOrder: 20 },
    { key: 'SENDAI', label: '仙台', sortOrder: 21 },
    
    // 中部
    { key: 'NISHIKI', label: '錦', sortOrder: 30 },
    { key: 'SAKAE', label: '栄', sortOrder: 31 },
    { key: 'SHIZUOKA', label: '静岡', sortOrder: 32 },
    { key: 'NIIGATA', label: '新潟', sortOrder: 33 },
    
    // 関西
    { key: 'KITASHINCHI', label: '北新地', sortOrder: 40 },
    { key: 'NAMBA', label: '難波', sortOrder: 41 },
    { key: 'UMEDA', label: '梅田', sortOrder: 42 },
    { key: 'TOBITA', label: '飛田', sortOrder: 43 },
    { key: 'KYOTO_GION', label: '祇園', sortOrder: 44 },
    { key: 'KYOTO_PONTOCHO', label: '先斗町', sortOrder: 45 },
    { key: 'KOBE_SANNOMIYA', label: '三宮', sortOrder: 46 },
    { key: 'KOBE_KITANO', label: '北野', sortOrder: 47 },
    
    // 中国・四国
    { key: 'HIROSHIMA', label: '広島', sortOrder: 50 },
    { key: 'OKAYAMA', label: '岡山', sortOrder: 51 },
    { key: 'MATSUYAMA', label: '松山', sortOrder: 52 },
    { key: 'TAKAMATSU', label: '高松', sortOrder: 53 },
    
    // 九州・沖縄
    { key: 'NAKASU', label: '中洲', sortOrder: 60 },
    { key: 'TENJIN', label: '天神', sortOrder: 61 },
    { key: 'KUMAMOTO', label: '熊本', sortOrder: 62 },
    { key: 'KAGOSHIMA', label: '鹿児島', sortOrder: 63 },
    { key: 'NAHA', label: '那覇', sortOrder: 64 },
    { key: 'KOKUSAIDORI', label: '国際通り', sortOrder: 65 },
    
    { key: 'OTHER', label: 'その他', sortOrder: 99 }
  ]

  for (const areaData of sampleAreas) {
    const area = await prisma.areaMaster.upsert({
      where: { key: areaData.key },
      update: {},
      create: {
        ...areaData,
        isActive: true
      }
    })
    console.log('エリアを作成しました:', area.label)
  }

  // サンプルキャストデータを作成
  // エナム値を直接使用
  const sampleCasts = [
    {
      name: '美咲',
      snsLink: 'https://twitter.com',
      storeLink: 'https://google.com',
      area: Area.SHIBUYA, // Areaエナムを使用
      serviceType: ServiceType.KYABA,
      budgetRange: BudgetRange.FROM_20K_TO_30K
    },
    {
      name: 'あやか',
      snsLink: 'https://instagram.com',
      storeLink: 'https://yahoo.co.jp',
      area: Area.SHINJUKU, // Areaエナムを使用
      serviceType: ServiceType.GIRLS_BAR,
      budgetRange: BudgetRange.FROM_10K_TO_20K
    },
    {
      name: 'ゆい',
      snsLink: 'https://twitter.com',
      storeLink: null,
      area: Area.GINZA, // Areaエナムを使用
      serviceType: ServiceType.LOUNGE,
      budgetRange: BudgetRange.FROM_30K_TO_50K
    },
    {
      name: 'りな',
      snsLink: 'https://instagram.com',
      storeLink: 'https://github.com',
      area: Area.ROPPONGI, // Areaエナムを使用
      serviceType: ServiceType.CLUB,
      budgetRange: BudgetRange.OVER_50K
    },
    {
      name: 'さくら',
      snsLink: 'https://twitter.com',
      storeLink: 'https://youtube.com',
      area: Area.IKEBUKURO, // Areaエナムを使用
      serviceType: ServiceType.SNACK,
      budgetRange: BudgetRange.UNDER_10K
    },
    {
      name: 'まい',
      snsLink: 'https://instagram.com',
      storeLink: null,
      area: Area.AKASAKA, // Areaエナムを使用
      serviceType: ServiceType.KYABA,
      budgetRange: BudgetRange.FROM_20K_TO_30K
    }
  ]

  for (const castData of sampleCasts) {
    const cast = await prisma.cast.upsert({
      where: { snsLink: castData.snsLink },
      update: {},
      create: {
        ...castData,
        isActive: true
      }
    })
    console.log('キャストを作成しました:', cast.name)
  }

  console.log('シードデータの作成が完了しました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })