# Arisa - キャストレコメンドサービス

エリア・接客スタイル・予算に応じた信頼できるキャストを見つけるためのプラットフォーム。SNS更新を継続する努力型キャストの集客を支援します。

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **スタイリング**: Tailwind CSS（ダークテーマ対応）
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **認証**: NextAuth.js
- **コンテナ**: Docker, Docker Compose

## 機能

### ユーザー向け機能
- **オンボーディング**: エリア・接客スタイル・予算の選択
- **キャスト検索**: 条件に基づいたキャストの検索
- **SNSリンク**: キャストのSNSへの直接アクセス
- **レスポンシブデザイン**: モバイル・デスクトップ対応

### 管理者向け機能
- **キャスト管理**: 新規登録・編集・削除
- **ステータス管理**: アクティブ/非アクティブの切り替え
- **統計情報**: キャスト数の表示

## セットアップ

### 1. 依存関係のインストール

```bash
cd arisa
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の内容を設定してください：

```env
# Database
DATABASE_URL="postgresql://arisa_user:arisa_password@localhost:5432/arisa"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. データベースの起動

```bash
# Docker Composeでデータベースを起動
docker-compose up -d postgres
```

### 4. データベースのマイグレーション

```bash
# Prismaマイグレーションを実行
npm run db:migrate

# シードデータを投入
npm run db:seed
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で利用できます。

## Docker Compose での起動

全体をDockerで起動する場合：

```bash
# 全サービスを起動
docker-compose up -d

# ログを確認
docker-compose logs -f
```

## 使用方法

### ユーザー向け

1. **ホームページ**: `http://localhost:3000`
2. **オンボーディング**: 「キャストを探す」ボタンをクリック
3. **条件選択**: エリア → 接客スタイル → 予算帯を順番に選択
4. **結果表示**: 条件に合ったキャストが表示されます
5. **SNSアクセス**: 「SNSを見る」ボタンでキャストのSNSにアクセス

### 管理者向け

1. **管理者ページ**: `http://localhost:3000/admin`
2. **キャスト追加**: 「新しいキャストを追加」ボタンをクリック
3. **キャスト管理**: 一覧からステータス変更や削除が可能

## データベーススキーマ

### Cast（キャスト）
- `id`: 一意識別子
- `name`: キャスト名
- `snsLink`: SNSリンク（必須）
- `storeLink`: 店舗リンク（任意）
- `area`: エリア（渋谷、新宿、銀座など）
- `serviceType`: 接客スタイル（キャバクラ、ガールズバーなど）
- `budgetRange`: 予算帯（〜1万円、1-2万円など）
- `isActive`: アクティブ状態

### Admin（管理者）
- `id`: 一意識別子
- `email`: メールアドレス
- `password`: パスワード（ハッシュ化）
- `name`: 管理者名

## 開発用コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# リンター実行
npm run lint

# データベースマイグレーション
npm run db:migrate

# シードデータ投入
npm run db:seed

# データベースリセット
npm run db:reset
```

## デザインコンセプト

**「ダークな中の輝き」**をテーマに、以下の要素を採用：

- **ダークベース**: 深い黒とグレーを基調
- **グローエフェクト**: ピンクとゴールドの光る効果
- **アニメーション**: 滑らかなホバーエフェクトと光の演出
- **レスポンシブ**: モバイルファーストなデザイン

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
