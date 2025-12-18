# Crypto Daily Check-in 🚀

**每日加密货币与 AI 资讯推送机器人**

一个基于 Bun 运行时的自动化日报推送系统，集成加密货币市场数据、贵金属行情、AI 科技资讯及 LLM 智能锐评，支持多渠道消息推送。

---

## ✨ 核心功能

### � 市场数据

| 模块             | 说明                                             |
| ---------------- | ------------------------------------------------ |
| **贵金属行情**   | 实时金价、银价 (Au/Ag)                           |
| **加密货币**     | BTC, ETH, BNB, SOL 等主流代币的 24h 价格、涨跌幅 |
| **恐惧贪婪指数** | 市场情绪指标                                     |

**高可用设计**：主接口 Binance API，备用 CoinGecko API，失败自动重试 + 降级切换。

### 📰 资讯聚合

- **加密货币新闻**：CryptoCompare / Coinpaprika
- **AI 行业资讯**：TechCrunch, VentureBeat, MIT Tech Review (RSS Feed)
- **自动翻译**：所有英文内容自动翻译为中文

### 🤖 AI 锐评

基于 LLM (OpenRouter/OpenAI 兼容) 对当日市场数据和资讯进行智能点评分析。

### 📤 多渠道推送

| 服务             | 默认状态 | 环境变量          |
| ---------------- | -------- | ----------------- |
| Telegram Bot     | ✅ 启用  | `NOTIFY_TELEGRAM` |
| 钉钉群机器人     | ✅ 启用  | `NOTIFY_DINGTALK` |
| 企业微信群机器人 | ❌ 禁用  | `NOTIFY_WX_BOT`   |
| 企业微信应用消息 | ❌ 禁用  | `NOTIFY_WX_APP`   |

---

## 🛠️ 技术栈

- **Runtime**: [Bun](https://bun.sh/)
- **HTTP Client**: Axios / Fetch
- **RSS Parser**: Cheerio
- **Translation**: google-translate-api-x
- **CI/CD**: GitHub Actions (每日北京时间 9:00 自动执行)

---

## 🚀 快速开始

### 1. 安装依赖

```bash
bun install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入必要的配置 (详见下方「推送服务 Token 获取指南」)。

### 3. 运行

```bash
# 开发模式
bun run dev

# 生产模式
bun run start
```

### 4. GitHub Actions 自动运行

Fork 本仓库后，在 `Settings > Secrets and variables > Actions` 中配置相应的 Secrets，即可实现每日自动推送。

---

## 📂 项目结构

```
src/
├── app.js                 # 程序入口
├── config/
│   ├── env.js             # 环境变量管理
│   ├── modules.js         # 模块开关配置
│   └── constants.js       # API 常量
├── services/
│   ├── DailyReportGenerator.js  # 日报生成器
│   ├── crypto/            # 加密货币服务 (行情、新闻、情绪)
│   ├── finance/           # 金融服务 (金价)
│   ├── tech/              # 科技资讯服务 (AI News)
│   ├── llm/               # LLM 锐评服务
│   └── notification/      # 通知服务
│       ├── telegram/      # Telegram Bot
│       ├── dingtalk/      # 钉钉群机器人
│       ├── groupBot/      # 企业微信群机器人
│       └── wxBot/         # 企业微信应用消息
└── utils/                 # 工具函数
```

---

## 🔑 推送服务 Token 获取指南

### Telegram Bot

1. 在 Telegram 中搜索 [@BotFather](https://t.me/BotFather) 并发送 `/newbot`
2. 按提示创建机器人，获得 `TELEGRAM_BOT_TOKEN`
3. 获取 Chat ID：
   - 将机器人拉入群组（或私聊机器人）
   - 访问 `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
   - 发送任意消息后刷新页面，在返回 JSON 中找到 `chat.id`
4. 配置环境变量：
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_chat_id
   ```

### 钉钉群机器人 (加签方式)

1. 进入钉钉群 → 群设置 → 智能群助手 → 添加机器人 → 自定义机器人
2. 设置机器人名称，安全设置选择**加签**方式
3. 复制 Webhook URL 中的 `access_token` 和页面显示的**签名密钥 (Secret)**
4. 配置环境变量：
   ```env
   DINGTALK_ACCESS_TOKEN=your_access_token
   DINGTALK_SECRET=SEC...your_secret
   ```

> **签名原理**: 使用 HMAC-SHA256 算法，将 `timestamp + "\n" + secret` 作为签名串，生成 Base64 编码的签名后 URL 编码，附加到请求 URL 中。

### 企业微信群机器人

1. 进入企业微信群 → 群设置 → 群机器人 → 添加机器人
2. 复制 Webhook URL 中的 `key` 参数
3. 配置环境变量：
   ```env
   BOT_KEY=your_bot_key
   NOTIFY_WX_BOT=true
   ```

### 企业微信应用消息

1. 登录[企业微信管理后台](https://work.weixin.qq.com/)
2. 获取企业 ID (CorpID)：我的企业 → 企业信息 → 企业 ID
3. 创建自建应用：应用管理 → 自建 → 创建应用
4. 获取应用的 AgentId 和 Secret
5. 配置环境变量：
   ```env
   WX_COMPANY_ID=your_corp_id
   WX_APP_ID=your_agent_id
   WX_APP_SECRET=your_app_secret
   NOTIFY_WX_APP=true
   ```

---

## ⚙️ 模块配置

通过环境变量灵活控制启用/禁用各功能模块：

| 变量                    | 默认  | 说明          |
| ----------------------- | ----- | ------------- |
| `MODULE_GOLD`           | true  | 贵金属行情    |
| `MODULE_CRYPTO`         | true  | 加密货币行情  |
| `MODULE_AI_NEWS`        | true  | AI 科技资讯   |
| `MODULE_LLM_COMMENTARY` | true  | LLM 智能锐评  |
| `MODULE_WEATHER`        | false | 天气预报      |
| `MODULE_QUOTE`          | false | 每日一言/情话 |

---

## 📝 示例输出

```
💰 今日贵金属 (12月18日)
━━━━━━━━━━━━━━━━
黄金 Au: ¥625.00/g (↑0.32%)
白银 Ag: ¥7.85/g (↓0.13%)

📈 加密货币行情
━━━━━━━━━━━━━━━━
BTC: $105,000 (↑2.35%)
ETH: $3,950 (↑1.28%)
...

🤖 AI 行业快讯
━━━━━━━━━━━━━━━━
• OpenAI 发布最新模型...
• Google DeepMind 突破...

💡 AI 锐评
━━━━━━━━━━━━━━━━
今日 BTC 突破历史新高...
```

---

## 📜 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。

---

## 📄 License

MIT
