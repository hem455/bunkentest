/**
 * 修正履歴管理フック
 */

import { useState, useCallback } from 'react'
import type { EditAction, EditHistory, HistoryResult } from '@/types/history'

const MAX_HISTORY = 50

export function useEditHistory(initialText: string = '') {
  const [text, setText] = useState(initialText)
  const [history, setHistory] = useState<EditHistory>({
    actions: [],
    currentIndex: -1,
    maxHistory: MAX_HISTORY
  })

  // 新しいアクションを追加
  const addAction = useCallback((action: Omit<EditAction, 'id' | 'timestamp'>) => {
    const newAction: EditAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random()}`,
      timestamp: Date.now()
    }

    setHistory(prev => {
      // 現在位置以降の履歴を削除（新しいアクションで分岐）
      const newActions = prev.actions.slice(0, prev.currentIndex + 1)
      newActions.push(newAction)
      
      // 最大履歴数を超えた場合は古いものを削除
      if (newActions.length > prev.maxHistory) {
        // 最初の要素を削除する際は、currentIndexを1減らす（ただし0未満にはしない）
        const shouldDecrementIndex = prev.currentIndex > 0
        newActions.shift()
        
        // currentIndexを調整：削除された場合は1減らし、範囲内に収める
        const newIndex = shouldDecrementIndex 
          ? Math.max(0, prev.currentIndex - 1)
          : prev.currentIndex
        
        // 最終的なインデックスが有効な範囲内にあることを確認
        const finalIndex = Math.min(newIndex, newActions.length - 1)
        
        return {
          ...prev,
          actions: newActions,
          currentIndex: finalIndex
        }
      }

      return {
        ...prev,
        actions: newActions,
        currentIndex: newActions.length - 1
      }
    })

    setText(action.afterText)
  }, [])

  // Undo実行
  const undo = useCallback((): HistoryResult | null => {
    if (history.currentIndex < 0) return null

    const currentAction = history.actions[history.currentIndex]
    const newText = currentAction.beforeText
    
    const newHistory = {
      ...history,
      currentIndex: history.currentIndex - 1
    }

    setText(newText)
    setHistory(newHistory)

    return {
      text: newText,
      history: newHistory,
      canUndo: newHistory.currentIndex >= 0,
      canRedo: newHistory.currentIndex < newHistory.actions.length - 1
    }
  }, [history])

  // Redo実行
  const redo = useCallback((): HistoryResult | null => {
    if (history.currentIndex >= history.actions.length - 1) return null

    const nextIndex = history.currentIndex + 1
    const nextAction = history.actions[nextIndex]
    const newText = nextAction.afterText

    const newHistory = {
      ...history,
      currentIndex: nextIndex
    }

    setText(newText)
    setHistory(newHistory)

    return {
      text: newText,
      history: newHistory,
      canUndo: newHistory.currentIndex >= 0,
      canRedo: newHistory.currentIndex < newHistory.actions.length - 1
    }
  }, [history])

  // 修正提案適用
  const applySuggestion = useCallback((
    issueId: string,
    suggestion: string,
    range: { start: number; end: number },
    reason?: string
  ) => {
    // rangeの検証
    if (typeof range.start !== 'number' || typeof range.end !== 'number' ||
        range.start < 0 || range.end > text.length || range.start > range.end) {
      const error = new Error(
        `Invalid range: start=${range.start}, end=${range.end}, textLength=${text.length}. ` +
        `Range must be numbers with 0 <= start <= end <= text.length`
      )
      console.error('applySuggestion: Invalid range detected:', error.message)
      throw error
    }
    
    const beforeText = text
    const afterText = text.slice(0, range.start) + suggestion + text.slice(range.end)

    addAction({
      type: 'apply_suggestion',
      beforeText,
      afterText,
      range,
      issueId,
      suggestion,
      reason
    })
  }, [text, addAction])

  // 手動編集
  const manualEdit = useCallback((newText: string) => {
    if (newText === text) return

    addAction({
      type: 'manual_edit',
      beforeText: text,
      afterText: newText,
      range: { start: 0, end: text.length }
    })
  }, [text, addAction])

  // 一括修正
  const fixAll = useCallback((newText: string, appliedIssues: string[]) => {
    addAction({
      type: 'fix_all',
      beforeText: text,
      afterText: newText,
      range: { start: 0, end: text.length },
      reason: `一括修正: ${appliedIssues.length}件の修正を適用`
    })
  }, [text, addAction])

  // 履歴リセット
  const resetHistory = useCallback((newText: string) => {
    setText(newText)
    setHistory({
      actions: [],
      currentIndex: -1,
      maxHistory: MAX_HISTORY
    })
  }, [])

  // 状態取得
  const canUndo = history.currentIndex >= 0
  const canRedo = history.currentIndex < history.actions.length - 1
  const lastAction = history.currentIndex >= 0 ? history.actions[history.currentIndex] : null

  return {
    text,
    history,
    canUndo,
    canRedo,
    lastAction,
    undo,
    redo,
    applySuggestion,
    manualEdit,
    fixAll,
    resetHistory
  }
}