/**
 * Bunken アプリケーションの基本型定義
 * 日本語文章校正に関する主要なデータ構造を定義
 */

import { Range, Category, Severity, WritingStyle } from './rules';

/** 最大3つの要素を持つ配列型 */
export type UpTo3<T> = readonly [T] | readonly [T, T] | readonly [T, T, T];

/** テキスト範囲を表す型（Range型のエイリアス） */
export type TextRange = Range;

/** 修正提案を表す型 */
export interface Suggestion {
  /** 修正後のテキスト */
  text: string;
  /** 修正理由（80文字以内） */
  rationale?: string;
  /** 安全な自動置換が可能かどうか */
  isSafeReplacement: boolean;
}

/** LLM由来の問題を表す型 */
export interface LLMIssue {
  /** 一意識別子 */
  id: string;
  /** 問題の検出元（LLM） */
  source: 'llm';
  /** 重大度（LLMは情報レベルのみ） */
  severity: 'info';
  /** 問題カテゴリ */
  category: Category;
  /** 人間が理解できる説明 */
  message: string;
  /** 問題の箇所 */
  range: TextRange;
  /** 修正提案リスト（最大3案） */
  suggestions: UpTo3<Suggestion>;
  /** 元のテキスト（該当箇所の原文） */
  originalText?: string;
}

/** ルールベースの問題を表す型 */
export interface RuleIssue {
  /** 一意識別子 */
  id: string;
  /** 問題の検出元（ルール） */
  source: 'rule';
  /** 重大度 */
  severity: 'info' | 'warn' | 'error';
  /** 問題カテゴリ */
  category: Category;
  /** 人間が理解できる説明 */
  message: string;
  /** 問題の箇所 */
  range: TextRange;
  /** 修正提案リスト */
  suggestions: ReadonlyArray<Suggestion>;
  /** ルールID（必須） */
  ruleId: string;
  /** 元のテキスト（該当箇所の原文） */
  originalText?: string;
}

/** 検出された問題を表す型 */
export type Issue = LLMIssue | RuleIssue;

/** テキスト解析結果を表す型 */
export interface AnalysisResult {
  /** 検出された問題のリスト */
  issues: ReadonlyArray<Issue>;
  /** 解析メタ情報 */
  meta: {
    /** 解析にかかった時間（ミリ秒） */
    elapsedMs: number;
    /** 解析対象テキストの長さ */
    textLength: number;
    /** 使用したルールセットのバージョン */
    rulesetVersion: string;
  };
}

/** LLM提案のための文章抜粋を表す型 */
export interface TextPassage {
  /** 抜粋テキスト（対象文±前後1文） */
  text: string;
  /** 元テキスト内での位置 */
  range: TextRange;
}

/** LLM提案を表す型（Issue型のエイリアス） */
export type LLMSuggestion = Extract<Issue, { source: 'llm' }>;

/** 解析オプションを表す型 */
export interface AnalysisOptions {
  /** ルールセットID */
  rulesetId?: string;
  /** LLM提案を有効にするか */
  enableLLMSuggestions?: boolean;
  /** 書き方スタイル */
  writingStyle?: WritingStyle;
  /** 最大Issue数 */
  maxIssues?: number;
}