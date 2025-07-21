# Personal Developer Showcase Platform

個人開発者が自身のプロジェクトを効果的に紹介し、他の開発者と繋がるためのプラットフォーム。

## 概要

このプラットフォームは、開発者が自身のプロジェクトを詳細な情報と共に管理し、公開/非公開の制御を行いながら、技術スタックや興味に基づいて他の開発者と繋がることを可能にします。

## 主な機能

- **プロジェクト管理**: 詳細な説明、技術スタック、画像を含むプロジェクトの作成・編集・削除
- **公開設定**: プロジェクトごとの公開/非公開設定
- **検索機能**: 技術スタックやキーワードによる高度な検索
- **開発者ネットワーキング**: 他の開発者のプロジェクトを発見し、繋がる
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応

## 技術スタック

### フロントエンド
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router v6
- TanStack Query
- Zustand

### バックエンド
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT認証

### インフラ
- フロントエンド: Netlify
- バックエンド: Railway
- 画像ストレージ: Cloudinary

## 開発環境のセットアップ

### 前提条件
- Node.js 18以上
- PostgreSQL 14以上
- npm または yarn

### インストール手順

1. リポジトリのクローン
```bash
git clone [repository-url]
cd personal-dev-showcase
```

2. フロントエンドのセットアップ
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

3. バックエンドのセットアップ
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

### 環境変数

#### フロントエンド (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

#### バックエンド (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/devshowcase
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
```

## 開発コマンド

### フロントエンド
```bash
npm run dev         # 開発サーバー起動
npm run build       # プロダクションビルド
npm run lint        # リンティング
npm test           # テスト実行
```

### バックエンド
```bash
npm run dev                    # 開発サーバー起動
npm run build                  # TypeScriptビルド
npm run lint                   # リンティング
npm test                       # テスト実行
npx prisma studio             # Prisma Studio起動
npx prisma migrate dev        # マイグレーション実行
```

## プロジェクト構造

```
personal-dev-showcase/
├── frontend/                 # フロントエンドアプリケーション
├── backend/                  # バックエンドアプリケーション
└── docs/                     # プロジェクトドキュメント
```

## ライセンス

MIT License

## 貢献

プルリクエストは歓迎します。大きな変更の場合は、まずissueを開いて変更内容について議論してください。