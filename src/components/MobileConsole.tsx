'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X, Copy, ChevronDown, ChevronUp, Bug, AlertTriangle, Info, Trash2 } from 'lucide-react'

export interface LogEntry {
  id: string
  timestamp: Date
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  stack?: string
  data?: any
}

interface MobileConsoleProps {
  isOpen: boolean
  onToggle: () => void
}

// グローバルログコレクター
class LogCollector {
  private static instance: LogCollector
  private logs: LogEntry[] = []
  private listeners: ((logs: LogEntry[]) => void)[] = []
  private maxLogs = 100

  private constructor() {
    // コンソールメソッドをインターセプト
    this.interceptConsole()
    // グローバルエラーハンドラー
    this.setupGlobalErrorHandlers()
  }

  static getInstance() {
    if (!LogCollector.instance) {
      LogCollector.instance = new LogCollector()
    }
    return LogCollector.instance
  }

  private interceptConsole() {
    const originalError = console.error
    const originalWarn = console.warn
    const originalLog = console.log
    const originalInfo = console.info

    console.error = (...args) => {
      this.addLog('error', args.join(' '))
      originalError.apply(console, args)
    }

    console.warn = (...args) => {
      this.addLog('warn', args.join(' '))
      originalWarn.apply(console, args)
    }

    console.info = (...args) => {
      this.addLog('info', args.join(' '))
      originalInfo.apply(console, args)
    }

    console.log = (...args) => {
      this.addLog('debug', args.join(' '))
      originalLog.apply(console, args)
    }
  }

  private setupGlobalErrorHandlers() {
    // 未処理のエラー
    window.addEventListener('error', (event) => {
      this.addLog('error', `${event.message}\n at ${event.filename}:${event.lineno}:${event.colno}`, event.error?.stack)
    })

    // 未処理のPromise拒否
    window.addEventListener('unhandledrejection', (event) => {
      this.addLog('error', `Unhandled Promise Rejection: ${event.reason}`)
    })
  }

  addLog(level: LogEntry['level'], message: string, stack?: string, data?: any) {
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      stack,
      data
    }

    this.logs.unshift(newLog)
    
    // 最大ログ数を超えた場合は古いものを削除
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // リスナーに通知
    this.listeners.forEach(listener => listener([...this.logs]))
  }

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener)
    // 現在のログを即座に通知
    listener([...this.logs])
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  clear() {
    this.logs = []
    this.listeners.forEach(listener => listener([]))
  }

  getLogs() {
    return [...this.logs]
  }
}

// カスタムログ関数をエクスポート
export const mobileLog = {
  error: (message: string, data?: any) => LogCollector.getInstance().addLog('error', message, undefined, data),
  warn: (message: string, data?: any) => LogCollector.getInstance().addLog('warn', message, undefined, data),
  info: (message: string, data?: any) => LogCollector.getInstance().addLog('info', message, undefined, data),
  debug: (message: string, data?: any) => LogCollector.getInstance().addLog('debug', message, undefined, data),
}

