# Design Document

## Overview

個人開発者向けプロジェクト紹介プラットフォームは、ReactとTailwindCSSを使用したモダンなWebアプリケーションとして設計される。プラットフォームは、開発者が自身のプロジェクトを効果的に紹介し、他の開発者と交流できる環境を提供する。

### 主要な設計原則
- **ユーザビリティ**: 直感的で使いやすいインターフェース
- **レスポンシブデザイン**: 全デバイスでの最適な表示
- **パフォーマンス**: 高速な読み込みと滑らかな操作
- **セキュリティ**: 安全なユーザー認証とデータ保護
- **スケーラビリティ**: 将来の機能拡張に対応

## Architecture

### システム構成
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React +      │◄──►│   (Node.js +    │◄──►│   (PostgreSQL)  │
│   TailwindCSS)  │    │   Express)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   File Storage  │
│   (Netlify)     │    │   (Cloudinary)  │
└─────────────────┘    └─────────────────┘
```

### 技術スタック

#### フロントエンド
- **React 18**: コンポーネントベースのUI構築
- **TypeScript**: 型安全性とコード品質向上
- **TailwindCSS**: ユーティリティファーストのスタイリング
- **React Router v6**: SPA用のクライアントサイドルーティング
- **React Hook Form**: 効率的なフォーム管理
- **TanStack Query**: サーバー状態管理とキャッシング
- **Zustand**: 軽量なクライアント状態管理
- **React Hot Toast**: 通知システム

#### バックエンド
- **Node.js**: JavaScript実行環境
- **Express.js**: Webアプリケーションフレームワーク
- **TypeScript**: 型安全なサーバーサイド開発
- **Prisma**: 型安全なORM
- **JWT**: 認証トークン管理
- **bcrypt**: パスワードハッシュ化
- **multer**: ファイルアップロード処理
- **express-rate-limit**: レート制限

#### データベース・ストレージ
- **PostgreSQL**: メインデータベース
- **Cloudinary**: 画像ストレージ・最適化

#### デプロイメント
- **Netlify**: フロントエンドホスティング（GitHubとの自動連携）
- **Railway**: バックエンドホスティング

## Components and Interfaces

### フロントエンドコンポーネント構成

#### レイアウトコンポーネント
- **Layout**: 全体のレイアウト構造
- **Header**: ナビゲーションとユーザーメニュー
- **Footer**: フッター情報
- **Sidebar**: サイドナビゲーション（管理画面用）

#### 認証コンポーネント
- **LoginForm**: ログインフォーム
- **RegisterForm**: 新規登録フォーム
- **ProtectedRoute**: 認証が必要なルートの保護

#### プロジェクト関連コンポーネント
- **ProjectCard**: プロジェクト一覧用カード
- **ProjectDetail**: プロジェクト詳細表示
- **ProjectForm**: プロジェクト作成・編集フォーム
- **ProjectList**: プロジェクト一覧表示
- **ProjectSearch**: 検索・フィルター機能

#### ユーザー関連コンポーネント
- **UserProfile**: ユーザープロフィール表示
- **UserCard**: ユーザー一覧用カード
- **ProfileForm**: プロフィール編集フォーム

#### 共通コンポーネント
- **Button**: 再利用可能なボタン
- **Input**: フォーム入力コンポーネント
- **Modal**: モーダルダイアログ
- **LoadingSpinner**: ローディング表示
- **ImageUpload**: 画像アップロード機能

### API エンドポイント設計

#### 認証関連
```
POST /api/auth/register    - ユーザー登録
POST /api/auth/login       - ログイン
POST /api/auth/logout      - ログアウト
GET  /api/auth/me          - 現在のユーザー情報取得
```

#### ユーザー関連
```
GET    /api/users          - ユーザー一覧取得
GET    /api/users/:id      - 特定ユーザー情報取得
PUT    /api/users/:id      - ユーザー情報更新
DELETE /api/users/:id      - ユーザー削除
```

#### プロジェクト関連
```
GET    /api/projects              - 公開プロジェクト一覧取得
GET    /api/projects/my           - 自分のプロジェクト一覧取得
GET    /api/projects/:id          - 特定プロジェクト詳細取得
POST   /api/projects              - プロジェクト作成
PUT    /api/projects/:id          - プロジェクト更新
DELETE /api/projects/:id          - プロジェクト削除
PUT    /api/projects/:id/visibility - 公開・非公開設定変更
```

#### 検索関連
```
GET /api/search/projects?q=keyword&tech=stack - プロジェクト検索
GET /api/search/users?q=keyword               - ユーザー検索
```

#### ファイルアップロード
```
POST /api/upload/image - 画像アップロード
```

## Data Models

### User Model
```typescript
interface User {
  id: string
  email: string
  username: string
  displayName: string
  bio?: string
  avatarUrl?: string
  githubUrl?: string
  twitterUrl?: string
  websiteUrl?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  projects: Project[]
}
```

### Project Model
```typescript
interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  techStack: string[]
  isPublic: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  user: User
}
```

### TechStack Model
```typescript
interface TechStack {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'tool' | 'other'
  color: string
  projects: Project[]
}
```

## Error Handling

### フロントエンドエラーハンドリング

#### Error Boundary
```typescript
class ErrorBoundary extends React.Component {
  // アプリケーション全体のエラーをキャッチ
  // ユーザーフレンドリーなエラーページを表示
}
```

#### API エラーハンドリング
- **401 Unauthorized**: 自動的にログインページにリダイレクト
- **403 Forbidden**: アクセス権限エラーメッセージ表示
- **404 Not Found**: 404ページ表示
- **500 Internal Server Error**: 一般的なエラーメッセージ表示

#### バリデーションエラー
- フォーム入力時のリアルタイムバリデーション
- サーバーサイドバリデーションエラーの表示

### バックエンドエラーハンドリング

#### グローバルエラーハンドラー
```typescript
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  // ログ記録
  // 適切なHTTPステータスコードとエラーメッセージを返却
})
```

#### バリデーションエラー
- Joi/Zodを使用した入力データバリデーション
- 詳細なエラーメッセージの提供

#### データベースエラー
- Prismaエラーの適切な処理
- 制約違反エラーの処理

## Testing Strategy

### フロントエンドテスト

#### Unit Testing
- **Jest + React Testing Library**: コンポーネントテスト
- **MSW (Mock Service Worker)**: APIモック
- カバレッジ目標: 80%以上

#### Integration Testing
- ユーザーフローのテスト
- API統合テスト

#### E2E Testing
- **Playwright**: 主要なユーザージャーニーのテスト
- 認証フロー、プロジェクト作成・編集・削除フロー

### バックエンドテスト

#### Unit Testing
- **Jest**: ビジネスロジックのテスト
- **Supertest**: APIエンドポイントテスト

#### Integration Testing
- データベース統合テスト
- 外部サービス統合テスト

#### Database Testing
- テスト用データベースの使用
- マイグレーションテスト

### テスト環境
- **CI/CD**: GitHub Actions
- **テストデータベース**: PostgreSQL (Docker)
- **自動テスト実行**: プルリクエスト時

### パフォーマンステスト
- **Lighthouse**: パフォーマンス監査
- **Bundle Analyzer**: バンドルサイズ最適化
- **Load Testing**: APIエンドポイントの負荷テスト

### セキュリティテスト
- **OWASP ZAP**: セキュリティ脆弱性スキャン
- **npm audit**: 依存関係の脆弱性チェック
- **JWT トークン検証テスト**