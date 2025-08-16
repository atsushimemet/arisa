import React from 'react'
import { Button } from '../ui/Button'

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
  return (
    <div className="min-h-screen bg-dark-gradient flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">ステップ {currentStep} / {totalSteps}</span>
            <span className="text-sm text-gray-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-dark-accent rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-glow-primary to-glow-secondary h-2 rounded-full transition-all duration-500 animate-pulse-glow"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 glow-text">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-300">
              {subtitle}
            </p>
          )}
        </div>

        {/* コンテンツ */}
        <div className="mb-12">
          {children}
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between items-center">
          {onBack ? (
            <Button
              variant="outline"
              onClick={onBack}
              className="mr-4"
            >
              {backLabel}
            </Button>
          ) : (
            <div />
          )}

          {onNext && (
            <Button
              variant="primary"
              onClick={onNext}
              disabled={!canProceed}
              glow={canProceed}
              size="lg"
            >
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}