'use client'

import type { Severity } from '@/types/rules'

interface IssueBadgeProps {
  severity: Severity
  source: 'rule' | 'llm'
  className?: string
}

export function IssueBadge({ severity, source, className }: IssueBadgeProps) {
  const getStyles = () => {
    if (source === 'llm') {
      return 'bg-violet-100 text-violet-700 ring-violet-200'
    }
    if (severity === 'error') {
      return 'bg-rose-100 text-rose-700 ring-rose-200'
    }
    if (severity === 'warn') {
      return 'bg-amber-100 text-amber-700 ring-amber-200'
    }
    return 'bg-slate-100 text-slate-700 ring-slate-200'
  }

  const getLabel = () => {
    if (source === 'llm') return 'LLM'
    return severity.toUpperCase()
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${getStyles()} ${className || ''}`}>
      {getLabel()}
    </span>
  )
}