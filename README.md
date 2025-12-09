# Crypto Daily Check-in (每日加密货币与AI资讯推送)

这是一个自动化的每日推送机器人，集成加密货币市场数据、行业新闻以及最新 AI 科技资讯。支持通过企业微信群机器人和 Telegram Bot 推送消息。

## 🌟 主要功能

### 1. 📈 市场数据监控 (Market Data)
- **实时币价**: 监控 BTC, ETH, SOL 等主流代币的 24小时价格、涨跌幅、最高/最低价。
- **高可用性设计**:
  - **主接口**: Binance API
  - **备用接口**: CoinGecko API
  - **智能重试**: 单个接口失败自动重试 3 次，全部失败后自动切换备用源。

### 2. 📰 资讯聚合 (News Aggregation)
自动获取并整合全球最新科技与金融资讯，**所有英文内容自动翻译为中文**。

#### a. 加密货币新闻
- **主数据源**: CryptoCompare
- **备用数据源**: Coinpaprika
- **特性**: 自动获取 Top 5 热门新闻。

#### b. AI 行业资讯 (新增)
- **数据源**:
  - TechCrunch AI
  - VentureBeat AI
  - MIT Technology Review AI
- **技术**: 基于 RSS Feed 解析，有效绕过反爬限制，并在本地进行中文化处理。

### 3. 🤖 多渠道推送
- **企业微信**: 支持群机器人 (Group Bot)
- **Telegram**: 支持 Telegram Bot 推送
- **其他内容**: 集成每日天气（默认重庆）、暖心日报等生活信息。

## 🛠️ 技术栈
- **Runtime**: [Bun](https://bun.sh/) (推荐) 或 Node.js
- **Http Client**: Axios
- **Parser**: Cheerio (XML/RSS 解析)
- **Translation**: google-translate-api-x

## 🚀 快速开始

### 1. 安装依赖
```bash
bun install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env` 并填入必要的 API Key：
```bash
cp .env.example .env
```
主要配置项：
- `WX_COMPANY_ID` / `WX_APP_SECRET`: 企业微信配置
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`: TG 机器人配置
- 其他 Key 根据需求选填

### 3. 运行项目
```bash
# 开发模式
bun run dev

# 生产模式
bun run start
```

## 📂 项目结构
```
src/
├── services/
│   ├── checkin/       # 签到相关服务 (CoinGecko/CoinMarket)
│   ├── crypto/        # 加密货币与AI资讯服务 (market.js, news.js)
│   └── notification/  # 消息推送服务 (WeChat, Telegram)
├── utils/             # 工具函数 (HTTP, 日期, 内容生成)
└── app.js             # 程序入口
```

## 📝 最近更新
- **News Service 重构**: 增加了对 TechCrunch, VentureBeat, MIT Tech Review 的 RSS 支持，解决了 HTML 爬虫被拦截的问题。
- **翻译优化**: 实现了串行翻译队列，避免因请求过快导致的翻译服务报错。
- **健壮性增强**: 全面增加 API 请求重试与降级机制。

## License
MIT
