'use client'

import { useState } from 'react'
import type { Issue, Suggestion } from '@/types'
import { IssueBadge } from './IssueBadge'
import { DiffPreview } from './DiffPreview'
import { Button } from './Button'

interface IssuePanelProps {
  issues: Issue[]
  selectedIssueId?: string
  onIssueSelect?: (issueId: string) => void
  onApplySuggestion?: (issueId: string, suggestion: Suggestion) => void
}

export function IssuePanel({ 
  issues, 
  selectedIssueId, 
  onIssueSelect,
  onApplySuggestion 
}: IssuePanelProps) {
  const [filter, setFilter] = useState<'all' | 'llm' | 'rule'>('all')
  
  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true
    return issue.source === filter
  })

  const selectedIssue = issues.find(issue => issue.id === selectedIssueId)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-medium">Issues</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              filter === 'all' 
                ? 'bg-violet-100 text-violet-700' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All
          </button>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <button
            onClick={() => setFilter('llm')}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              filter === 'llm' 
                ? 'bg-violet-100 text-violet-700' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            LLM
          </button>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <button
            onClick={() => setFilter('rule')}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              filter === 'rule' 
                ? 'bg-violet-100 text-violet-700' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Rule
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {/* Issue List */}
        <ul className="space-y-2 mb-4">
          {filteredIssues.map((issue) => (
            <li 
              key={issue.id}
              className={`group cursor-pointer rounded-xl p-3 transition-colors ${
                selectedIssueId === issue.id 
                  ? 'bg-violet-50 ring-1 ring-violet-200' 
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => onIssueSelect?.(issue.id)}
            >
              <div className="mb-1 flex items-center gap-2">
                <IssueBadge 
                  severity={issue.severity}
                  source={issue.source}
                />
                <span className="text-xs text-slate-500">{issue.category}</span>
              </div>
              <p className="line-clamp-2 text-sm">{issue.message}</p>
              
              {/* Quick suggestions preview */}
              {issue.suggestions?.slice(0, 2).map((suggestion, index) => (
                <div key={index} className="mt-2">
                  <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm">
                    提案: {suggestion.text}
                  </span>
                </div>
              ))}
            </li>
          ))}
        </ul>

        {/* Selected Issue Detail */}
        {selectedIssue && (
          <div className="border-t border-slate-200 pt-3">
            <div className="text-xs text-slate-500 mb-1">理由</div>
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm mb-3">
              {selectedIssue.message}
            </p>
            
            {selectedIssue.suggestions && selectedIssue.suggestions.length > 0 && (
              <>
                <div className="text-xs text-slate-500 mb-1">修正候補</div>
                <div className="space-y-2">
                  {selectedIssue.suggestions.map((suggestion, index) => (
                    <div key={index} className="space-y-2">
                      <DiffPreview
                        original={selectedIssue.originalText || 'Original text'}
                        suggested={suggestion.text}
                        rationale={suggestion.rationale}
                      />
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full"
                        onClick={() => onApplySuggestion?.(selectedIssue.id, suggestion)}
                      >
                        この修正を適用
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}