'use client'

interface DocumentStatsProps {
  characterCount: number
  sentenceCount: number
  issueCount: number
  readabilityScore?: number
}

export function DocumentStats({ 
  characterCount, 
  sentenceCount, 
  issueCount, 
  readabilityScore 
}: DocumentStatsProps) {
  // 固定ロケールで数値フォーマッターを作成（SSR/CSRの差異を防ぐ）
  const formatter = new Intl.NumberFormat('ja-JP')
  
  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      <div className="text-center p-2 bg-slate-50 rounded-lg">
        <div className="text-lg font-bold text-slate-900">
          {formatter.format(characterCount)}
        </div>
        <div className="text-xs text-slate-500">文字数</div>
      </div>
      
      <div className="text-center p-2 bg-slate-50 rounded-lg">
        <div className="text-lg font-bold text-slate-900">{formatter.format(sentenceCount)}</div>
        <div className="text-xs text-slate-500">文数</div>
      </div>
      
      <div className="text-center p-2 bg-slate-50 rounded-lg">
        <div className="text-lg font-bold text-rose-600">{formatter.format(issueCount)}</div>
        <div className="text-xs text-slate-500">Issues</div>
      </div>
      
      <div className="text-center p-2 bg-slate-50 rounded-lg">
        <div className="text-lg font-bold text-emerald-600">
          {readabilityScore ? `${formatter.format(readabilityScore)}%` : '−'}
        </div>
        <div className="text-xs text-slate-500">読みやすさ</div>
      </div>
    </div>
  )
}