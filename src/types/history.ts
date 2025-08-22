/**
 * 修正履歴管理の型定義
 */

/** 修正アクション */
export interface EditAction {
  /** アクション一意ID */
  id: string
  /** アクションタイプ */
  type: 'apply_suggestion' | 'manual_edit' | 'fix_all'
  /** 修正前のテキスト */
  beforeText: string
  /** 修正後のテキスト */
  afterText: string
  /** 修正範囲 */
  range: {
    start: number
    end: number
  }
  /** 適用されたIssue ID（該当する場合） */
  issueId?: string
  /** 修正提案内容（該当する場合） */
  suggestion?: string
  /** タイムスタンプ */
  timestamp: number
  /** 修正理由 */
  reason?: string
}

/** 修正履歴 */
export interface EditHistory {
  /** アクション履歴 */
  actions: EditAction[]
  /** 現在位置（Undo/Redo用） */
  currentIndex: number
  /** 最大履歴保持数 */
  maxHistory: number
}

/** 履歴操作の結果 */
export interface HistoryResult {
  /** 操作後のテキスト */
  text: string
  /** 操作後の履歴状態 */
  history: EditHistory
  /** Undo可能かどうか */
  canUndo: boolean
  /** Redo可能かどうか */
  canRedo: boolean
}