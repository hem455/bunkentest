'use client'

import { useState, useCallback, useMemo } from 'react'
import type { Issue } from '@/types'
import { TextHighlight } from './TextHighlight'
import { AnalysisProgress } from './AnalysisProgress'
import { DocumentStats } from './DocumentStats'

interface TextEditorProps {
  text: string
  onTextChange?: (text: string) => void
  issues?: Issue[]
  selectedIssueId?: string
  onIssueClick?: (issueId: string) => void
  isAnalyzing?: boolean
  analysisProgress?: number
  elapsedMs?: number
}

export function TextEditor({
  text,
  onTextChange,
  issues = [],
  selectedIssueId,
  onIssueClick,
  isAnalyzing = false,
  analysisProgress = 0,
  elapsedMs
}: TextEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  
  const characterCount = text.length
  const sentenceCount = text.split(/[。！？]/).filter(s => s.trim()).length
  const issueCount = issues.length
  
  // Simple readability score calculation (placeholder)
  const readabilityScore = useMemo(() => {
    if (!text) return undefined
    const avgSentenceLength = characterCount / Math.max(sentenceCount, 1)
    const score = Math.max(0, Math.min(100, 100 - (avgSentenceLength - 20) * 2))
    return Math.round(score)
  }, [characterCount, sentenceCount])

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange?.(e.target.value)
  }, [onTextChange])

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg shadow-slate-200/40">
      {/* Header with stats and progress */}
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">本文</span>
            <span className="text-xs text-slate-400">
              {characterCount.toLocaleString()} 文字 / {sentenceCount} 文
            </span>
          </div>
          <AnalysisProgress 
            progress={analysisProgress}
            isAnalyzing={isAnalyzing}
            elapsedMs={elapsedMs}
          />
        </div>
        
        <DocumentStats
          characterCount={characterCount}
          sentenceCount={sentenceCount}
          issueCount={issueCount}
          readabilityScore={readabilityScore}
        />
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 overflow-auto">
        {isEditing || !text ? (
          // Edit mode - textarea
          <textarea
            value={text}
            onChange={handleTextareaChange}
            onBlur={() => setIsEditing(false)}
            className="h-full w-full resize-none border-none bg-transparent p-4 font-mono text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
            placeholder="ここに文章を貼り付けてください"
            autoFocus
          />
        ) : (
          // Display mode - highlighted text
          <div 
            className="h-full w-full p-4 cursor-text"
            onClick={() => setIsEditing(true)}
          >
            <TextHighlight
              text={text}
              issues={issues}
              selectedIssueId={selectedIssueId}
              onIssueClick={onIssueClick}
            />
          </div>
        )}
        
      </div>
    </div>
  )
}