export function MobileConsole({ isOpen, onToggle }: MobileConsoleProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [filter, setFilter] = useState<LogEntry['level'] | 'all'>('all')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const logCollector = LogCollector.getInstance()
    const unsubscribe = logCollector.subscribe(setLogs)
    return unsubscribe
  }, [])

  const filteredLogs = logs.filter(log => filter === 'all' || log.level === filter)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // 一時的な成功表示（簡易版）
      alert('コピーしました')
    } catch (err) {
      // フォールバック: テキストエリアを使用
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('コピーしました')
    }
  }, [])

  const copyAllLogs = useCallback(() => {
    const allLogsText = filteredLogs.map(log => 
      `[${log.timestamp.toLocaleTimeString()}] ${log.level.toUpperCase()}: ${log.message}${log.stack ? '\n' + log.stack : ''}`
    ).join('\n\n')
    copyToClipboard(allLogsText)
  }, [filteredLogs, copyToClipboard])

  const clearLogs = useCallback(() => {
    LogCollector.getInstance().clear()
  }, [])

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'info': return <Info className="w-4 h-4 text-blue-400" />
      case 'debug': return <Bug className="w-4 h-4 text-gray-400" />
    }
  }

  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-400'
      case 'warn': return 'text-yellow-400'
      case 'info': return 'text-blue-400'
      case 'debug': return 'text-gray-400'
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
      <div className={`w-full bg-gray-900 border-t border-gray-700 transition-all duration-300 ${
        isExpanded ? 'h-3/4' : 'h-20'
      }`}>
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">モバイルコンソール</span>
            <span className="text-gray-400 text-sm">({filteredLogs.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 展開時のコンテンツ */}
        {isExpanded && (
          <>
            {/* フィルターとアクション */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <div className="flex gap-2">
                {(['all', 'error', 'warn', 'info', 'debug'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setFilter(level)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      filter === level 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {level === 'all' ? 'すべて' : level.toUpperCase()}
                    {level !== 'all' && (
                      <span className="ml-1 text-xs">
                        ({logs.filter(log => log.level === level).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyAllLogs}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  コピー
                </button>
                <button
                  onClick={clearLogs}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  クリア
                </button>
              </div>
            </div>

            {/* ログリスト */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-3 space-y-2"
              style={{ maxHeight: 'calc(75vh - 120px)' }}
            >
              {filteredLogs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Bug className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>ログがありません</p>
                </div>
              ) : (
                filteredLogs.map(log => (
                  <div
                    key={log.id}
                    className="bg-gray-800 rounded p-3 border border-gray-700 hover:border-gray-600 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        {getLogIcon(log.level)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${getLogColor(log.level)}`}>
                              {log.level.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-white text-sm break-words">
                            {log.message}
                          </div>
                          {log.stack && (
                            <div className="text-gray-400 text-xs mt-2 font-mono bg-gray-900 p-2 rounded overflow-x-auto">
                              {log.stack}
                            </div>
                          )}
                          {log.data && (
                            <div className="text-gray-400 text-xs mt-2 font-mono bg-gray-900 p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const logText = `[${log.timestamp.toLocaleTimeString()}] ${log.level.toUpperCase()}: ${log.message}${log.stack ? '\n' + log.stack : ''}`
                          copyToClipboard(logText)
                        }}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-all"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* 非展開時の簡易表示 */}
        {!isExpanded && (
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-gray-300 text-sm">
                最新: {filteredLogs.length > 0 ? filteredLogs[0].message.slice(0, 50) + '...' : 'ログなし'}
              </div>
              <div className="flex gap-1">
                {logs.slice(0, 3).map(log => (
                  <div key={log.id} className="w-2 h-2 rounded-full bg-opacity-60" style={{
                    backgroundColor: log.level === 'error' ? '#ef4444' : 
                                   log.level === 'warn' ? '#f59e0b' : 
                                   log.level === 'info' ? '#3b82f6' : '#6b7280'
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// デバッグ用のトグルボタンコンポーネント
export function MobileConsoleToggle({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const [logCount, setLogCount] = useState(0)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const logCollector = LogCollector.getInstance()
    const unsubscribe = logCollector.subscribe((logs) => {
      setLogCount(logs.length)
      setHasError(logs.some(log => log.level === 'error'))
    })
    return unsubscribe
  }, [])

  return (
    <button
      onClick={onToggle}
      className={`fixed top-4 right-4 z-40 p-3 rounded-full shadow-lg transition-all duration-200 ${
        hasError 
          ? 'bg-red-600 hover:bg-red-700 text-white' 
          : isOpen 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      }`}
    >
      <div className="relative">
        <Bug className="w-5 h-5" />
        {logCount > 0 && (
          <div className={`absolute -top-2 -right-2 min-w-[1.25rem] h-5 rounded-full text-xs flex items-center justify-center font-bold ${
            hasError ? 'bg-red-900 text-red-100' : 'bg-blue-600 text-white'
          }`}>
            {logCount > 99 ? '99+' : logCount}
          </div>
        )}
      </div>
    </button>
  )
}