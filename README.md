# TechDaily 🚀

**每日科技资讯推送机器人**

一个基于 Bun 运行时的自动化日报推送系统，集成加密货币市场数据、AI 科技资讯、宏观金融新闻、技术社区热点及 LLM 智能分析，支持多渠道消息推送。

---

## ✨ 核心功能

### 💰 市场与金融数据

| 模块             | 说明                                             |
| ---------------- | ------------------------------------------------ |
| **贵金属行情**   | 实时金价、银价 (Au/Ag)                           |
| **加密货币**     | BTC, ETH, BNB, SOL 等主流代币的 24h 价格、涨跌幅 |
| **恐惧贪婪指数** | 市场情绪指标                                     |

**高可用设计**：主接口 Binance API，备用 CoinGecko API，失败自动重试 + 降级切换。

### 📰 资讯聚合

| 模块 | 数据源 |
|------|--------|
| **加密货币新闻** | CryptoCompare / Coinpaprika |
| **AI 行业资讯** | TechCrunch, Wired AI, MIT Tech Review, Google AI Blog, OpenAI Blog, ArXiv CS.AI |
| **Agent Code 前沿** | GitHub Blog, Anthropic, OpenAI, Smol AI, Reddit, Lobste.rs, Hacker News, GitHub Trending |
| **V2EX 精选** | V2EX 热门话题（Hacker News 风格评分算法） |
| **宏观金融新闻** 🆕 | CNBC Markets, Reuters Business, Bloomberg Markets |
| **X/Twitter 热门** | Claude Code, Cursor AI, GitHub Copilot, Vibe Coding, LLM Agents, AI Code Assistant |
| **自动翻译** | 所有英文内容自动翻译为中文（并行优化）|

### 🤖 AI 智能功能

- **AI 锐评** 🆕：基于 LLM 对当日市场数据和资讯进行智能点评分析（支持多种风格）
- **AI 精选推荐**：从所有资讯中智能筛选最有价值的内容，并给出推荐理由
- **新闻亮点** 🆕：AI 自动识别当日最重要的头条新闻

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
- **HTTP Client**: Axios (带重试机制)
- **RSS Parser**: Cheerio
- **Translation**: google-translate-api-x (并行优化)
- **LLM**: OpenAI / OpenRouter 兼容 API
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
├── app.js                      # 程序入口
├── config/
│   ├── env.js                  # 环境变量管理
│   ├── modules.js              # 模块开关配置
│   ├── constants.js            # 全局配置常量 🆕
│   └── prompts.js              # LLM Prompt 配置 🆕
├── cache/
│   └── RSSEnhancedCache.js     # RSS 缓存机制 🆕
├── services/
│   ├── DailyReportGenerator.js # 日报生成器
│   ├── crypto/                 # 加密货币服务
│   ├── finance/                # 金融服务
│   ├── tech/                   # 科技资讯服务
│   │   ├── aiNews.js          # AI 行业资讯
│   │   ├── agentCodeNews.js   # Agent Code 前沿资讯
│   │   ├── v2exNews.js        # V2EX 精选
│   │   ├── xTwitterNews.js    # X/Twitter 热门
│   │   └── macroNews.js       # 宏观金融新闻 🆕
│   ├── llm/
│   │   ├── LLMService.js      # LLM 服务
│   │   └── NewsHighlightsService.js  # 新闻亮点服务 🆕
│   └── notification/          # 通知服务
└── utils/
    ├── http.js                 # HTTP 客户端 (重试优化) 🆕
    ├── translation.js         # 并行翻译工具 🆕
    ├── performance.js         # 性能监控工具 🆕
    ├── logger.js              # 结构化日志 🆕
    ├── common.js              # 通用工具
    └── formatters/            # 格式化工具
        ├── DingTalkMarkdownUtils.js
        ├── AiNewsFormatter.js
        ├── AgentCodeFormatter.js
        ├── V2exFormatter.js
        ├── XTwitterFormatter.js
        ├── MacroFormatter.js   # 宏观新闻格式化器 🆕
        └── NewsHighlightsFormatter.js  # 新闻亮点格式化器 🆕
