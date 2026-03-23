# Crypto Daily Check-in - 高级功能设计文档

**项目**: 加密货币日报推送机器人增强功能
**日期**: 2026-03-23
**状态**: 设计阶段

---

## 📋 概述

本文档描述为 Crypto Daily Check-in 项目新增的一体化高级功能，包括：

1. **个性化订阅系统** - 用户可订阅特定币种、关键词、内容源
2. **价格预警功能** - 基于阈值的价格/涨跌幅预警
3. **价格趋势追踪** - 历史价格数据存储与趋势分析
4. **周期性报告** - 每周/每月市场汇总报告
5. **扩展内容源** - 宏观金融、Web3 生态、开发者工具资讯

**约束条件**:
- 部署在 GitHub Actions，无自建数据库
- 不使用付费服务
- 利用 GitHub Issues 作为数据存储

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Actions 环境                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  定时任务    │  │  workflow    │  │  artifacts   │       │
│  │  - 日报推送  │  │  dispatch    │  │  (临时存储)  │       │
│  │  - 价格预警  │  │  (手动触发)  │  │              │       │
│  │  - 周期报告  │  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Issues 数据库                     │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  Issue Type      │  │  用途            │                 │
│  │  (Label)         │  │                  │                 │
│  ├──────────────────┼──────────────────┤                 │
│  │ type:subscription │  用户订阅配置     │                 │
│  │ type:alert-rule   │  价格预警规则     │                 │
│  │ type:price-history│  历史价格数据     │                 │
│  │ type:weekly-report│  周报记录         │                 │
│  │ type:monthly-     │  月报记录         │                 │
│  │       report      │                  │                 │
│  └──────────────────┘  └──────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                        业务服务层                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ 订阅管理 │ │ 价格监控 │ │ 资讯聚合 │ │ 数据分析 │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 模块设计

### 1. GitHubStorage 模块

统一的 GitHub API 存储封装。

**接口**:

```javascript
class GitHubStorage {
  /**
   * 创建 Issue
   * @param {string} type - Issue 类型 (subscription, alert-rule, etc.)
   * @param {object} data - 要存储的 JSON 数据
   * @param {string} title - Issue 标题（可选，默认生成）
   */
  async create(type, data, title)

  /**
   * 查询 Issues
   * @param {string} type - Issue 类型
   * @param {object} filters - 过滤条件 {userId, state, etc.}
   */
  async find(type, filters = {})

  /**
   * 更新 Issue
   * @param {number} issueNumber - Issue 编号
   * @param {object} data - 新的 JSON 数据
   */
  async update(issueNumber, data)

  /**
   * 删除 Issue (关闭)
   * @param {number} issueNumber - Issue 编号
   */
  async delete(issueNumber)

  /**
   * 添加评论
   * @param {number} issueNumber - Issue 编号
   * @param {string} comment - 评论内容
   */
  async addComment(issueNumber, comment)

  /**
   * 带重试的请求（处理速率限制）
   * @private
   */
  async _requestWithRetry(endpoint, options, retries = 3)
}
```

**Issue Label 规范**:

| Label | 用途 |
|-------|------|
| `type:subscription` | 用户订阅配置 |
| `type:alert-rule` | 价格预警规则 |
| `type:price-history` | 历史价格数据 |
| `type:weekly-report` | 周报记录 |
| `type:monthly-report` | 月报记录 |
| `env:production` | 生产环境数据 |
| `env:testing` | 测试环境数据 |

---

### 2. SubscriptionService - 订阅管理

**数据结构**:

```json
{
  "userId": "telegram_chat_id",
  "subscriptions": {
    "coins": ["BTC", "ETH", "SOL"],
    "keywords": ["AI", "Agent", "LLM"],
    "sources": ["crypto", "ai-news", "agent-code", "macro", "web3", "dev-tools"]
  },
  "createdAt": "2026-01-12T00:00:00Z",
  "updatedAt": "2026-01-12T00:00:00Z"
}
```

**接口**:

