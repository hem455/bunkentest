'use client'

interface AnalysisProgressProps {
  progress: number
  isAnalyzing: boolean
  elapsedMs?: number
}

export function AnalysisProgress({ progress, isAnalyzing, elapsedMs }: AnalysisProgressProps) {
  return (
    <div className="flex items-center gap-3">
      {isAnalyzing ? (
        <>
          <div className="flex items-center gap-2">
            <progress 
              value={Math.min(progress, 100)} 
              max={100}
              className="h-1.5 w-16 [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-violet-500 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-slate-200 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:rounded-full [&::-moz-progress-value]:bg-violet-500 [&::-moz-progress-value]:rounded-full"
              aria-label="解析の進行状況"
            />
            <span className="text-xs text-slate-500" aria-live="polite">
              解析中... ({Math.round(progress)}%)
            </span>
          </div>
          <div className="flex space-x-1" aria-hidden="true">
            <div className="w-1 h-1 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1 h-1 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1 h-1 bg-violet-500 rounded-full animate-bounce" />
          </div>
        </>
      ) : (
        elapsedMs && (
          <div className="text-xs text-slate-400">
            解析時間 {(elapsedMs / 1000).toFixed(2)}s
          </div>
        )
      )}
    </div>
  )
}