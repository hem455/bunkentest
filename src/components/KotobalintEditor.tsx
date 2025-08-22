'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { Issue, Suggestion } from '@/types'
import { useEditHistory } from '@/lib/hooks/useEditHistory'
import { TextEditor } from './ui/TextEditor'
import { IssuePanel } from './ui/IssuePanel'
import { Button } from './ui/Button'

export function KotobalintEditor() {
  // デモ用のサンプルテキスト（本番環境では削除または実際のコンテンツに置き換え）
  const demoText = "本アプリケーションは、日本語の文章における誤字脱字、表記揺れ、不適切な表現などを自動で検出することができるシステムです。主語が曖昧で、読み手が混乱する可能性がある文章も改善提案を行います。"
  
  // Edit history management
  const {
    text,
    canUndo,
    canRedo,
    lastAction,
    undo,
    redo,
    applySuggestion: applyHistorySuggestion,
    manualEdit,
    fixAll: fixAllHistory
  } = useEditHistory(demoText)

  const [issues, setIssues] = useState<Issue[]>([])
  const [selectedIssueId, setSelectedIssueId] = useState<string>()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [elapsedMs, setElapsedMs] = useState<number>()

  // タイマー管理用のref
  const timeoutRef = useRef<number | ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<number | ReturnType<typeof setInterval> | null>(null)

  // Mock issues for demonstration

  const mockIssues: Issue[] = [
    {
      id: 'sentence.length',
      source: 'rule',
      severity: 'warn',
      message: '一文が長すぎます（64字）。',
      range: { start: 0, end: 64 },
      suggestions: [
        { text: '文を二つに分ける案。', rationale: '読みやすさの向上', isSafeReplacement: true }
      ],
      category: 'style',
      ruleId: 'sentence-length-check',
      originalText: '本アプリケーションは、日本語の文章における誤字脱字、表記揺れ、不適切な表現などを自動で検出'
    },
    {
      id: 'style.suru_koto_ga_dekiru',
      source: 'rule',
      severity: 'info', 
      message: '「〜することができる」を「〜できる」に簡潔化できます。',
      range: { start: 64, end: 74 },
      suggestions: [
        { text: 'できる', rationale: '簡潔な表現に変更', isSafeReplacement: true }
      ],
      category: 'style',
      ruleId: 'verbose-expression-simplify',
      originalText: 'することができる'
    },
    {
      id: 'llm.suggestion.001',
      source: 'llm',
      severity: 'info',
      message: '主語が不明確です。補うと読みやすくなります。',
      range: { start: 82, end: 102 },
      suggestions: [
        { 
          text: 'この文章では主語が曖昧で', 
          rationale: '主語を補い明確化',
          isSafeReplacement: false
        },
        { 
          text: '書き手の意図として主語が曖昧で', 
          rationale: '文脈を明示',
          isSafeReplacement: false
        }
      ],
      category: 'style',
      originalText: '主語が曖昧で、読み手が混乱する'
    }
  ]

  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) return
    
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setIssues([])
  }, [text])

  // 分析進捗の管理
  useEffect(() => {
    if (!isAnalyzing) return

    // 進捗更新のインターバル
    intervalRef.current = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return 100
        }
        return prev + 10
      })
    }, 200)

    // API呼び出しのシミュレーション
    timeoutRef.current = setTimeout(() => {
      setIsAnalyzing(false)
      setIssues(mockIssues)
      setElapsedMs(1680) // Mock elapsed time
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setAnalysisProgress(100)
    }, 2000)

    // クリーンアップ関数
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isAnalyzing])

  const handleApplySuggestion = useCallback((issueId: string, suggestion: Suggestion) => {
    const issue = issues.find(i => i.id === issueId)
    if (!issue) return

    // Apply suggestion with history tracking
    applyHistorySuggestion(
      issueId,
      suggestion.text,
      issue.range,
      suggestion.rationale
    )
    
    // Remove the applied issue
    setIssues(prev => prev.filter(i => i.id !== issueId))
    setSelectedIssueId(undefined)
  }, [issues, applyHistorySuggestion])

  const handleFixAll = useCallback(() => {
    const safeIssues = issues.filter(issue => 
      issue.source === 'rule' && 
      issue.suggestions && 
      issue.suggestions.length > 0
    )
    
    let newText = text
    let offset = 0
    
    // インデックスを降順でソートして安全に処理
    const sortedIssues = [...safeIssues].sort((a, b) => b.range.start - a.range.start)
    
    sortedIssues.forEach(issue => {
      const suggestion = issue.suggestions![0]
      const startIdx = issue.range.start + offset
      const endIdx = issue.range.end + offset
      
      newText = newText.slice(0, startIdx) + 
                suggestion.text + 
                newText.slice(endIdx)
      
      offset += suggestion.text.length - (issue.range.end - issue.range.start)
    })
    
    // Use history-aware fix all
    fixAllHistory(newText, safeIssues.map(issue => issue.id))
    setIssues(prev => prev.filter(issue => !safeIssues.includes(issue)))
    setSelectedIssueId(undefined)
  }, [text, issues, fixAllHistory])

  const safeFixCount = issues.filter(issue => 
    issue.source === 'rule' && 
    issue.suggestions && 
    issue.suggestions.length > 0
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-tight text-slate-900">Kotobalint</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Undo/Redo buttons */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="text-xs"
            >
              ↶ Undo
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              className="text-xs"
            >
              ↷ Redo
            </Button>
            
            {safeFixCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleFixAll}
              >
                Fix All（安全・{safeFixCount}件）
              </Button>
            )}
            <Button 
              variant="primary"
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
            >
              校正する
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto grid max-w-7xl grid-cols-12 gap-4 px-4 py-4 md:py-6">
        {/* Text Editor */}
        <section className="col-span-12 md:col-span-8 lg:col-span-8">
          <TextEditor
            text={text}
            onTextChange={manualEdit}
            issues={issues}
            selectedIssueId={selectedIssueId}
            onIssueClick={setSelectedIssueId}
            isAnalyzing={isAnalyzing}
            analysisProgress={analysisProgress}
            elapsedMs={elapsedMs}
          />
        </section>

        {/* Issue Panel */}
        <section className="col-span-12 md:col-span-4 lg:col-span-4">
          <div className="h-[68vh] rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg shadow-slate-200/40">
            <IssuePanel
              issues={issues}
              selectedIssueId={selectedIssueId}
              onIssueSelect={setSelectedIssueId}
              onApplySuggestion={handleApplySuggestion}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-xs text-slate-500">
          <div>© 2025 Kotobalint – 日本語校正アプリ</div>
          <div className="flex items-center gap-4">
            <span>字数: {text.length.toLocaleString()}</span>
            <span>Issues: {issues.length}</span>
            <span>ルール: ruleset@1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}