```javascript
class SubscriptionService {
  /**
   * 获取用户订阅
   * @param {string} userId - Telegram Chat ID
   * @returns {object|null} 订阅配置或 null
   */
  async getSubscription(userId)

  /**
   * 创建/更新订阅
   * @param {string} userId - Telegram Chat ID
   * @param {object} subscriptions - 订阅配置
   */
  async updateSubscription(userId, subscriptions)

  /**
   * 删除订阅
   * @param {string} userId - Telegram Chat ID
   */
  async deleteSubscription(userId)

  /**
   * 添加币种订阅
   * @param {string} userId - Telegram Chat ID
   * @param {string[]} coins - 币种列表
   */
  async addCoins(userId, coins)

  /**
   * 移除币种订阅
   * @param {string} userId - Telegram Chat ID
   * @param {string[]} coins - 币种列表
   */
  async removeCoins(userId, coins)

  /**
   * 获取所有订阅用户（用于推送）
   * @returns {Array} 用户订阅列表
   */
  async getAllSubscribers()
}
```

---

### 3. AlertService - 价格预警

**数据结构**:

```json
{
  "userId": "telegram_chat_id",
  "rules": [
    {
      "id": "rule_001",
      "coin": "BTC",
      "type": "price_above",
      "threshold": 100000,
      "enabled": true,
      "createdAt": "2026-01-12T00:00:00Z",
      "triggeredAt": null,
      "triggerCount": 0
    }
  ]
}
```

**预警类型**:

| Type | 说明 | 示例 |
|------|------|------|
| `price_above` | 价格高于阈值 | BTC > $100,000 |
| `price_below` | 价格低于阈值 | ETH < $3,000 |
| `change_above` | 涨幅高于阈值 | SOL 24h > 10% |
| `change_below` | 跌幅低于阈值 | BNB 24h < -5% |

**接口**:

```javascript
class AlertService {
  /**
   * 添加预警规则
   * @param {string} userId - Telegram Chat ID
   * @param {object} rule - 预警规则
   * @returns {string} 规则 ID
   */
  async addRule(userId, rule)

  /**
   * 删除预警规则
   * @param {string} userId - Telegram Chat ID
   * @param {string} ruleId - 规则 ID
   */
  async removeRule(userId, ruleId)

  /**
   * 获取用户的所有规则
   * @param {string} userId - Telegram Chat ID
   */
  async getUserRules(userId)

  /**
   * 检查所有规则（每小时执行）
   */
  async checkAllRules()

  /**
   * 检查单个规则
   * @param {string} userId - Telegram Chat ID
   * @param {object} rule - 预警规则
   * @param {object} currentData - 当前市场数据
   * @returns {boolean} 是否触发
   */
  async _checkRule(userId, rule, currentData)

  /**
   * 发送预警通知
   * @param {string} userId - Telegram Chat ID
   * @param {object} rule - 触发的规则
   * @param {object} currentData - 当前数据
   */
  async sendAlert(userId, rule, currentData)

  /**
   * 记录触发事件（作为 Issue 评论）
   * @param {number} issueNumber - Issue 编号
   * @param {object} triggerData - 触发数据
   */
  async logTrigger(issueNumber, triggerData)
}
```

---

### 4. PriceHistoryService - 价格历史

**数据结构**:

```json
{
  "date": "2026-01-12",
  "prices": {
    "BTC": {"price": 98500, "change24h": 2.35, "volume": 50000000000},
    "ETH": {"price": 3200, "change24h": 1.5, "volume": 20000000000}
  },
  "marketData": {
    "fearGreedIndex": 72,
    "goldPrice": 625.50,
    "silverPrice": 7.2
  }
}
```

**接口**:

```javascript
class PriceHistoryService {
  /**
   * 存储当日价格数据
   * @param {string} date - 日期 YYYY-MM-DD
   * @param {object} data - 价格数据
   */
  async saveDailyData(date, data)

  /**
   * 获取历史价格
   * @param {string[]} coins - 币种列表
   * @param {number} days - 天数
   * @returns {object} 历史数据
   */
  async getHistory(coins, days)

  /**
   * 获取日期范围的数据
   * @param {string} startDate - 开始日期
   * @param {string} endDate - 结束日期
   */
  async getHistoryByRange(startDate, endDate)

  /**
   * 计算 N 日涨跌幅
   * @param {string} coin - 币种
   * @param {number} days - 天数
   * @returns {number} 涨跌幅百分比
   */
  async calculateChange(coin, days)

  /**
   * 获取最新数据日期
   * @returns {string} 最新日期 YYYY-MM-DD
   */
  async getLatestDate()
}
```

