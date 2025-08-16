import React, { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'

interface OnboardingStepProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  onNext?: () => void
  onBack?: () => void
  nextLabel?: string
  backLabel?: string
  canProceed?: boolean
  currentStep: number
  totalSteps: number
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = '次へ',
  backLabel = '戻る',
  canProceed = true,
  currentStep,
  totalSteps
}) => {
  const [isAnimated, setIsAnimated] = useState(false)
  const progressPercentage = (currentStep / totalSteps) * 100

  useEffect(() => {
    setIsAnimated(true)
  }, [currentStep])

  return (
    <div className="min-h-screen bg-dark-gradient relative overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0 particle-bg opacity-30" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-primary/30 to-dark-primary/70" />
      
      <div className="relative z-10 flex flex-col items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-3xl mx-auto">
          {/* Enhanced Progress Bar */}
          <div className={`mb-12 transition-all duration-1000 ${isAnimated ? 'animate-slide-in-down' : 'opacity-0'}`}>
            {/* Step indicators */}
            <div className="flex justify-between items-center mb-6">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                      index + 1 <= currentStep 
                        ? 'bg-gradient-to-r from-glow-primary to-glow-secondary text-white shadow-neon animate-pulse-glow' 
                        : index + 1 === currentStep + 1
                        ? 'bg-dark-card border-2 border-glow-primary text-glow-primary animate-bounce-glow'
                        : 'bg-dark-accent border border-gray-600 text-gray-400'
                    }`}
                  >
                    {index + 1 <= currentStep ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className={`text-xs mt-2 transition-colors duration-300 ${
                    index + 1 <= currentStep ? 'text-glow-primary' : 'text-gray-500'
                  }`}>
                    Step {index + 1}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress info */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-400 glow-text-cyan">
                ステップ {currentStep} / {totalSteps}
              </span>
              <span className="text-sm text-gray-400 glow-text-purple">
                {Math.round(progressPercentage)}% 完了
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="relative w-full bg-dark-accent rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-glow-primary via-neon-cyan to-glow-secondary rounded-full transition-all duration-1000 ease-out shadow-neon relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-shimmer-overlay bg-200% animate-shimmer opacity-60" />
              </div>
              
              {/* Glow effect */}
              <div 
                className="absolute top-0 h-full bg-gradient-to-r from-transparent to-glow-primary/50 rounded-full transition-all duration-1000 blur-sm"
                style={{ width: `${progressPercentage + 10}%` }}
              />
            </div>
          </div>

          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isAnimated ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <h1 className="text-5xl font-bold mb-6 holographic-text animate-holographic">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Content */}
          <div className={`mb-16 transition-all duration-1000 delay-500 ${isAnimated ? 'animate-fade-in' : 'opacity-0'}`}>
            {children}
          </div>

          {/* Navigation Buttons */}
          <div className={`flex justify-between items-center transition-all duration-1000 delay-700 ${isAnimated ? 'animate-slide-in-up' : 'opacity-0'}`}>
            {onBack ? (
              <Button
                variant="outline"
                onClick={onBack}
                icon={<ChevronLeft className="w-5 h-5" />}
                className="px-8 py-3"
                ripple
              >
                {backLabel}
              </Button>
            ) : (
              <div />
            )}

            {onNext && (
              <Button
                variant={canProceed ? "primary" : "secondary"}
                onClick={onNext}
                disabled={!canProceed}
                glow={canProceed}
                size="lg"
                icon={<ChevronRight className="w-5 h-5" />}
                className="px-12 py-4 group"
                ripple
              >
                <span className="mr-2">{nextLabel}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
          
          {/* Step completion celebration */}
          {canProceed && (
            <div className="fixed top-4 right-4 z-50">
              <div className="bg-gradient-to-r from-laser-green to-neon-cyan text-black px-4 py-2 rounded-full text-sm font-bold shadow-neon animate-bounce-glow">
                ✨ 準備完了！
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}