# Arisa デプロイチェックリスト

## 🚀 デプロイ前チェックリスト

デプロイを実行する前に、以下の項目を確認してください。

### ☑️ ローカル環境での確認

- [ ] ローカルでアプリケーションが正常に動作する
- [ ] `npm run build` が成功する
- [ ] TypeScriptエラーがない
- [ ] `npm run lint` でエラーがない
- [ ] Prismaマイグレーションが正常に動作する
- [ ] シードデータが正常に投入される

### ☑️ Supabaseの準備

- [ ] Supabaseプロジェクトが作成済み
- [ ] データベースパスワードを安全に保存
- [ ] DATABASE_URLを取得済み
- [ ] 接続テストが成功

### ☑️ Renderの準備

- [ ] Renderアカウントにログイン済み
- [ ] GitHubリポジトリがpublic（またはRenderにアクセス権限を付与）
- [ ] 最新のコードがGitHubにプッシュ済み

### ☑️ 環境変数の準備

- [ ] `DATABASE_URL` - Supabaseから取得
- [ ] `NEXTAUTH_SECRET` - 32文字以上のランダム文字列
- [ ] `NEXTAUTH_URL` - デプロイ後のURL（最初は仮のURLでOK）

### ☑️ ファイルの確認

- [ ] `Dockerfile` が本番用に更新済み
- [ ] `next.config.ts` にstandalone設定が追加済み
- [ ] `.dockerignore` ファイルが作成済み
- [ ] `scripts/migrate-and-seed.sh` が作成済み
- [ ] `package.json` にpostinstallスクリプトが追加済み

## 📋 デプロイ手順

### 1. 最終確認
```bash
# ローカルでビルドテスト
npm run build

# Dockerビルドテスト（オプション）
docker build -t arisa-test .
```

### 2. コードのプッシュ
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 3. Renderでのサービス作成
- New Web Service
- GitHub リポジトリを選択
- Runtime: Docker
- Root Directory: arisa

### 4. 環境変数の設定
Renderの Environment タブで設定：
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
NEXTAUTH_SECRET=[32文字以上のランダム文字列]
NEXTAUTH_URL=https://[your-app-name].onrender.com
NODE_ENV=production
```

### 5. デプロイ実行
- Deploy latest commit をクリック
- ログを監視してエラーがないか確認

## ✅ デプロイ後チェックリスト

### ☑️ アプリケーション動作確認

- [ ] ホームページが正常に表示される
- [ ] オンボーディングフローが動作する
- [ ] キャスト検索が動作する
- [ ] 管理者ページにアクセスできる
- [ ] キャスト追加機能が動作する

### ☑️ データベース確認

- [ ] Supabase Dashboard でテーブルが作成されている
- [ ] シードデータが投入されている
- [ ] データの読み書きが正常に動作する

### ☑️ パフォーマンス確認

- [ ] ページの読み込み時間が適切（3秒以内）
- [ ] モバイルでの表示が正常
- [ ] 画像の読み込みが正常

### ☑️ セキュリティ確認

- [ ] HTTPS接続が有効
- [ ] 環境変数が適切に設定されている
- [ ] 不要なエンドポイントが公開されていない

## 🔧 トラブルシューティング

### よくあるエラーと対処法

#### ビルドエラー
```bash
# 依存関係の問題
npm ci
npm run build

# TypeScriptエラー
npm run lint
```

#### データベース接続エラー
```bash
# 接続文字列の確認
echo $DATABASE_URL

# Prisma接続テスト
npx prisma db pull
```

#### マイグレーションエラー
```bash
# マイグレーション状態確認
npx prisma migrate status

# 手動マイグレーション
npx prisma db push
```

## 📞 エスカレーション

問題が解決しない場合のコンタクト先：

1. **Render**: [support@render.com](mailto:support@render.com)
2. **Supabase**: Discord コミュニティ
3. **Next.js**: GitHub Issues
4. **Prisma**: Discord コミュニティ

## 📝 デプロイ記録

デプロイした際は以下の情報を記録してください：

- **デプロイ日時**: ___________
- **デプロイ者**: ___________
- **バージョン**: ___________
- **主な変更点**: ___________
- **問題発生**: あり / なし
- **所要時間**: ___________
- **備考**: ___________