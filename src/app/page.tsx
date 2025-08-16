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
      variant: 'cyber' as const,
      borderGlow: 'cyan' as const
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: '信頼できるキャスト',
      description: 'SNS更新を継続している努力型キャストのみを厳選',
      variant: 'neon' as const,
      borderGlow: 'purple' as const
    },
    {
      icon: <Link className="w-8 h-8" />,
      title: '直接SNSへ',
      description: '広告に埋もれず、キャストのSNSに直接アクセス',
      variant: 'gaming' as const,
      borderGlow: 'green' as const
    }
  ]

  const stats = [
    { number: '1000+', label: 'アクティブキャスト', icon: <Users className="w-6 h-6" /> },
    { number: '98%', label: '満足度', icon: <Star className="w-6 h-6" /> },
    { number: '24/7', label: 'サポート', icon: <Shield className="w-6 h-6" /> }
  ]

  return (
    <div className="min-h-screen bg-dark-gradient relative overflow-hidden">
      {/* Particle background effect */}
      <div className="absolute inset-0 particle-bg opacity-40" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-primary/50 to-dark-primary" />
      
      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <div className={`text-center mb-20 transition-all duration-1000 ${isLoaded ? 'animate-slide-in-down' : 'opacity-0'}`}>
            {/* Main title with holographic effect */}
            <div className="mb-8">
              <h1 className="text-8xl font-bold mb-6 holographic-text animate-holographic">
                Arisa
              </h1>
              <div className="text-3xl text-gray-300 mb-8 animate-fade-in delay-300">
                あなたにぴったりの
                <span className="glow-text-cyan ml-2">キャスト</span>
                を見つけよう
                <Sparkles className="inline-block w-8 h-8 ml-2 text-game-gold animate-bounce-glow" />
              </div>
            </div>
            
            {/* Enhanced description */}
            <div className={`max-w-3xl mx-auto mb-16 transition-all duration-1000 delay-200 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}>
              <Card variant="glass" className="p-8 backdrop-blur-xl">
                <p className="text-lg text-gray-300 leading-relaxed">
                  エリア・接客スタイル・予算に応じた「顔出し投稿キャスト」への導線をシンプルに提示。
                  <br />
                  <span className="glow-text-green">SNS更新を継続するキャスト</span>が報われる仕組みで、
                  <span className="glow-text-purple">努力型キャストの集客</span>を支援します。
                </p>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 transition-all duration-1000 delay-400 ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`}>
              <Button 
                onClick={handleStartOnboarding}
                variant="primary"
                size="xl"
                glow
                ripple
                icon={<Zap className="w-6 h-6" />}
                className="text-xl px-16 py-6 group"
              >
                キャストを探す
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => router.push('/admin')}
                variant="cyber"
                size="lg"
                icon={<Shield className="w-5 h-5" />}
                className="text-lg px-10 py-4"
              >
                管理者ページ
              </Button>
            </div>

            {/* Stats section */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 delay-600 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}>
              {stats.map((stat, index) => (
                <Card key={index} variant="glass" className="text-center p-6" glow borderGlow="cyan">
                  <div className="flex items-center justify-center mb-2 text-neon-cyan">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1 glow-text-cyan">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 delay-800 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}>
            {features.map((feature, index) => (
              <Card 
                key={index} 
                variant={feature.variant}
                className="text-center p-8 hover:scale-105 transform transition-all duration-300"
                glow
                borderGlow={feature.borderGlow}
                animated
              >
                <div className="text-5xl mb-6 flex justify-center text-glow-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 glow-text">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Process Steps Section */}
          <div className={`text-center mb-20 transition-all duration-1000 delay-1000 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold mb-16 glow-text-purple">使い方</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'エリア選択', description: 'お好みのエリアを選択', color: 'from-glow-primary to-glow-secondary' },
                { step: '2', title: '接客スタイル', description: '雰囲気を選択', color: 'from-neon-cyan to-neon-purple' },
                { step: '3', title: '予算設定', description: 'ご予算を選択', color: 'from-laser-green to-neon-orange' },
                { step: '4', title: 'キャスト発見', description: 'SNSで確認・来店', color: 'from-game-gold to-neon-pink' }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <Card variant="gaming" className="p-6" glow borderGlow="green">
                    <div className={`bg-gradient-to-r ${item.color} text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-neon animate-bounce-glow`}>
                      {item.step}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-3 glow-text-green">{item.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                  </Card>
                  
                  {/* Connection arrow */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <ArrowRight className="w-8 h-8 text-glow-primary animate-pulse opacity-70" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA Section */}
          <div className={`text-center transition-all duration-1000 delay-1200 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <Card variant="cyber" className="p-12 max-w-4xl mx-auto" glow borderGlow="cyan">
              <h2 className="text-4xl font-bold mb-6 glow-text-cyan">
                今すぐ始めましょう
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                簡単な質問に答えるだけで、あなたにぴったりのキャストが見つかります。
                <br />
                <span className="glow-text-green">完全無料</span>で利用できます。
              </p>
              <Button 
                onClick={handleStartOnboarding}
                variant="neon"
                size="xl"
                glow
                ripple
                icon={<Sparkles className="w-6 h-6" />}
                className="text-xl px-16 py-6"
              >
                無料で始める
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative z-10 bg-dark-primary/90 border-t border-gray-800 py-12 mt-20 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <div className="glow-text-purple font-bold text-3xl mb-6 holographic-text">Arisa</div>
          <p className="text-gray-400 text-sm mb-4">
            © 2024 Arisa. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-laser-green rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
