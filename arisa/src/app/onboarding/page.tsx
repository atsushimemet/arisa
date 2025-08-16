'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingStep } from '@/components/onboarding/OnboardingStep'
import { SelectionGrid } from '@/components/onboarding/SelectionGrid'
import { Area, ServiceType, BudgetRange, AREA_LABELS, SERVICE_TYPE_LABELS, BUDGET_RANGE_LABELS, OnboardingData } from '@/types'

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({})

  const areaOptions = Object.entries(AREA_LABELS).map(([value, label]) => ({
    value,
    label,
    icon: getAreaIcon(value as Area)
  }))

  const serviceTypeOptions = Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
    icon: getServiceTypeIcon(value as ServiceType)
  }))

  const budgetOptions = Object.entries(BUDGET_RANGE_LABELS).map(([value, label]) => ({
    value,
    label,
    icon: getBudgetIcon(value as BudgetRange)
  }))

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else {
      // オンボーディング完了後、結果ページへ
      const params = new URLSearchParams()
      if (data.area) params.set('area', data.area)
      if (data.serviceType) params.set('serviceType', data.serviceType)
      if (data.budgetRange) params.set('budgetRange', data.budgetRange)
      
      router.push(`/results?${params.toString()}`)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true // ウェルカムステップ
      case 2: return !!data.area
      case 3: return !!data.serviceType
      case 4: return !!data.budgetRange
      default: return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep
            title="Arisa へようこそ"
            subtitle="あなたにぴったりのキャストを見つけましょう"
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onNext={handleNext}
            nextLabel="始める"
            canProceed={true}
          >
            <div className="text-center space-y-6">
              <div className="text-6xl mb-8">✨</div>
              <div className="space-y-4 text-gray-300">
                <p className="text-lg">
                  簡単な質問にお答えいただくだけで、
                </p>
                <p className="text-lg">
                  あなたの条件に合った信頼できるキャストを
                </p>
                <p className="text-lg">
                  ご紹介いたします。
                </p>
              </div>
            </div>
          </OnboardingStep>
        )

      case 2:
        return (
          <OnboardingStep
            title="エリアを選択してください"
            subtitle="どちらのエリアをお探しですか？"
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onNext={handleNext}
            onBack={handleBack}
            canProceed={canProceed()}
          >
            <SelectionGrid
              options={areaOptions}
              selectedValue={data.area}
              onSelect={(value) => setData({ ...data, area: value as Area })}
              columns={3}
            />
          </OnboardingStep>
        )

      case 3:
        return (
          <OnboardingStep
            title="接客スタイルを選択してください"
            subtitle="どのような雰囲気をお求めですか？"
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onNext={handleNext}
            onBack={handleBack}
            canProceed={canProceed()}
          >
            <SelectionGrid
              options={serviceTypeOptions}
              selectedValue={data.serviceType}
              onSelect={(value) => setData({ ...data, serviceType: value as ServiceType })}
              columns={2}
            />
          </OnboardingStep>
        )

      case 4:
        return (
          <OnboardingStep
            title="予算帯を選択してください"
            subtitle="ご予算の範囲を教えてください"
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onNext={handleNext}
            onBack={handleBack}
            nextLabel="キャストを探す"
            canProceed={canProceed()}
          >
            <SelectionGrid
              options={budgetOptions}
              selectedValue={data.budgetRange}
              onSelect={(value) => setData({ ...data, budgetRange: value as BudgetRange })}
              columns={2}
            />
          </OnboardingStep>
        )

      default:
        return null
    }
  }

  return renderStepContent()
}

function getAreaIcon(area: Area): string {
  const icons = {
    [Area.SHIBUYA]: '🌃',
    [Area.SHINJUKU]: '🏙️',
    [Area.GINZA]: '💎',
    [Area.ROPPONGI]: '🌆',
    [Area.IKEBUKURO]: '🎯',
    [Area.AKASAKA]: '🏛️',
    [Area.KABUKICHO]: '🎭',
    [Area.OTHER]: '📍'
  }
  return icons[area] || '📍'
}

function getServiceTypeIcon(serviceType: ServiceType): string {
  const icons = {
    [ServiceType.KYABA]: '🍸',
    [ServiceType.GIRLS_BAR]: '🍷',
    [ServiceType.SNACK]: '🥃',
    [ServiceType.LOUNGE]: '🥂',
    [ServiceType.CLUB]: '🍾',
    [ServiceType.OTHER]: '🍹'
  }
  return icons[serviceType] || '🍹'
}

function getBudgetIcon(budget: BudgetRange): string {
  const icons = {
    [BudgetRange.UNDER_10K]: '💰',
    [BudgetRange.FROM_10K_TO_20K]: '💳',
    [BudgetRange.FROM_20K_TO_30K]: '💎',
    [BudgetRange.FROM_30K_TO_50K]: '👑',
    [BudgetRange.OVER_50K]: '✨'
  }
  return icons[budget] || '💰'
}