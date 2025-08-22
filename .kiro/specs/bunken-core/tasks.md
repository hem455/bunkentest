# 実装計画

## プロジェクト基盤・設定

- [ ] 1. Next.js プロジェクト初期設定・依存関係インストール
  - `npm install` で package.json の依存関係をインストール
  - Tailwind CSS と PostCSS 設定を src/app/globals.css に実装
  - .env.example を参考に開発用環境変数を設定
  - Next.js の動作確認（`npm run dev` でポート3000起動）
  - _Requirements: 全要件の基盤セットアップが必要_

- [ ] 2. TypeScript型定義とデータモデル実装
  - src/types/index.ts に AnalysisResult, Issue, Suggestion, TextRange インターフェースを実装
  - src/types/rules.ts に Ruleset, Rule インターフェースを実装
  - src/types/api.ts に API リクエスト・レスポンス型を実装
  - 各型定義にコメントと型バリデーション用のパターンを追加
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [ ] 3. 基本UIコンポーネント実装
  - src/components/ui/Button.tsx に Tailwind CSS スタイルとアクセシビリティ対応を実装
  - src/components/ui/Card.tsx に Dialin AI 風のカードレイアウトを実装
  - src/components/ui/Modal.tsx にキーボード操作対応モーダルを実装
  - src/components/ui/Badge.tsx に重大度表示（info/warn/error）バッジを実装
  - _Requirements: 4.1, 4.2, 6.5_

## コアライブラリ・ユーティリティ

- [ ] 4. パフォーマンス最適化ユーティリティ実装
  - src/lib/utils/debounce.ts に 500ms デバウンス関数を実装
  - src/lib/utils/performance.ts にテキスト解析時間測定機能を実装
  - src/lib/utils/analytics.ts にローカル解析統計（セッション内のみ）を実装
  - 各ユーティリティの単体テストを Vitest で実装
  - _Requirements: 1.3, 1.5_

- [ ] 5. 日本語テキスト処理エンジン実装
  - src/lib/japanese/validator.ts にテキスト文字数・文字種検証を実装
  - src/lib/japanese/formatter.ts にテキスト正規化（Unicode NFC）を実装
  - src/lib/japanese/tokenizer.ts に文・句読点分割機能を実装
  - 日本語処理の単体テストでひらがな・カタカナ・漢字処理を検証
  - _Requirements: 1.1, 1.4, 2.1_

- [ ] 6. セキュリティ・入力検証レイヤー実装
  - src/lib/security/input-validator.ts に XSS 防止・文字数制限を実装
  - src/lib/security/context-extractor.ts に LLM 送信用の最小文脈抽出を実装
  - src/lib/security/api-key-validator.ts に Gemini API キー形式検証を実装
  - セキュリティ機能の単体テストでエッジケースを検証
  - _Requirements: 3.3, 6.1, 6.2, 6.3_

## ルールエンジン・検出機能

- [ ] 7. YAML ルール読み込み・パース機能実装
  - src/lib/rules/loader.ts に public/rules/ からの YAML ファイル読み込みを実装
  - src/lib/rules/types.ts にルール設定型定義とバリデーションを実装
  - ルール読み込み失敗時のフォールバック（デフォルトルール）を実装
  - ルールホットリロード機能（1秒未満応答）をテストで検証
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 8. カテゴリ別ルール検出エンジン実装
  - src/lib/rules/categories/consistency.ts に表記ゆれ検出（全角/半角、ひら/カナ）を実装
  - src/lib/rules/categories/grammar.ts にら抜き言葉・二重否定検出を実装
  - src/lib/rules/categories/style.ts に冗長表現・一文60字超検出を実装
  - src/lib/rules/categories/honorific.ts に二重敬語検出を実装
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 9. メインルールエンジン・統合実装
  - src/lib/rules/engine.ts にルール実行エンジンとキャッシュ機能を実装
  - 複数カテゴリのルール並列実行と結果統合を実装
  - 安全置換（Safe Replacement）判定ロジックを実装
  - ルールエンジンの単体テストで F1 スコア≥0.70 を検証
  - _Requirements: 2.7, 4.4, 5.4_

## API レイヤー・エンドポイント

- [ ] 10. /api/lint エンドポイント実装
  - src/app/api/lint/route.ts に POST エンドポイントとリクエスト検証を実装
  - テキスト解析処理とルールエンジン統合を実装
  - レスポンス形式（AnalysisResult）とエラーハンドリングを実装
  - API エンドポイントのコントラクトテストを実装
  - _Requirements: 1.2, 1.5, 2.1-2.7_

