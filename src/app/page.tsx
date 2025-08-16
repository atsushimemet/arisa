'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Home() {
  const router = useRouter()

  const handleStartOnboarding = () => {
    router.push('/onboarding')
  }

  const features = [
    {
      icon: '🎯',
      title: 'シンプルな検索',
      description: 'エリア・接客スタイル・予算で簡単に条件を絞り込み'
    },
    {
      icon: '✨',
      title: '信頼できるキャスト',
      description: 'SNS更新を継続している努力型キャストのみを厳選'
    },
    {
      icon: '🔗',
      title: '直接SNSへ',
      description: '広告に埋もれず、キャストのSNSに直接アクセス'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* ヒーローセクション */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 glow-text">
              Arisa
            </h1>
            <div className="text-2xl text-gray-300 mb-8">
              あなたにぴったりのキャストを見つけよう
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-lg text-gray-300 leading-relaxed">
              エリア・接客スタイル・予算に応じた「顔出し投稿キャスト」への導線をシンプルに提示。
              <br />
              SNS更新を継続するキャストが報われる仕組みで、努力型キャストの集客を支援します。
            </p>
          </div>

          <Button 
            onClick={handleStartOnboarding}
            variant="primary"
            size="lg"
            glow
            className="text-xl px-12 py-4"
          >
            キャストを探す
          </Button>
        </div>

        {/* 特徴セクション */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:scale-105 transform transition-all duration-300">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* 使い方セクション */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-12 glow-text">使い方</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'エリア選択', description: 'お好みのエリアを選択' },
              { step: '2', title: '接客スタイル', description: '雰囲気を選択' },
              { step: '3', title: '予算設定', description: 'ご予算を選択' },
              { step: '4', title: 'キャスト発見', description: 'SNSで確認・来店' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-r from-glow-primary to-glow-secondary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4 animate-pulse-glow">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-gray-300 text-sm">{item.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-full w-full">
                    <div className="border-t-2 border-dashed border-glow-primary opacity-50"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTAセクション */}
        <div className="text-center bg-dark-secondary rounded-2xl p-12 glow-border">
          <h2 className="text-3xl font-bold mb-6 glow-text">
            今すぐ始めましょう
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            簡単な質問に答えるだけで、あなたにぴったりのキャストが見つかります
          </p>
          <Button 
            onClick={handleStartOnboarding}
            variant="primary"
            size="lg"
            glow
            className="text-xl px-12 py-4"
          >
            無料で始める
          </Button>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-dark-primary border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-glow-primary font-bold text-2xl mb-4">Arisa</div>
          <p className="text-gray-400 text-sm">
            © 2024 Arisa. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
