# Project Structure

## Root Directory Organization
```
bunken/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── globals.css         # Global styles + Tailwind CSS
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx            # Main proofreading interface
│   │   └── api/                # API routes
│   │       ├── lint/           # Rule-based analysis endpoint
│   │       └── suggest/        # LLM suggestion endpoint
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   ├── proofreading/       # Core proofreading functionality
│   │   ├── settings/           # Configuration components
│   │   └── layout/             # Layout components
│   ├── lib/                    # Utility libraries
│   │   ├── rules/              # Rule engine implementation
│   │   ├── gemini/             # LLM integration
│   │   ├── japanese/           # Japanese text processing
│   │   └── utils/              # Helper functions
│   └── types/                  # TypeScript type definitions
├── public/
│   ├── rules/                  # Rule configuration YAML files
│   └── assets/                 # Static assets (icons, images)
├── docs/                       # Project documentation
├── .kiro/                      # Kiro steering documents
└── config files               # Next.js, TypeScript, Tailwind configs
```

## Subdirectory Structures

### `/src/components/` - コンポーネント設計
```
components/
├── ui/                         # 基本UIコンポーネント
│   ├── Button.tsx             # ボタンコンポーネント
│   ├── Card.tsx               # カードレイアウト
│   ├── Modal.tsx              # モーダルダイアログ
│   └── Badge.tsx              # 重大度表示バッジ
├── proofreading/              # 校正機能コンポーネント
│   ├── TextEditor.tsx         # メインテキストエディタ
│   ├── TextHighlight.tsx      # ハイライト表示
│   ├── IssueList.tsx          # Issue一覧
│   ├── IssueDetail.tsx        # Issue詳細パネル
│   └── ProofreadingActions.tsx # 校正アクション
├── settings/                   # 設定機能
│   ├── SettingsModal.tsx      # 設定モーダル
│   ├── RulesetSelector.tsx    # ルールセット選択
│   └── LLMConfig.tsx          # LLM接続設定
└── layout/                     # レイアウトコンポーネント
    ├── TopBar.tsx             # ヘッダーナビゲーション
    ├── SideBar.tsx            # サイドバー
    └── Footer.tsx             # フッター（KPI表示）
```

### `/src/lib/` - ビジネスロジック
```
lib/
├── rules/                      # ルールエンジン
│   ├── engine.ts              # ルール実行エンジン
│   ├── loader.ts              # YAMLルール読み込み
│   ├── types.ts               # ルール型定義
│   └── categories/            # カテゴリ別ルール実装
│       ├── style.ts           # スタイルガイド
│       ├── grammar.ts         # 文法チェック
│       ├── honorific.ts       # 敬語チェック
│       └── consistency.ts     # 表記ゆれ
├── gemini/                    # LLM統合
│   ├── client.ts              # Gemini APIクライアント
│   ├── suggestions.ts         # 提案生成
│   └── cache.ts               # 提案キャッシュ
├── japanese/                  # 日本語処理
│   ├── tokenizer.ts           # 形態素解析
│   ├── validator.ts           # 文字種・文法検証
│   └── formatter.ts           # テキスト整形
└── utils/                     # ユーティリティ
    ├── performance.ts         # パフォーマンス測定
    ├── analytics.ts           # ローカル分析
    └── debounce.ts            # 入力制御
```

## Code Organization Patterns
- **Feature-First Structure**: 機能単位でのコンポーネント・ロジック分離
- **Container/Presentational Pattern**: ビジネスロジックと表示の分離
- **Custom Hooks**: 状態管理とビジネスロジックの再利用
- **Type-Safe Development**: 厳密なTypeScript型定義による品質保証

## File Naming Conventions
- **Components**: PascalCase（例: `TextEditor.tsx`）
- **Utilities**: camelCase（例: `debounce.ts`）
- **Types**: PascalCase + 型サフィックス（例: `RuleConfig.ts`）
- **APIs**: kebab-case（例: `/api/lint/route.ts`）
- **Styles**: kebab-case（例: `proofreading-editor.css`）

## Import Organization
```typescript
// External libraries
import React from 'react'
import { NextRequest } from 'next/server'

// Internal utilities
import { debounce } from '@/lib/utils/debounce'
import { RuleEngine } from '@/lib/rules/engine'

// Components
import { TextEditor } from '@/components/proofreading/TextEditor'
import { Button } from '@/components/ui/Button'

// Types
import type { ProofreadingResult, RuleConfig } from '@/types'
```

## Key Architectural Principles
- **Separation of Concerns**: UI・ビジネスロジック・データアクセスの明確な分離
- **Performance First**: リアルタイム解析のための最適化設計
- **Accessibility First**: WAI-ARIA準拠・キーボード操作・スクリーンリーダー対応
- **Privacy by Design**: ローカル完結・データ非永続化・最小限送信
- **Configurable Rules**: 外部設定による柔軟なルール管理
- **Error Resilience**: LLMタイムアウト・ルール読み込み失敗への対応
- **User Experience**: 5秒以内応答・高い採用率を実現するUX設計
- **Maintainable Code**: TypeScript・テスト・ドキュメントによる保守性確保