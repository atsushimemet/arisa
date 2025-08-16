# Arisa デプロイ手順書

本ドキュメントでは、ArisaアプリケーションをRender（Docker）とSupabase（PostgreSQL）を使用してプロダクション環境にデプロイする手順を説明します。

## 📋 目次

- [前提条件](#前提条件)
- [Supabaseセットアップ](#supabaseセットアップ)
- [Dockerファイルの調整](#dockerファイルの調整)
- [Renderでのデプロイ](#renderでのデプロイ)
- [環境変数の設定](#環境変数の設定)
- [データベースマイグレーション](#データベースマイグレーション)
- [デプロイ後の確認](#デプロイ後の確認)
- [トラブルシューティング](#トラブルシューティング)
- [メンテナンス](#メンテナンス)

## 🔧 前提条件

デプロイを開始する前に、以下のアカウントと環境が必要です：

### 必要なアカウント
- [GitHub](https://github.com) アカウント（ソースコード管理）
- [Render](https://render.com) アカウント（アプリケーションホスティング）
- [Supabase](https://supabase.com) アカウント（データベース）

### ローカル環境
- Node.js 18以上
- npm または yarn
- Git
- Docker（テスト用）

---

## 🗄️ Supabaseセットアップ

### 1. Supabaseプロジェクトの作成

1. [Supabase Dashboard](https://app.supabase.com)にログイン
2. **New project**をクリック
3. プロジェクト情報を入力：
   - **Name**: `arisa-production`
   - **Database Password**: 強力なパスワードを生成（保存しておく）
   - **Region**: `Northeast Asia (Tokyo)`（推奨）
4. **Create new project**をクリック
5. プロジェクトの作成完了まで約2分待機

### 2. データベース接続情報の取得

1. サイドバーから**Settings** → **Database**を選択
2. **Connection string**セクションで以下の情報を取得：
   - **URI**: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres`
   - この文字列を`DATABASE_URL`として使用

### 3. Supabaseでの追加設定

1. **SQL Editor**に移動
2. 必要に応じてRLS（Row Level Security）の設定
3. **API Keys**を確認（将来の機能拡張用）

---

## 🐳 Dockerファイルの調整

本番環境用にDockerfileを最適化します。

### 1. 本番用Dockerfileの作成

既存のDockerfileを以下の内容で更新：

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. next.config.tsの更新

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  }
};

export default nextConfig;
```

### 3. .dockerignoreファイルの作成

```dockerignore
node_modules
npm-debug.log
.next
.git
.gitignore
README.md
Dockerfile
.dockerignore
.env*
```

---

## 🚀 Renderでのデプロイ

### 1. GitHubリポジトリの準備

1. プロジェクトをGitHubにプッシュ：
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Renderサービスの作成

1. [Render Dashboard](https://dashboard.render.com)にログイン
2. **New** → **Web Service**を選択
3. **Build and deploy from a Git repository**を選択
4. GitHubリポジトリを接続：
   - **Repository**: あなたのarisa リポジトリを選択
   - **Branch**: `main`

### 3. サービス設定

以下の設定を入力：

| 項目 | 値 |
|------|-----|
| **Name** | `arisa-app` |
| **Runtime** | `Docker` |
| **Region** | `Singapore` または `Oregon` |
| **Branch** | `main` |
| **Root Directory** | `arisa` |
| **Docker Command** | 空欄（Dockerfileを使用） |

### 4. インスタンスタイプの選択

- **Free Tier**: テスト用（制限あり）
- **Starter ($7/月)**: 本番用推奨
- **Standard ($25/月)**: 高トラフィック用

---

## 🔐 環境変数の設定

Renderサービスの**Environment**タブで以下の環境変数を設定：

### 必須環境変数

```env
# データベース
DATABASE_URL=postgresql://postgres:[PASSWORD]@[SUPABASE_HOST]:[PORT]/postgres

# NextAuth設定
NEXTAUTH_SECRET=your-super-secret-key-for-production-min-32-chars
NEXTAUTH_URL=https://your-app-name.onrender.com

# Node環境
NODE_ENV=production
```

### 環境変数の詳細説明

#### DATABASE_URL
- Supabaseから取得したPostgreSQL接続文字列
- 形式: `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres`

#### NEXTAUTH_SECRET
- 32文字以上のランダムな文字列
- 生成方法: `openssl rand -base64 32`

#### NEXTAUTH_URL
- デプロイ後のアプリケーションURL
- Renderが提供するURL: `https://your-app-name.onrender.com`

---

## 🗃️ データベースマイグレーション

### 1. Prismaマイグレーションの実行

デプロイ後、Renderのシェルまたはローカル環境からマイグレーションを実行：

#### オプション1: Renderシェル経由
1. Render Dashboard → サービス → **Shell**タブ
2. 以下のコマンドを実行：
```bash
npx prisma migrate deploy
npx prisma db seed
```

#### オプション2: ローカル環境から
1. 本番データベースURLを一時的にローカル環境に設定：
```bash
export DATABASE_URL="your-production-database-url"
npx prisma migrate deploy
npx prisma db seed
```

### 2. マイグレーション自動化（推奨）

Dockerfileに以下のスクリプトを追加して自動化：

```dockerfile
# Add migration script
COPY scripts/migrate-and-seed.sh ./
RUN chmod +x migrate-and-seed.sh

# Run migrations on startup
CMD ["sh", "-c", "./migrate-and-seed.sh && node server.js"]
```

`scripts/migrate-and-seed.sh`:
```bash
#!/bin/sh
echo "Running database migrations..."
npx prisma migrate deploy

echo "Checking if seeding is needed..."
CAST_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM casts;" | tail -n 1)
if [ "$CAST_COUNT" = "0" ]; then
  echo "Seeding database..."
  npx prisma db seed
else
  echo "Database already has data, skipping seed."
fi

echo "Database setup complete."
```

---

## ✅ デプロイ後の確認

### 1. アプリケーションの動作確認

1. **基本動作**:
   - ホームページの表示: `https://your-app.onrender.com`
   - オンボーディングフローの実行
   - キャスト検索機能のテスト

2. **管理者機能**:
   - 管理者ページアクセス: `https://your-app.onrender.com/admin`
   - キャスト追加・編集・削除機能

3. **データベース接続**:
   - Supabase Dashboard → **Table Editor**でデータ確認

### 2. パフォーマンステスト

```bash
# 応答時間の確認
curl -w "@curl-format.txt" -o /dev/null -s "https://your-app.onrender.com"

# 負荷テスト（必要に応じて）
ab -n 100 -c 10 https://your-app.onrender.com/
```

### 3. ログの確認

Render Dashboard → サービス → **Logs**タブでエラーログを確認

---

## 🔧 トラブルシューティング

### よくある問題と解決策

#### 1. データベース接続エラー

**症状**: `Can't reach database server`
**解決策**:
- DATABASE_URLの形式を確認
- Supabaseプロジェクトの状態確認
- IPホワイトリストの設定確認（Supabaseは通常全IP許可）

#### 2. Prismaマイグレーションエラー

**症状**: `Migration failed`
**解決策**:
```bash
# マイグレーション状態の確認
npx prisma migrate status

# マイグレーションのリセット（注意：データ消失）
npx prisma migrate reset --force

# 手動マイグレーション
npx prisma db push
```

#### 3. ビルドエラー

**症状**: `Build failed`
**解決策**:
- 依存関係の確認: `npm install`
- TypeScriptエラーの修正
- 環境変数の設定確認

#### 4. メモリ不足エラー

**症状**: `Out of memory`
**解決策**:
- Renderのインスタンスタイプを上位プランに変更
- ビルドプロセスの最適化

### ログファイルの場所

- **Render**: Dashboard → Logs
- **Supabase**: Dashboard → Logs → Postgres Logs

---

## 🛠️ メンテナンス

### 定期メンテナンス作業

#### 1. データベースバックアップ

Supabaseでは自動バックアップが有効ですが、手動バックアップも推奨：

1. Supabase Dashboard → **Settings** → **Database**
2. **Database backups**セクションで設定確認
3. 必要に応じて手動バックアップを作成

#### 2. 依存関係の更新

```bash
# セキュリティアップデートの確認
npm audit

# 依存関係の更新
npm update

# 重要な更新の適用
npm audit fix
```

#### 3. パフォーマンス監視

- Renderの**Metrics**タブで監視
- Supabaseの**Database**→**Logs**でクエリパフォーマンス確認

#### 4. SSL証明書の更新

Renderでは自動更新されますが、定期的に確認：
- Dashboard → サービス → **Settings** → **Custom Domain**

### アップデート手順

1. **ローカルでテスト**:
```bash
npm test
npm run build
```

2. **ステージング環境でのテスト**（推奨）

3. **本番デプロイ**:
```bash
git add .
git commit -m "Update: [変更内容]"
git push origin main
```

4. **デプロイ後の動作確認**

---

## 📞 サポートとリソース

### 公式ドキュメント

- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

### コミュニティ

- [Render Community](https://community.render.com)
- [Supabase Discord](https://discord.supabase.com)
- [Next.js Discord](https://nextjs.org/discord)

### 緊急時の連絡先

プロダクション環境での問題が発生した場合：

1. **即座の対応**: Renderサービスの一時停止
2. **ログ確認**: エラーの原因特定
3. **ロールバック**: 前のバージョンに戻す
4. **サポート**: 各プラットフォームのサポートに連絡

---

## 🎉 完了

以上でArisaアプリケーションのプロダクション環境への デプロイが完了しました。

本番環境URL: `https://your-app-name.onrender.com`

定期的なメンテナンスとモニタリングを継続して、安定したサービス運用を心がけてください。