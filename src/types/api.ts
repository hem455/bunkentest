/**
 * API エンドポイントのリクエスト・レスポンス型定義
 * Next.js API Routes で使用
 */

import type { 
  AnalysisResult, 
  TextPassage, 
  WritingStyle,
  LLMSuggestion 
} from './index';
import type { Ruleset } from './rules';

// =============================================================================
// /api/lint エンドポイント
// =============================================================================

/** /api/lint リクエスト */
export interface LintRequest {
  /** 解析対象テキスト */
  text: string;
  /** ルールセットID（省略可、未指定時は既定を使用） */
  ruleset?: string;
  /** オプション */
  options?: {
    /** 最大返却Issue数 */
    maxIssues?: number;
  };
}

/** /api/lint レスポンス */
export interface LintResponse {
  /** 成功フラグ */
  success: true;
  /** 解析結果 */
  data: AnalysisResult;
}

// =============================================================================
// /api/suggest エンドポイント
// =============================================================================

/** /api/suggest リクエスト */
export interface SuggestRequest {
  /** 文章抜粋リスト（対象文±前後1文以内） */
  passages: TextPassage[];
  /** 文体ヒント */
  style?: WritingStyle;
}

/** /api/suggest レスポンス */
export interface SuggestResponse {
  /** 成功フラグ */
  success: true;
  /** LLM提案結果 */
  data: {
    /** LLM提案のリスト */
    issues: LLMSuggestion[];
    /** メタ情報 */
    meta: {
      /** LLM応答時間（ミリ秒） */
      elapsedMs: number;
      /** 処理した抜粋数 */
      passageCount: number;
    };
  };
}

// =============================================================================
// /api/rulesets エンドポイント
// =============================================================================

/** /api/rulesets レスポンス */
export interface RulesetsResponse {
  /** 成功フラグ */
  success: true;
  /** ルールセット一覧 */
  data: Array<{
    id: string;
    name: string;
    version: string;
    description?: string;
  }>;
}

/** /api/rulesets/[id] レスポンス */
export interface RulesetDetailResponse {
  /** 成功フラグ */
  success: true;
  /** ルールセット詳細 */
  data: Ruleset;
}

// =============================================================================
// 共通エラーレスポンス
// =============================================================================

/** APIエラーレスポンス */
export interface ErrorResponse {
  /** 失敗フラグ */
  success: false;
  /** エラー情報 */
  error: {
    /** エラーコード */
    code: string;
    /** エラーメッセージ */
    message: string;
    /** 詳細情報（開発用） */
    details?: any;
  };
}

// =============================================================================
// API レスポンス型のユニオン
// =============================================================================

/** 全APIレスポンス型 */
export type ApiResponse = 
  | LintResponse 
  | SuggestResponse 
  | RulesetsResponse 
  | RulesetDetailResponse 
  | ErrorResponse;

// =============================================================================
// HTTP ステータスコード定数
// =============================================================================

/** HTTP ステータスコード */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/** APIエラーコード */
export const API_ERROR_CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  TEXT_TOO_LONG: 'TEXT_TOO_LONG',
  RULESET_NOT_FOUND: 'RULESET_NOT_FOUND',
  LLM_TIMEOUT: 'LLM_TIMEOUT',
  LLM_ERROR: 'LLM_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];