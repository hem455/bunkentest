# Technology Stack

## Architecture
- **アプリケーション構成**: ローカル完結型単体Webアプリ（解析API + UI）
- **デプロイメント**: 同一マシン内でのフロントエンド・バックエンド統合
- **データフロー**: テキスト入力 → ルール検出 + LLM提案 → 修正適用
- **処理方式**: リアルタイム解析（手動 + 自動500msトリガー）

## Frontend
- **Framework**: Next.js 14（App Router使用）
- **スタイリング**: Tailwind CSS
- **UI Components**: カード主体のモダンSaaSダッシュボード
- **状態管理**: React State + Context API
- **アニメーション**: 150-200ms フェード/スライド（軽量実装）
- **アクセシビリティ**: ARIA準拠、フルキーボード操作対応

## Backend
- **API Structure**: RESTful API with JSON
- **エンドポイント**: 
  - `/lint` - ルールベース校正
  - `/suggest` - LLM提案（Gemini 2.5 Flash）
- **言語処理**: 日本語テキスト解析エンジン
- **ルールエンジン**: YAML設定ファイルベースの柔軟なルール管理
- **キャッシュ**: 同一抜粋の再送抑制、ルール結果キャッシュ

## Development Environment
- **Package Manager**: npm/yarn
- **Node.js**: 最新LTS版
- **TypeScript**: 型安全な開発環境
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **Build Tools**: Next.js標準ビルドシステム

## Common Commands
- `npm run dev` - 開発サーバー起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバー起動
- `npm run lint` - コード品質チェック
- `npm run test` - テスト実行

## Environment Variables
- `GEMINI_API_KEY` - Gemini 2.5 Flash APIキー
- `GEMINI_BASE_URL` - ローカルGemini APIのベースURL
- `MAX_TEXT_LENGTH` - 最大テキスト長（デフォルト: 20,000字）
- `AUTO_ANALYSIS_DELAY` - 自動解析遅延時間（デフォルト: 500ms）
- `RULE_CACHE_TTL` - ルールキャッシュ有効期間

## Port Configuration
- **Development**: Port 3000
- **Production**: Port 3000（または環境設定）
- **Gemini API**: ローカルHTTP API（設定可能）

## Performance Requirements
- **2000字校正**: P95 < 5秒（LLM提案OFF時）
- **ルール再実行**: < 1秒（キャッシュ利用）
- **LLM提案**: 1.5-3.0秒目安（タイムアウト10秒）
- **メモリ使用量**: 効率的なテキスト処理とガベージコレクション

## Security & Privacy
- **データ保持**: ローカルメモリ上のみ、永続化なし
- **LLM送信**: ユーザー明示的許可時のみ、抜粋最小限
- **APIキー管理**: 安全な環境変数管理、UI非表示
- **入力検証**: XSS防止、文字数制限、サニタイゼーション

## External Dependencies
- **Gemini 2.5 Flash**: ローカルAPI接続によるLLM提案機能
- **YAML Parser**: ルール設定ファイル読み込み
- **Japanese Text Processing**: 形態素解析・文字種判定ライブラリ
- **File System**: ルールファイルのホットリロード機能