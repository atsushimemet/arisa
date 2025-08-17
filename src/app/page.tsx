'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Zap, Target, Star, Link, ArrowRight, Sparkles, Users, Shield } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleStartOnboarding = () => {
    router.push('/onboarding')
  }

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'シンプルな検索',
      description: 'エリア・接客スタイル・予算で簡単に条件を絞り込み',
      color: 'text-ios-blue'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: '信頼できるキャスト',
      description: 'SNS更新を継続している努力型キャストのみを厳選',
      color: 'text-ios-purple'
    },
    {
      icon: <Link className="w-8 h-8" />,
      title: '直接SNSへ',
      description: '広告に埋もれず、キャストのSNSに直接アクセス',
      color: 'text-ios-green'
    }
  ]

  const stats = [
    { number: '1000+', label: 'アクティブキャスト', icon: <Users className="w-6 h-6" /> },
    { number: '98%', label: '満足度', icon: <Star className="w-6 h-6" /> },
    { number: '24/7', label: 'サポート', icon: <Shield className="w-6 h-6" /> }
  ]

  return (
    <div className="min-h-screen w-full bg-ios-gradient relative overflow-hidden font-ios">
      {/* Hero Section */}
      <div className="relative z-10 w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 max-w-7xl mx-auto">
          <div className={`text-center mb-16 sm:mb-20 lg:mb-24 transition-all duration-1000 ${isLoaded ? 'ios-slide-up' : 'opacity-0'}`}>
            {/* Main title */}
            <div className="mb-12">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 ios-title text-foreground tracking-ios-tight">
                Arisa
              </h1>
              <div className="text-xl sm:text-2xl lg:text-3xl mb-8 ios-subtitle px-4">
                あなたにぴったりの
                <span className="text-ios-blue ml-2 font-semibold">キャスト</span>
                を見つけよう
                <Sparkles className="inline-block w-6 h-6 sm:w-7 sm:h-7 ml-2 text-ios-orange animate-float" />
              </div>
            </div>
            
            {/* Enhanced description */}
            <div className={`max-w-3xl mx-auto mb-12 sm:mb-16 px-4 transition-all duration-1000 delay-200 ${isLoaded ? 'ios-fade-in' : 'opacity-0'}`}>
              <Card variant="glass" padding="xl" className="backdrop-blur-xl">
                <p className="text-base sm:text-lg lg:text-xl ios-body leading-relaxed">
                  エリア・接客スタイル・予算に応じた「顔出し投稿キャスト」への導線をシンプルに提示。
                  <br />
                  <span className="text-ios-green font-semibold">SNS更新を継続するキャスト</span>が報われる仕組みで、
                  <span className="text-ios-purple font-semibold">努力型キャストの集客</span>を支援します。
                </p>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4 transition-all duration-1000 delay-400 ${isLoaded ? 'ios-scale-in' : 'opacity-0'}`}>
              <Button 
                onClick={handleStartOnboarding}
                variant="primary"
                size="xl"
                icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6" />}
                className="text-lg sm:text-xl font-semibold w-full sm:w-auto"
              >
                キャストを探す
              </Button>
              <Button 
                onClick={() => router.push('/admin')}
                variant="secondary"
                size="lg"
                icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="text-base sm:text-lg w-full sm:w-auto"
              >
                管理者ページ
              </Button>
            </div>

            {/* Stats section */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20 px-4 transition-all duration-1000 delay-600 ${isLoaded ? 'ios-slide-up' : 'opacity-0'}`}>
              {stats.map((stat, index) => (
                <Card key={index} variant="elevated" padding="lg" className="text-center">
                  <div className="flex items-center justify-center mb-4 text-ios-blue">
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2 ios-title">{stat.number}</div>
                  <div className="ios-caption">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-20 sm:mb-24 lg:mb-28 px-4 transition-all duration-1000 delay-800 ${isLoaded ? 'ios-slide-up' : 'opacity-0'}`}>
            {features.map((feature, index) => (
              <Card 
                key={index} 
                variant="default"
                padding="xl"
                className="text-center hover:scale-105 transform transition-all duration-300"
              >
                <div className={`text-4xl sm:text-5xl mb-6 flex justify-center ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 ios-subtitle">{feature.title}</h3>
                <p className="ios-body leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Process Steps Section */}
          <div className={`text-center mb-20 sm:mb-24 lg:mb-28 px-4 transition-all duration-1000 delay-1000 ${isLoaded ? 'ios-fade-in' : 'opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 ios-title text-foreground">使い方</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {[
                { step: '1', title: 'エリア選択', description: 'お好みのエリアを選択', color: 'bg-ios-blue' },
                { step: '2', title: '接客スタイル', description: '雰囲気を選択', color: 'bg-ios-purple' },
                { step: '3', title: '予算設定', description: 'ご予算を選択', color: 'bg-ios-green' },
                { step: '4', title: 'キャスト発見', description: 'SNSで確認・来店', color: 'bg-ios-orange' }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <Card variant="outlined" padding="lg">
                    <div className={`${item.color} text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-6 shadow-ios`}>
                      {item.step}
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-foreground mb-3 ios-subtitle">{item.title}</h4>
                    <p className="ios-body text-xs sm:text-sm leading-relaxed">{item.description}</p>
                  </Card>
                  
                  {/* Connection arrow */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2 z-20">
                      <ArrowRight className="w-6 h-6 text-ios-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA Section */}
          <div className={`text-center px-4 transition-all duration-1000 delay-1200 ${isLoaded ? 'ios-slide-up' : 'opacity-0'}`}>
            <Card variant="glass" padding="xl" className="max-w-4xl mx-auto backdrop-blur-xl">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 ios-title text-foreground">
                今すぐ始めましょう
              </h2>
              <p className="ios-body mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
                簡単な質問に答えるだけで、あなたにぴったりのキャストが見つかります。
                <br />
                <span className="text-ios-green font-semibold">完全無料</span>で利用できます。
              </p>
              <Button 
                onClick={handleStartOnboarding}
                variant="success"
                size="xl"
                icon={<Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />}
                className="text-lg sm:text-xl font-semibold w-full sm:w-auto"
              >
                無料で始める
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* iOS-style Footer */}
      <footer className="relative z-10 bg-ios-gray-50 border-t border-ios-gray-200 py-8 sm:py-12 mt-16 sm:mt-20 lg:mt-24 w-full">
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <div className="ios-title font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-foreground">Arisa</div>
          <p className="ios-caption mb-4">
            © 2024 Arisa. All rights reserved.
          </p>
          <div className="flex justify-center space-x-3">
            <div className="w-2 h-2 bg-ios-blue rounded-full"></div>
            <div className="w-2 h-2 bg-ios-purple rounded-full"></div>
            <div className="w-2 h-2 bg-ios-green rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
