# Arisa UI Design System プロンプト

## プロジェクト概要
Arisaは、キャバクラ・ガールズバーなどの夜のお店のキャスト検索サービスです。エリア、接客スタイル、予算に応じてキャストを紹介し、SNSに直接導線を提供するNext.js製のWebアプリケーションです。

## デザインコンセプト
**iOS風のモダンでエレガントなデザインシステム**を採用し、日本の夜のお店という業界でありながら、清潔感と信頼性を重視したUIを実現しています。

## 色彩システム

### 基本カラーパレット
```css
/* メインカラー */
--ios-blue: #007AFF;        /* プライマリアクション */
--ios-green: #34C759;       /* 成功・確定アクション */
--ios-purple: #AF52DE;      /* アクセント・特別な要素 */
--ios-orange: #FF9500;      /* 警告・注意喚起 */
--ios-red: #FF3B30;        /* エラー・削除 */

/* グレースケール */
--ios-gray-50: #fafafa;
--ios-gray-100: #f5f5f5;
--ios-gray-200: #eeeeee;
--ios-gray-300: #e0e0e0;
--ios-gray-500: #9e9e9e;
--ios-gray-600: #757575;
--ios-gray-700: #424242;
--ios-gray-800: #212121;

/* 特殊カラー */
--ios-teal: #5AC8FA;
--ios-indigo: #5856D6;
--ios-pink: #FF2D92;
--ios-mint: #00C7BE;
```

### グラデーション
```css
background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #f1f3f4 100%);
```

## タイポグラフィ

### フォントファミリー
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
```

### 文字サイズとスタイル
- **大見出し (ios-title)**: font-weight: 700, letter-spacing: -0.02em
- **小見出し (ios-subtitle)**: font-weight: 600, letter-spacing: -0.01em
- **本文 (ios-body)**: font-weight: 400, letter-spacing: -0.01em, line-height: 1.6
- **キャプション (ios-caption)**: font-weight: 400, font-size: 0.875rem

## コンポーネントデザイン

### ボタン（Button.tsx）
```typescript
// プライマリボタン
variant="primary" // iOS風ブルー、白文字、影付き
variant="secondary" // グレー背景、ダーク文字
variant="outline" // ボーダーのみ、ホバーで塗りつぶし
variant="success" // グリーン、成功アクション用
variant="warning" // オレンジ、警告用
variant="danger" // レッド、削除用

// サイズ
size="sm" // 36px height
size="md" // 44px height
size="lg" // 52px height  
size="xl" // 60px height

// 特徴
- iOS風の丸角 (12px)
- アクティブ時のスケール変化 (0.95)
- ローディング状態対応
- アイコン配置可能
```

### カード（Card.tsx）
```typescript
// バリエーション
variant="default" // 白背景、境界線、基本影
variant="elevated" // 白背景、強い影
variant="outlined" // ボーダー強調
variant="glass" // ガラスモーフィズム、ブラー効果

// 特徴
- iOS風の丸角 (16px)
- ホバー時の浮き上がりアニメーション
- 選択状態の視覚的フィードバック
- スムースなトランジション (300ms)
```

## アニメーション

### 標準アニメーション
```css
/* フェードイン */
.ios-fade-in {
  animation: ios-fade-in 0.6s ease-out;
}

/* スライドアップ */
.ios-slide-up {
  animation: ios-slide-up 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* スケールイン */
.ios-scale-in {
  animation: ios-scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* フロート */
.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

### トランジション原則
- 基本的なトランジション: `transition-all duration-200`
- カードやモーダル: `transition-all duration-300`
- イージング: `cubic-bezier(0.25, 0.8, 0.25, 1)` (iOS風)

## レイアウト

### グリッドシステム
```css
/* 選択グリッド */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3 /* レスポンシブ3カラム */
gap-4 sm:gap-6 lg:gap-8 /* 段階的余白 */

/* コンテナ */
max-w-7xl mx-auto /* 最大幅制限 */
px-4 sm:px-6 lg:px-8 /* レスポンシブパディング */
```

### 余白システム
- 基本単位: 4px (Tailwind基準)
- 拡張余白: 18 (72px), 22 (88px), 26 (104px)〜50 (200px)

## 影システム

### iOS風シャドウ
```css
.shadow-ios-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)
.shadow-ios: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)
.shadow-ios-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)
.shadow-ios-xl: 0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.12)

/* ボタン専用 */
.shadow-ios-button: 0 4px 8px rgba(0, 122, 255, 0.3), 0 1px 3px rgba(0, 122, 255, 0.15)
```

## レスポンシブデザイン

### ブレークポイント
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

### モバイルファースト設計
- デフォルトはモバイル向け
- 大画面では要素を拡大・配置変更
- タッチフレンドリーなサイズ (最小44px)

## ページ構成例

### ホームページ
```typescript
// 構造
Hero Section (グラデーション背景)
├── メインタイトル + サブタイトル
├── 説明カード (ガラスモーフィズム)
├── CTAボタン群
├── 統計情報カード
└── 機能紹介カード

// 特徴
- 段階的なアニメーション (遅延実行)
- iOS風の統一感
- 高いコントラスト比
```

### オンボーディング
```typescript
// 4ステップのウィザード形式
Step 1: ウェルカム (絵文字 + 説明)
Step 2: エリア選択 (アイコン付きグリッド)
Step 3: 接客スタイル (2カラムグリッド)
Step 4: 予算選択 (2カラムグリッド)

// UI原則
- 自動進行 (選択後300ms遅延)
- 戻るボタン搭載
- プログレス表示
- ダークテーマベース
```

## アクセシビリティ

### フォーカス管理
```css
button:focus, input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.3);
}
```

### カラーコントラスト
- AA基準準拠
- 色だけに依存しない情報伝達
- 選択状態の複数表現 (色 + アイコン + アニメーション)

## 特殊効果

### ガラスモーフィズム
```css
background: rgba(255, 255, 255, 0.9);
backdrop-filter: blur(20px);
border: 1px solid rgba(0, 0, 0, 0.05);
```

### ホログラフィック文字
```css
.holographic-text {
  background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b, #fb5607);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: holographic 3s ease-in-out infinite;
}
```

## 実装時の注意点

1. **パフォーマンス最適化**
   - アニメーション多用時のGPU活用
   - 画像の最適化とレイジーローディング

2. **ブラウザ互換性**
   - backdrop-filter対応確認
   - iOS Safari特有の問題対応

3. **一貫性の維持**
   - デザインシステムの厳格な適用
   - コンポーネントの再利用促進

4. **業界特性への配慮**
   - 信頼性を重視した清潔感のあるデザイン
   - エレガントさと親しみやすさのバランス

このプロンプトを参考に、Arisaプロジェクトと同様のiOS風モダンUIを実現してください。