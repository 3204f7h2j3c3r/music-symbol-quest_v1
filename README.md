# MusicSymbolQuest（開発版）

音楽記号をクイズ形式で学習するWebアプリです。

このブランチ（`dev`）では、React + Vite + HeroUI を使用した開発版を開発しています。安定版・正式リリースは `main` ブランチで管理する予定です。

## 開発環境

- React
- Vite
- HeroUI
- Tailwind CSS
- Lucide React

## 起動方法

Node.js と npm がインストールされた環境で、以下を実行してください。

```bash
npm ci
npm run dev
```

## ビルド

```bash
npm run build
```

ビルド成果物は `dist/` に出力されます。

## ブランチ運用

- `main`: 安定版・正式リリース
- `dev`: 開発版

開発版の動作確認後、`main` に統合してリリースする予定です。