- [ ] 11. /api/suggest エンドポイント実装  
  - src/app/api/suggest/route.ts に POST エンドポイントと TextPassage 処理を実装
  - LLM 提案リクエスト形式とタイムアウト（10秒）処理を実装
  - LLM エラー時のルール結果維持ロジックを実装
  - /api/suggest エンドポイントのコントラクトテストを実装
  - _Requirements: 3.1, 3.4, 3.5_

- [ ] 12. ルールセット管理 API 実装
  - src/app/api/rulesets/route.ts に GET エンドポイント（ルールセット一覧）を実装
  - src/app/api/rulesets/[id]/route.ts に特定ルールセット取得を実装
  - ルールセット切替のリアルタイム更新機能を実装
  - ルールセット API のコントラクトテストを実装
  - _Requirements: 5.1, 5.2_

## LLM統合・提案機能

- [ ] 13. Gemini API クライアント実装
  - src/lib/gemini/client.ts に環境変数からの API 設定読み込みを実装
  - Gemini 2.5 Flash への HTTP リクエスト送信機能を実装
  - API レート制限・タイムアウト処理を実装
  - Gemini クライアントの単体テストとモック応答テストを実装
  - _Requirements: 3.3, 6.2, 6.3_

- [ ] 14. LLM 提案生成・キャッシュサービス実装
  - src/lib/gemini/suggestions.ts に最大3案の提案生成ロジックを実装
  - src/lib/gemini/cache.ts に同一抜粋の再送抑制キャッシュを実装
  - 提案理由（80字以内）と断定表現回避の検証を実装
  - LLM 提案サービスの単体テストを実装
  - _Requirements: 3.1, 3.2, 3.4_

## テキスト解析・統合サービス

- [ ] 15. メインテキスト解析サービス実装
  - src/lib/analysis/text-analysis-service.ts にルール＋LLM統合ロジックを実装
  - 解析結果の統合・重複排除・優先度付けを実装
  - パフォーマンス測定（2000字5秒以内）機能を実装
  - テキスト解析サービスの統合テストを実装
  - _Requirements: 1.5, 2.7, 3.1, 4.5_

## フロントエンド・UI コンポーネント

- [ ] 16. テキストエディタ・ハイライト機能実装
  - src/components/proofreading/TextEditor.tsx にデバウンス入力とリアルタイム解析を実装
  - src/components/proofreading/TextHighlight.tsx に Issue ハイライト表示を実装
  - テキスト範囲選択とキーボードナビゲーション機能を実装
  - テキストエディタの UI テストを Testing Library で実装
  - _Requirements: 1.1, 1.3, 4.1, 6.5_

- [ ] 17. Issue 表示・管理コンポーネント実装
  - src/components/proofreading/IssueList.tsx に Issue 一覧とフィルタリングを実装
  - src/components/proofreading/IssueDetail.tsx に詳細パネルと修正案表示を実装
  - Issue 選択・適用・Fix All 機能を実装
  - Issue コンポーネントの UI テストを実装
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 18. 校正アクション・設定コンポーネント実装
  - src/components/proofreading/ProofreadingActions.tsx に手動校正・Fix All ボタンを実装
  - src/components/settings/SettingsModal.tsx にルールセット選択・LLM設定を実装
  - src/components/settings/RulesetSelector.tsx にリアルタイムルール切替を実装
  - 設定コンポーネントの UI テストを実装
  - _Requirements: 1.2, 4.4, 5.1, 5.2, 6.4_

## 状態管理・ストア

- [ ] 19. Zustand ストア・状態管理実装
  - src/stores/proofreading-store.ts にテキスト・解析結果・Issue 状態を実装
  - src/stores/settings-store.ts にルールセット・LLM設定状態を実装
  - リアルタイム状態更新とローカルストレージ連携を実装
  - ストア機能の単体テストを実装
  - _Requirements: 1.3, 5.2, 6.4_

## レイアウト・メインページ

- [ ] 20. レイアウトコンポーネント・メインページ実装
  - src/components/layout/TopBar.tsx にナビゲーション・KPI表示を実装
  - src/components/layout/SideBar.tsx に Issue リスト・フィルタを実装
  - src/app/page.tsx にメイン校正インターフェースを実装
  - Dialin AI 風デザインシステムの最終調整を実装
  - _Requirements: 4.1, 4.2, 6.5_

## 統合テスト・E2E検証

- [ ] 21. エンドツーエンド統合テスト実装
  - tests/e2e/ にメイン校正フロー（入力→解析→修正適用）のテストを実装
  - ルール検出・LLM提案・Fix All 機能の統合テストを実装
  - パフォーマンス目標（5秒以内、1秒再実行）の検証テストを実装
  - アクセシビリティ要件のキーボード操作テストを実装
  - _Requirements: 全要件のE2E検証が必要_