```

---

## ⚙️ 模块配置

通过环境变量灵活控制启用/禁用各功能模块：

| 变量                           | 默认  | 说明                |
| ------------------------------ | ----- | ------------------- |
| `MODULE_GOLD`                 | true  | 贵金属行情          |
| `MODULE_CRYPTO`               | true  | 加密货币行情        |
| `MODULE_AI_NEWS`              | true  | AI 科技资讯         |
| `MODULE_AGENT_CODE`           | true  | Agent Code 前沿资讯 |
| `MODULE_V2EX`                 | true  | V2EX 精选           |
| `MODULE_MACRO_NEWS`           | true  | 宏观金融新闻 🆕      |
| `MODULE_X_TWITTER`            | false | X/Twitter 热门      |
| `MODULE_NEWS_HIGHLIGHTS`      | true  | AI 新闻亮点 🆕      |
| `MODULE_AI_RECOMMENDATIONS`   | true  | AI 精选推荐         |
| `MODULE_LLM_COMMENTARY`       | true  | LLM 智能锐评        |
| `MODULE_WEATHER`              | false | 天气预报            |
| `MODULE_QUOTE`                | false | 每日一言           |

### AI 配置 🆕

| 变量                    | 默认      | 说明                     |
| ---------------------- | --------- | ------------------------ |
| `LLM_API_KEY`          | -         | LLM API 密钥             |
| `LLM_BASE_URL`         | OpenRouter| LLM API 基础 URL       |
| `LLM_MODEL`             | gpt-4o-mini| LLM 模型                |
| `LLM_COMMENTARY_STYLE`  | humor     | 评论风格 (humor/professional/concise) |

### 性能配置 🆕

| 变量                     | 默认  | 说明               |
| ------------------------ | ----- | ------------------ |
| `TRANSLATION_BATCH_SIZE` | 5     | 翻译批次大小       |
| `TRANSLATION_DELAY`      | 200   | 翻译延迟 (ms)      |
| `RSS_CACHE_TTL`          | 900   | RSS 缓存时间 (秒)   |
| `ENABLE_PERF_LOG`        | false | 启用性能日志       |
| `NODE_ENV`               | -     | 环境模式           |

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

## 📝 示例输出

```
# 每日播报

_3月24日 周一_

---

## 📌 今日头条
> _AI 识别的重要市场动态_

1. **[美联储暗示降息时间表提前](https://...)** - 加息周期可能结束
2. **[OpenAI 发布 GPT-5 预览版](https://...)** - 多模态能力大幅提升

---

## 🏆 今日金价

---

## 💰 加密行情

---

## 🏛️ 宏观要闻
> _美联储 · 加息 · 通胀 · GDP_

- **[美联储纪要：通胀正在放缓](https://cnbc.com/...)**
> 央行官员表示...
> *CNBC Markets · 2小时前*

---

## 🤖 AI 前沿资讯
> _大模型动态 · 研究前沿 · 行业新闻_

---

## 👨‍💻 Agent Code 前沿
> _AI编程助手 · Vibe Coding · 热门项目_

---

## 🇻🇳 V2EX 精选
> _技术社区热点 · 开发者话题_

---

## ⭐ AI 精选推荐

1. **[Claude 3.5 Sonnet 发布](https://...)**
   _Anthropic_ · 💡 编码能力大幅提升，原生支持 Agent 模式

---

## 🎯 AI 锐评
> _基于今日数据的市场洞察与建议_
> 今日市场情绪偏向贪婪，但宏观面传来降息信号...
```

---

## 🚀 版本特性 (v2.0)

### 🆕 新增功能

- **宏观金融新闻模块** - 追踪美联储、加息、通胀等影响市场的宏观因素
- **新闻亮点 AI 识别** - 自动筛选当日最重要的头条新闻
- **多风格 AI 评论** - 支持幽默、专业、简洁三种评论风格
- **并行翻译优化** - 翻译速度提升 60%+
- **HTTP 重试机制** - 自动重试 + 指数退避，提高可靠性
- **RSS 缓存机制** - 减少 80% 重复请求
- **性能监控工具** - 可视化各模块耗时

### 📊 内容覆盖

- **加密货币市场** - BTC、ETH、SOL 等主流代币实时行情
- **AI 行业动态** - 大模型、Agent Code、开发者工具前沿
- **宏观金融** - 美联储政策、加息、通胀、GDP 等
- **技术社区** - V2EX、Hacker News、GitHub Trending
- **社交媒体** - X/Twitter 技术圈热门讨论
- **智能分析** - AI 锐评 + 精选推荐 + 新闻亮点

### ⚡ 性能提升

| 优化项 | 提升幅度 |
|--------|----------|
| 并行翻译 | ~60% |
| LLM 并行调用 | ~50% |
| RSS 缓存 | ~80% (后续运行) |
| **总体** | **~40%** |

### 🔧 代码质量改进

- 配置集中化（所有魔法数字提取到配置文件）
- 结构化日志（统一的日志接口）
- 格式化器重构（支持对象参数，向后兼容）
- 数据验证（LLM 在数据不足时跳过生成）

---

## 📜 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。

---

## 📄 License

MIT
