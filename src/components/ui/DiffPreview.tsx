'use client'

interface DiffPreviewProps {
  original: string
  suggested: string
  rationale?: string
}

export function DiffPreview({ original, suggested, rationale }: DiffPreviewProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-red-50 border border-red-200 p-2 rounded line-through text-red-700">
          {original}
        </div>
        <div className="bg-green-50 border border-green-200 p-2 rounded font-medium text-green-700">
          {suggested}
        </div>
      </div>
      {rationale && (
        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border">
          💡 {rationale}
        </p>
      )}
    </div>
  )
}