---

### 5. ReportService - 周期性报告

**报告类型**:

| 类型 | 频率 | 触发时间 |
|------|------|----------|
| 周报 | 每周 | 每周一 9:00 |
| 月报 | 每月 | 每月 1 号 9:00 |

**接口**:

```javascript
class ReportService {
  /**
   * 生成周报
   * @param {string} week - 周数 YYYY-Www
   * @returns {object} 报告数据
   */
  async generateWeeklyReport(week)

  /**
   * 生成月报
   * @param {string} month - 月份 YYYY-MM
   * @returns {object} 报告数据
   */
  async generateMonthlyReport(month)

  /**
   * 保存报告到 GitHub Issue
   * @param {string} type - weekly/monthly
   * @param {string} period - 周数/月份
   * @param {object} report - 报告数据
   */
  async saveReport(type, period, report)

  /**
   * 推送报告给所有订阅用户
   * @param {string} type - weekly/monthly
   * @param {object} report - 报告数据
   */
  async pushReport(type, report)

  /**
   * 格式化周报为 Markdown
   * @param {object} report - 报告数据
   * @returns {string} Markdown 文本
   */
  formatWeeklyReport(report)

  /**
   * 格式化月报为 Markdown
   * @param {object} report - 报告数据
   * @returns {string} Markdown 文本
   */
  formatMonthlyReport(report)
}
```

**报告结构**:

```markdown
# 📊 周报 2026-W2 (2026-01-06 ~ 2026-01-12)

## 💰 市场概览
| 币种 | 开盘价 | 收盘价 | 最高价 | 最低价 | 涨跌幅 |
|------|--------|--------|--------|--------|--------|
| BTC | $95,000 | $98,500 | $99,200 | $94,500 | +3.68% |

## 📈 价格走势
- **BTC**: 周二触及 $97,000 高点后回调，周五突破 $98,000
- **ETH**: 稳步上涨，突破 $3,200 阻力位

## 🎯 市场情绪
恐惧贪婪指数: 68 → 72 (贪婪)

## 📰 本周要闻
### 🏆 宏观经济
1. [美联储纪要暗示暂停加息](https://...)
   _Bloomberg · 市场预期转向宽松_

### 🎮 Web3 生态
2. [Solana Mobile II 宣布](https://...)
   _CoinDesk · 推动加密手机普及_

### 💻 开发者工具
3. [Next.js 15 发布候选版](https://...)
   _GitHub Blog · 性能大幅提升_

## 🎯 AI 锐评
> 本周市场整体呈现上涨趋势，宏观经济环境改善...

---
*生成时间: 2026-01-13 09:00*
```

---

### 6. 新增内容源 Service

#### 6.1 MacroNewsService - 宏观金融

**数据源**:
- Bloomberg Markets RSS
- Reuters Business News
- WSJ Markets

**过滤关键词**: Fed, interest rate, inflation, GDP, unemployment, recession, treasury, yield curve

**接口**:

```javascript
class MacroNewsService {
  /**
   * 获取宏观经济新闻
   * @param {number} limit - 条数限制
   * @returns {Array} 新闻列表
   */
  async getNews(limit = 5)
}
```

#### 6.2 Web3NewsService - Web3 生态

**数据源**:
- CoinDesk RSS
- TheBlock Crypto RSS
- Decrypt

**过滤关键词**: DeFi, NFT, GameFi, Layer2, zk, rollup, bridge, wallet, dApp

**接口**:

```javascript
class Web3NewsService {
  /**
   * 获取 Web3 生态新闻
   * @param {number} limit - 条数限制
   * @returns {Array} 新闻列表
   */
  async getNews(limit = 5)
}
```

