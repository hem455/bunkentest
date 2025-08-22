/**
 * ルールエンジンに関する型定義
 * YAML設定ファイルベースの校正ルール管理
 */

// ============================================================================
// 共有リテラル型とユーティリティ型
// ============================================================================

/** ルールカテゴリの共用リテラル型 */
export type Category = 'style' | 'grammar' | 'honorific' | 'consistency' | 'risk';

/** 重大度の共用リテラル型 */
export type Severity = 'info' | 'warn' | 'error';

/** パターンの共用リテラル型（文字列または正規表現） */
export type Pattern = string | RegExp;

/** 日付表現の共用リテラル型 */
export type DateExpression = string;

/** 範囲表現の共用リテラル型 */
export type RangeExpression = string;

/** リテラルユニオンのヘルパー型 */
export type LiteralUnion<T> = T | (string & {});

/** 単一または複数の値を表す型 */
export type OneOrMany<T> = T | readonly T[];

/** 範囲をオプショナルにするユーティリティ型 */
export type OptionalRange<T> = T extends { range: infer R } 
  ? Omit<T, 'range'> & { readonly range?: R } 
  : T;

/** 書き方スタイルを表す型 */
export type WritingStyle = 'blog' | 'business' | 'academic';

// ============================================================================
// 共通型定義
// ============================================================================

/** テキスト範囲を表す型（start: 包含、end: 排他的） */
export interface Range {
  /** 開始位置（UTF-16コードユニット、包含） */
  readonly start: number;
  /** 終了位置（UTF-16コードユニット、排他的） */
  readonly end: number;
}

/** ルール設定を表す型 */
export interface Rule {
  /** ルール一意識別子 */
  readonly id: string;
  /** ルールカテゴリ */
  readonly category: Category;
  /** 重大度 */
  readonly severity: Severity;
  /** 検出パターン（文字列または正規表現） */
  readonly pattern: Pattern;
  /** 人間が理解できる説明 */
  readonly message: string;
  /** 修正提案（安全な置換用） */
  readonly suggestions?: readonly string[];
  /** ルールが有効かどうか */
  readonly enabled: boolean;
  /** 安全な自動置換が可能かどうか */
  readonly isSafeReplacement?: boolean;
}

/** ルールセット設定を表す型 */
export interface Ruleset {
  /** ルールセット識別子 */
  readonly id: string;
  /** バージョン */
  readonly version: string;
  /** 表示名 */
  readonly name: string;
  /** 説明 */
  readonly description?: string;
  /** ルールのリスト */
  readonly rules: readonly Rule[];
  /** 作成日時 */
  readonly createdAt?: string;
  /** 更新日時 */
  readonly updatedAt?: string;
}

/** ルール検出結果を表す型 */
export interface DetectionResult {
  /** ルールID */
  readonly ruleId: string;
  /** 検出位置 */
  readonly range: Range;
  /** 検出されたテキスト */
  readonly matchedText: string;
  /** 修正提案（オプショナル - 一部の検出では提供されない場合がある） */
  readonly suggestions?: readonly string[];
  /** メッセージ */
  readonly message: string;
  /** 重大度 */
  readonly severity: Severity;
  /** カテゴリ */
  readonly category: Category;
}

/** YAML設定ファイルの形式 */
export interface RulesetConfig {
  /** ルールセット基本情報 */
  readonly metadata: {
    readonly id: string;
    readonly name: string;
    readonly version: string;
    readonly description?: string;
  };
  /** ルール定義 */
  readonly rules: ReadonlyArray<{
    readonly id: string;
    readonly category: Category;
    readonly severity: Severity;
    readonly enabled: boolean;
    readonly pattern: string;
    readonly message: string;
    readonly suggestions?: readonly string[];
    readonly isSafeReplacement?: boolean;
  }>;
}

/** ルールエンジンの設定を表す型 */
export interface RuleEngineConfig {
  /** キャッシュ有効期間（秒） */
  readonly cacheTtl: number;
  /** 最大同時実行ルール数 */
  readonly maxConcurrentRules: number;
  /** タイムアウト（ミリ秒） */
  readonly timeoutMs: number;
}