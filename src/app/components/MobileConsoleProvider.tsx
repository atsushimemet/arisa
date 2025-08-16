'use client'

import React, { useState, useEffect } from 'react'
import { MobileConsole, MobileConsoleToggle } from '../../components/MobileConsole'

export function MobileConsoleProvider({ children }: { children: React.ReactNode }) {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // モバイルデバイスかどうかを判定
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet']
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
             window.innerWidth <= 768
    }

    setIsMobile(checkMobile())

    // リサイズイベントでモバイル判定を更新
    const handleResize = () => {
      setIsMobile(checkMobile())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleConsole = () => {
    setIsConsoleOpen(prev => !prev)
  }

  return (
    <>
      {children}
      {isMobile && (
        <>
          <MobileConsoleToggle 
            isOpen={isConsoleOpen} 
            onToggle={toggleConsole} 
          />
          <MobileConsole 
            isOpen={isConsoleOpen} 
            onToggle={toggleConsole} 
          />
        </>
      )}
    </>
  )
}