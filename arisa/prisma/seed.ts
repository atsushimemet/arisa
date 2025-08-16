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

  // サンプルキャストデータを作成
  const sampleCasts = [
    {
      name: '美咲',
      snsLink: 'https://twitter.com/misaki_cast',
      storeLink: 'https://example-store1.com',
      area: 'SHIBUYA',
      serviceType: 'KYABA',
      budgetRange: 'FROM_20K_TO_30K'
    },
    {
      name: 'あやか',
      snsLink: 'https://instagram.com/ayaka_cast',
      storeLink: 'https://example-store2.com',
      area: 'SHINJUKU',
      serviceType: 'GIRLS_BAR',
      budgetRange: 'FROM_10K_TO_20K'
    },
    {
      name: 'ゆい',
      snsLink: 'https://twitter.com/yui_cast',
      storeLink: null,
      area: 'GINZA',
      serviceType: 'LOUNGE',
      budgetRange: 'FROM_30K_TO_50K'
    },
    {
      name: 'りな',
      snsLink: 'https://instagram.com/rina_cast',
      storeLink: 'https://example-store3.com',
      area: 'ROPPONGI',
      serviceType: 'CLUB',
      budgetRange: 'OVER_50K'
    },
    {
      name: 'さくら',
      snsLink: 'https://twitter.com/sakura_cast',
      storeLink: 'https://example-store4.com',
      area: 'IKEBUKURO',
      serviceType: 'SNACK',
      budgetRange: 'UNDER_10K'
    },
    {
      name: 'まい',
      snsLink: 'https://instagram.com/mai_cast',
      storeLink: null,
      area: 'AKASAKA',
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
        area: castData.area as any,
        serviceType: castData.serviceType as any,
        budgetRange: castData.budgetRange as any,
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