#### 6.3 DevToolsNewsService - 开发者工具

**数据源**:
- GitHub Blog (Changelog)
- Hacker News
- Dev.to

**过滤关键词**: React, Next.js, TypeScript, Vite, Bun, Deno, Node.js, Rust

**接口**:

```javascript
class DevToolsNewsService {
  /**
   * 获取开发者工具资讯
   * @param {number} limit - 条数限制
   * @returns {Array} 新闻列表
   */
  async getNews(limit = 5)
}
```

---

### 7. Telegram 命令处理器

**新增命令**:

| 命令 | 功能 | 示例 |
|------|------|------|
| `/sub` | 查看当前订阅 | `/sub` |
| `/sub_coin` | 订阅币种 | `/sub_coin BTC ETH SOL` |
| `/unsub_coin` | 取消订阅币种 | `/unsub_coin DOGE` |
| `/sub_source` | 订阅内容源 | `/sub_source macro web3` |
| `/unsub_source` | 取消订阅内容源 | `/unsub_source ai-news` |
| `/alert_add` | 添加价格预警 | `/alert_add BTC > 100000` |
| `/alert_add_change` | 添加涨跌幅预警 | `/alert_add_change ETH > 5` |
| `/alert_list` | 查看预警规则 | `/alert_list` |
| `/alert_remove` | 删除预警规则 | `/alert_remove rule_001` |
| `/trend` | 查看价格趋势 | `/trend BTC 7` |
| `/report` | 获取周期报告 | `/report weekly` |

**接口**:

```javascript
class TelegramCommandHandler {
  /**
   * 处理 /sub 命令
   */
  async handleSubscribe(chatId, args)

  /**
   * 处理 /sub_coin 命令
   */
  async handleSubscribeCoin(chatId, args)

  /**
   * 处理 /alert_add 命令
   */
  async handleAlertAdd(chatId, args)

  /**
   * 处理 /trend 命令
   */
  async handleTrend(chatId, args)

  /**
   * 处理 /report 命令
   */
  async handleReport(chatId, args)
}
```

---

## 📁 项目结构

```
src/
├── app.js                                # 入口
├── index.js                              # 现有入口（保留兼容）
├── config/
│   ├── env.js                            # 环境变量
│   ├── modules.js                        # 模块开关
│   └── constants.js                      # 常量
├── storage/
│   └── GitHubStorage.js                  # GitHub API 存储封装
├── services/
│   ├── DailyReportGenerator.js           # 日报生成器（增强）
│   ├── subscription/
│   │   └── SubscriptionService.js        # 订阅管理
│   ├── alert/
│   │   └── AlertService.js               # 价格预警
│   ├── history/
│   │   └── PriceHistoryService.js        # 价格历史
│   ├── report/
│   │   └── ReportService.js              # 周期性报告
│   ├── crypto/                           # 现有加密货币服务
│   ├── finance/                          # 现有金融服务
│   ├── tech/                             # 现有科技资讯
│   │   ├── aiNews.js
│   │   ├── agentCodeNews.js
│   │   ├── v2exNews.js
│   │   ├── xTwitterNews.js
│   │   ├── macroNews.js                  # 新增
│   │   ├── web3News.js                   # 新增
│   │   └── devToolsNews.js               # 新增
│   ├── llm/                              # LLM 服务
│   └── notification/                     # 通知服务
│       └── telegram/
│           └── TelegramCommandHandler.js # 新增：命令处理
└── utils/
    └── formatters/                       # 格式化工具
        ├── WeeklyReportFormatter.js      # 新增
        ├── MonthlyReportFormatter.js     # 新增
        ├── TrendFormatter.js             # 新增
        └── ...
```

---

## 🔄 数据流程

### 日报推送流程（增强版）

```
GitHub Actions 定时触发 (每日 9:00)
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. 获取所有用户订阅 (GitHub Issues - type:subscription)      │
│ 2. 获取各来源资讯                                           │
│    - 现有: crypto, ai-news, agent-code, v2ex, x-twitter     │
│    - 新增: macro, web3, dev-tools                           │
│ 3. 获取当前市场数据                                          │
│ 4. 保存当日价格到历史 (type:price-history)                   │
│ 5. 根据用户订阅过滤内容                                      │
│ 6. AI 精选推荐 + 锐评                                        │
│ 7. 按用户个性化推送                                          │
└─────────────────────────────────────────────────────────────┘
```

