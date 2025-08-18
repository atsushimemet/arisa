# Supabase セットアップガイド

このプロジェクトはSupabase PostgreSQLを使用しています。

## 初期セットアップ

### 1. Supabaseプロジェクトの作成
1. [Supabase](https://supabase.com/)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. データベースパスワードを設定（安全な場所に保存）

### 2. 接続文字列の取得
1. Supabaseダッシュボードで Settings → Database を開く
2. Connection string → URI をコピー
3. `[YOUR-PASSWORD]`を実際のパスワードに置き換え

### 3. 環境変数の設定
`.env.local`ファイルに以下を設定：

```env
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres"
```

### 4. データベースマイグレーション
```bash
npm run db:migrate
npm run db:seed
```

## 重要な注意事項

### Row Level Security (RLS)
SupabaseはデフォルトでRow Level Securityが有効です。開発中にデータアクセスで問題が発生した場合：

1. SupabaseダッシュボードのSQL Editorで以下を実行：
```sql
-- 開発環境でのみ使用（本番環境では適切なRLSポリシーを設定）
ALTER TABLE casts DISABLE ROW LEVEL SECURITY;
ALTER TABLE area_masters DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
```

### テーブル確認
マイグレーション後、Supabaseダッシュボードの Table Editor でテーブルが正しく作成されているか確認してください。

### API Keys
フロントエンドからSupabaseに直接アクセスする場合は、anon keyとservice role keyも設定が必要です：

```env
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SERVICE_ROLE_KEY]"
```

## トラブルシューティング

### 接続エラー
- DATABASE_URLが正しく設定されているか確認
- Supabaseプロジェクトが一時停止していないか確認
- パスワードに特殊文字が含まれる場合はURLエンコードが必要

### マイグレーションエラー
- Supabaseダッシュボードでテーブルが存在するか確認
- SQL Editorでマイグレーション履歴を確認：
```sql
SELECT * FROM _prisma_migrations;
```

### データが表示されない
- RLSポリシーが適切に設定されているか確認
- 開発環境では一時的にRLSを無効化することも可能