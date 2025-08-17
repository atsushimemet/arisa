import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
    { key: 'SHIBUYA', label: '渋谷', sortOrder: 0 },
    { key: 'SHINJUKU', label: '新宿', sortOrder: 1 },
    { key: 'GINZA', label: '銀座', sortOrder: 2 },
    { key: 'ROPPONGI', label: '六本木', sortOrder: 3 },
    { key: 'IKEBUKURO', label: '池袋', sortOrder: 4 },
    { key: 'AKASAKA', label: '赤坂', sortOrder: 5 },
    { key: 'KABUKICHO', label: '歌舞伎町', sortOrder: 6 },
    { key: 'OTHER', label: 'その他', sortOrder: 7 }
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
  // エリア名は AreaMaster の label を使用（String フィールドに合わせる）
  const sampleCasts = [
    {
      name: '美咲',
      snsLink: 'https://twitter.com/misaki_cast',
      storeLink: 'https://example-store1.com',
      area: '渋谷', // AreaMaster の label を使用
      serviceType: 'KYABA',
      budgetRange: 'FROM_20K_TO_30K'
    },
    {
      name: 'あやか',
      snsLink: 'https://instagram.com/ayaka_cast',
      storeLink: 'https://example-store2.com',
      area: '新宿', // AreaMaster の label を使用
      serviceType: 'GIRLS_BAR',
      budgetRange: 'FROM_10K_TO_20K'
    },
    {
      name: 'ゆい',
      snsLink: 'https://twitter.com/yui_cast',
      storeLink: null,
      area: '銀座', // AreaMaster の label を使用
      serviceType: 'LOUNGE',
      budgetRange: 'FROM_30K_TO_50K'
    },
    {
      name: 'りな',
      snsLink: 'https://instagram.com/rina_cast',
      storeLink: 'https://example-store3.com',
      area: '六本木', // AreaMaster の label を使用
      serviceType: 'CLUB',
      budgetRange: 'OVER_50K'
    },
    {
      name: 'さくら',
      snsLink: 'https://twitter.com/sakura_cast',
      storeLink: 'https://example-store4.com',
      area: '池袋', // AreaMaster の label を使用
      serviceType: 'SNACK',
      budgetRange: 'UNDER_10K'
    },
    {
      name: 'まい',
      snsLink: 'https://instagram.com/mai_cast',
      storeLink: null,
      area: '赤坂', // AreaMaster の label を使用
      serviceType: 'KYABA',
      budgetRange: 'FROM_20K_TO_30K'
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