### 价格预警流程

```
GitHub Actions 定时触发 (每小时)
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. 获取所有预警规则 (GitHub Issues - type:alert-rule)        │
│ 2. 获取当前价格数据                                          │
│ 3. 遍历规则，检查触发条件                                    │
│ 4. 触发的规则：                                             │
│    - 发送 Telegram 通知                                      │
│    - 记录到 Issue 评论                                       │
│    - 更新触发计数                                            │
└─────────────────────────────────────────────────────────────┘
```

### 周报生成流程

```
GitHub Actions 定时触发 (每周一 9:00)
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. 获取上周价格历史数据                                      │
│ 2. 计算周涨跌幅、最高/最低价                                 │
│ 3. 获取上周要闻 (从历史记录聚合)                             │
│ 4. 生成 AI 锐评                                             │
│ 5. 格式化周报                                               │
│ 6. 保存到 GitHub Issue (type:weekly-report)                 │
│ 7. 推送给所有订阅用户                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ 环境变量

### 新增环境变量

```env
# === GitHub 存储配置 ===
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxx           # GitHub Personal Access Token
GITHUB_REPO_OWNER=your_username           # 仓库所有者
GITHUB_REPO_NAME=crypto-daily-checkin     # 仓库名称

# === 功能开关 ===
# 订阅系统
MODULE_SUBSCRIPTION=true                  # 订阅管理

# 价格预警
MODULE_ALERT=true                         # 价格预警

# 价格历史
MODULE_PRICE_HISTORY=true                 # 价格历史

# 周期报告
MODULE_WEEKLY_REPORT=true                 # 周报
MODULE_MONTHLY_REPORT=true                # 月报

# 新内容源
MODULE_MACRO_NEWS=true                    # 宏观金融
MODULE_WEB3_NEWS=true                     # Web3 生态
MODULE_DEV_TOOLS_NEWS=true                # 开发者工具

# === 兼容现有功能 ===
# 保留所有现有环境变量
```

### GitHub Token 权限要求

创建 Personal Access Token 时需要以下权限：
- `repo` (完整仓库访问)
- `issues` (读写 Issues)

---

## 🚀 GitHub Actions Workflows

### 1. 日报推送（增强版）

```yaml
# .github/workflows/daily-report.yml
name: Daily Report
on:
  schedule:
    - cron: '0 1 * * *'  # 每日 9:00 北京时间
  workflow_dispatch:

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - run: bun install
      - name: Generate Daily Report
        run: bun run daily-report
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 2. 价格预警

```yaml
# .github/workflows/price-alert.yml
name: Price Alert
on:
  schedule:
    - cron: '0 * * * *'  # 每小时
  workflow_dispatch:

jobs:
  alert:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - with:
          bun-version: latest
      - run: bun install
      - name: Check Price Alerts
        run: bun run price-alert
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 3. 周报

```yaml
# .github/workflows/weekly-report.yml
name: Weekly Report
on:
  schedule:
    - cron: '0 1 * * 1'  # 每周一 9:00
  workflow_dispatch:

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - run: bun install
      - name: Generate Weekly Report
        run: bun run weekly-report
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 4. 月报

