'use client'

import { useMemo } from 'react'
import type { Issue } from '@/types'

interface TextHighlightProps {
  text: string
  issues: Issue[]
  selectedIssueId?: string
  onIssueClick?: (issueId: string) => void
}

interface HighlightSegment {
  text: string
  issue?: Issue
  isSelected?: boolean
}

export function TextHighlight({ 
  text, 
  issues, 
  selectedIssueId, 
  onIssueClick 
}: TextHighlightProps) {
  const segments = useMemo(() => {
    if (!issues.length) {
      return [{ text }]
    }

    // Sort issues by start position
    const sortedIssues = [...issues].sort((a, b) => a.range.start - b.range.start)
    
    const segments: HighlightSegment[] = []
    let currentPos = 0

    for (const issue of sortedIssues) {
      // Skip if this issue is completely contained within the previous one
      if (currentPos > issue.range.start) {
        continue
      }

      // Add text before the issue
      if (currentPos < issue.range.start) {
        segments.push({ text: text.slice(currentPos, issue.range.start) })
      }

      // Add the highlighted issue text
      segments.push({
        text: text.slice(Math.max(currentPos, issue.range.start), issue.range.end),
        issue,
        isSelected: issue.id === selectedIssueId
      })

      currentPos = Math.max(currentPos, issue.range.end)
    }

    // Add remaining text
    if (currentPos < text.length) {
      segments.push({ text: text.slice(currentPos) })
    }

    return segments
  }, [text, issues, selectedIssueId])

  const getHighlightClass = (issue: Issue, isSelected: boolean) => {
    const baseClass = 'rounded px-0.5 cursor-pointer transition-colors'
    
    if (isSelected) {
      return `${baseClass} ring-2 ring-violet-400 bg-violet-200`
    }

    switch (issue.severity) {
      case 'error':
        return `${baseClass} bg-rose-100 hover:bg-rose-200`
      case 'warn':
        return `${baseClass} bg-amber-100 hover:bg-amber-200`
      default:
        if (issue.source === 'llm') {
          return `${baseClass} bg-violet-100 hover:bg-violet-200`
        }
        return `${baseClass} bg-sky-100 hover:bg-sky-200`
    }
  }

  return (
    <div className="font-mono text-sm leading-6 text-slate-900 whitespace-pre-wrap">
      {segments.map((segment, index) => {
        if (segment.issue) {
          return (
            <mark
              key={index}
              className={getHighlightClass(segment.issue, segment.isSelected || false)}
              onClick={() => onIssueClick?.(segment.issue!.id)}
              title={segment.issue.message}
            >
              {segment.text}
            </mark>
          )
        }
        return <span key={index}>{segment.text}</span>
      })}
    </div>
  )
}