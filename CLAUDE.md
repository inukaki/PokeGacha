# PokeGacha プロジェクト

Discordサーバー向けポケモンガチャBotです。1日1回ガチャを引いてポケモンを集め、サーバー全体で151匹の図鑑完成を目指します。

## 技術スタック

- **ランタイム**: Node.js
- **Discordライブラリ**: discord.js v14
- **データベース**: Firebase Firestore
- **デプロイ**: Docker (`docker-compose up`)
- **外部API**: [PokéAPI](https://pokeapi.co/api/v2/pokemon/{id})

## コマンド

```bash
# Dockerでbot起動
docker-compose up -d

# Dockerコンテナ内でコマンドを登録（初回・スラッシュコマンド変更時）
docker exec -it <container> node deploy-commands.js

# ログ確認
docker-compose logs -f bot
```

## アーキテクチャ

```
bot/
├── main.js                  # エントリポイント、クライアント初期化
├── deploy-commands.js       # スラッシュコマンドをDiscord APIに登録
├── commands/
│   ├── poke_gacha.js        # /poke_gacha コマンド（ガチャ本体）
│   └── list.js              # /list コマンド（図鑑表示）
├── events/
│   ├── ready.js             # Bot起動時・Firebase初期化
│   ├── interactionCreate.js # コマンドのディスパッチ
│   └── guildCreate.js       # サーバー参加時の初期化
├── model/
│   └── pokemon.js           # Pokemonクラス
├── Pokemons.JSON            # 151匹のID・名前・レアリティ定義
└── jpType.json              # タイプ名の日本語変換テーブル
```

## Firestoreデータ構造

```
servers/{guildId}/
  pokemons: { [id]: { count: number, get_player: string } }
  num_pokemons: number          # 総ガチャ回数
  num_register_pokemons: number # 図鑑登録済み種類数
  users: { [userId]: string }   # 最終ガチャ日時 (YYYYMMDDHH形式)
```

## 重要な仕様

- **日付リセット**: 日本時間 AM5:00（前日5時〜当日5時を「1日」として扱う）
- **ガチャ確率**: rarity1=35%, 2=25%, 3=25%, 4=10%, 5=5%
- **図鑑**: 151匹（第1世代）が揃うと全員への祝福メッセージを送信
- **SSHポート**: Docker内2222 → ホスト4000にマッピング

## コーディング規則

- コメントは日本語で記述する
- スラッシュコマンドを追加・変更したら `deploy-commands.js` の再実行が必要
- Firestore書き込みは `docRef.set()` でオブジェクト全体を上書き（部分更新は `update()`）