```yaml
# .github/workflows/monthly-report.yml
name: Monthly Report
on:
  schedule:
    - cron: '0 1 1 * *'  # 每月 1 号 9:00
  workflow_dispatch:

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - run: bun install
      - name: Generate Monthly Report
        run: bun run monthly-report
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 📦 package.json 更新

```json
{
  "scripts": {
    "start": "bun src/index.js",
    "dev": "bun --watch src/index.js",
    "daily-report": "bun src/scripts/daily-report.js",
    "price-alert": "bun src/scripts/price-alert.js",
    "weekly-report": "bun src/scripts/weekly-report.js",
    "monthly-report": "bun src/scripts/monthly-report.js"
  }
}
```

---

## 🔐 错误处理与容错

### GitHub API 速率限制

```javascript
class GitHubStorage {
  async _requestWithRetry(endpoint, options, retries = 3) {
    try {
      return await this._request(endpoint, options);
    } catch (error) {
      // 速率限制：403
      if (error.status === 403) {
        const retryAfter = error.headers['retry-after'];
        if (retryAfter && retries > 0) {
          await this._wait(parseInt(retryAfter) * 1000);
          return this._requestWithRetry(endpoint, options, retries - 1);
        }
      }
      throw error;
    }
  }

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 降级策略

| 场景 | 降级处理 |
|------|----------|
| GitHub API 失败 | 记录日志，使用 workflow artifacts 临时存储 |
| 新内容源请求失败 | 跳过该源，继续其他源，记录警告 |
| 价格预警检查失败 | 记录日志，下次继续 |
| 报告生成失败 | 记录日志，不阻塞下次运行 |

---

## 🧪 测试策略

### 单元测试

```bash
tests/
├── unit/
│   ├── storage/
│   │   └── GitHubStorage.test.js
│   ├── services/
│   │   ├── SubscriptionService.test.js
│   │   ├── AlertService.test.js
│   │   ├── PriceHistoryService.test.js
│   │   └── ReportService.test.js
│   └── utils/
│       └── formatters.test.js
```

### 集成测试

使用测试仓库进行 GitHub API 集成测试。

---

## 📋 开发任务清单

### Phase 1: 基础设施
- [ ] GitHubStorage 模块
  - [ ] Issue CRUD 操作
  - [ ] Label 管理
  - [ ] 速率限制处理
- [ ] 环境变量配置
- [ ] package.json 脚本更新

### Phase 2: GitHub Actions 配置
- [ ] daily-report workflow
- [ ] price-alert workflow
- [ ] weekly-report workflow
- [ ] monthly-report workflow

### Phase 3: 订阅系统
- [ ] SubscriptionService
- [ ] Telegram 命令处理器
- [ ] 日报个性化推送逻辑
- [ ] 订阅格式化器

### Phase 4: 价格预警
- [ ] AlertService
- [ ] 价格检查定时任务
- [ ] 预警通知推送
- [ ] 预警格式化器

### Phase 5: 历史与报告
- [ ] PriceHistoryService
- [ ] ReportService（周报/月报）
- [ ] 周报格式化器
- [ ] 月报格式化器
- [ ] 趋势格式化器

### Phase 6: 新内容源
- [ ] MacroNewsService
- [ ] Web3NewsService
- [ ] DevToolsNewsService
- [ ] 内容源格式化器

### Phase 7: 测试与文档
- [ ] 单元测试
- [ ] 集成测试
- [ ] README 更新
- [ ] CHANGELOG 更新

---

## 🔄 兼容性保证

### 向后兼容

1. **现有日报逻辑保持不变**
   - 未配置订阅的用户收到默认推送
   - 现有格式化器继续工作

2. **环境变量兼容**
   - 新增功能通过环境变量控制
   - 缺少新变量时不影响现有功能

3. **代码结构兼容**
   - 保留 `src/index.js` 作为现有入口
   - 新功能独立模块，不侵入现有代码

---

## 📊 性能考虑

### GitHub API 优化

1. **批量查询**: 使用 GitHub API 的 search 功能批量查询 Issues
2. **缓存**: 对频繁访问的数据进行短期缓存
3. **并发控制**: 限制并发请求数，避免触发速率限制

### Issue 管理

1. **定期清理**: 对历史数据进行定期归档/清理
2. **单 Issue 多数据**: 将同类型数据存储在单个 Issue 中，减少 Issue 数量

---

## 📝 后续优化方向

1. **Web 界面**: 添加简单的 Web UI 用于配置管理
2. **更多通知渠道**: 支持 Discord、Slack 等
3. **高级分析**: 添加技术指标分析（MA、RSI 等）
4. **社区功能**: 允许用户分享订阅配置

---

**文档状态**: 待审核
**下一步**: 编写实现计划
