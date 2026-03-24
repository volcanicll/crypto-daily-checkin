# 更新日志

## [2026-03-24] v2.0 重大更新 - TechDaily 重塑 🚀

> **项目重命名**: `crypto-daily-checkin` → `tech-daily`

**重命名背景**: 随着项目内容从单纯的加密货币扩展到 AI 资讯、宏观金融、技术社区等多个科技领域，原名已不能准确反映项目定位。

新名称 **TechDaily** 更好地概括了项目的核心价值：每日科技资讯摘要。

### 🆕 新增功能

#### 内容扩展
- **宏观金融新闻模块**
  - 新增 CNBC Markets、Reuters Business、Bloomberg Markets 等数据源
  - 自动过滤美联储、加息、通胀、GDP 等相关关键词
  - 独立的格式化器，统一的卡片样式

- **新闻亮点 AI 识别**
  - AI 自动扫描所有资讯，识别 3-5 条最重要的头条
  - 生成简短的"市场影响"说明
  - 置顶显示，突出关键信息

#### AI 功能增强
- **多风格 AI 评论**
  - 支持三种评论风格：幽默 (humor)、专业 (professional)、简洁 (concise)
  - 通过 `LLM_COMMENTARY_STYLE` 环境变量配置
  - Prompt 提取到独立配置文件，便于管理和版本控制

### ⚡ 性能优化

- **并行翻译优化**
  - 翻译速度提升 60%+（从串行改为批量并行）
  - 新增 TranslationCache 缓存已翻译内容
  - 可配置批次大小和延迟

- **LLM 并行调用**
  - AI 评论和 AI 推荐 并行执行
  - 节省 3-5 秒处理时间

- **RSS 缓存机制**
  - 15分钟 TTL，减少 80% 重复请求
  - 支持 GitHub Actions 环境的持久化

- **HTTP 重试机制**
  - 自动重试（最多 3 次）+ 指数退避
  - 智能判断可重试错误（429、5xx、超时等）
  - 提高网络异常情况下的可靠性

### 🔧 代码质量改进

- **配置集中化**
  - 新增 `src/config/constants.js` 统一管理所有配置常量
  - 消除硬编码的魔法数字
  - API、翻译、过滤、LLM、格式化等配置分离

- **结构化日志**
  - 新增 `src/utils/logger.js` 统一日志接口
  - 支持上下文、模块化日志记录
  - 可配置日志级别

- **性能监控**
  - 新增 `src/utils/performance.js` 性能监控工具
  - 跟踪各模块执行时间和耗时
  - 生成性能报告和慢操作分析

- **格式化器重构**
  - 所有格式化器支持对象参数（同时保持向后兼容）
  - 统一使用 EMOJI 常量
  - 新增通用工具函数 `truncateText()`
  - 优化时间格式为中文统一风格（刚刚、X分钟前、X小时前）

- **数据验证**
  - LLM 服务新增数据完整性检查
  - 数据不足时跳过 AI 评论生成，避免无意义输出
  - 优化 Prompt 构建，处理 undefined/NaN 等异常数据

### 📝 格式优化

- **V2EX 格式改进**
  - 新增 `cleanContent()` 函数移除 Markdown 标题格式
  - 并行获取 hot/latest 源
  - 来源格式简化为节点名称

- **时间格式统一**
  - 所有模块统一使用中文时间格式
  - X/Twitter 互动数据格式优化（万阅读、赞、转、评）

- **X/Twitter 格式改进**
  - 互动数据本地化显示
  - 元信息格式优化

### 🌐 新增环境变量

```env
# 内容模块
MODULE_MACRO_NEWS=true          # 宏观金融新闻
MODULE_NEWS_HIGHLIGHTS=true     # AI 新闻亮点

# AI 配置
LLM_COMMENTARY_STYLE=humor      # 评论风格: humor/professional/concise

# 性能配置
TRANSLATION_BATCH_SIZE=5        # 翻译批次大小
TRANSLATION_DELAY=200           # 翻译延迟(ms)
RSS_CACHE_TTL=900              # RSS 缓存时间(秒)

# 开发配置
NODE_ENV=production            # 环境变量
ENABLE_PERF_LOG=true           # 性能日志
```

### 📊 性能对比

| 指标 | v1.0 | v2.0 | 提升 |
|------|------|------|------|
| 翻译时间 | ~3s | ~1s | 67% ↓ |
| LLM 处理 | ~8s | ~4s | 50% ↓ |
| 总体运行 | ~15s | ~9s | 40% ↓ |

### 📂 新增文件

**配置**
- `src/config/constants.js` - 全局配置常量
- `src/config/prompts.js` - LLM Prompt 配置

**工具**
- `src/utils/translation.js` - 并行翻译工具
- `src/utils/performance.js` - 性能监控
- `src/utils/logger.js` - 结构化日志

**缓存**
- `src/cache/RSSEnhancedCache.js` - RSS 缓存

**服务**
- `src/services/tech/macroNews.js` - 宏观金融新闻
- `src/services/llm/NewsHighlightsService.js` - 新闻亮点服务

**格式化器**
- `src/utils/formatters/MacroFormatter.js` - 宏观新闻格式化器
- `src/utils/formatters/NewsHighlightsFormatter.js` - 新闻亮点格式化器

### 🔧 修改文件

**核心服务**
- `src/services/DailyReportGenerator.js` - 集成新模块 + LLM 并行调用
- `src/services/llm/LLMService.js` - 多风格评论支持 + 数据验证
- `src/services/tech/aiNews.js` - 使用并行翻译
- `src/services/tech/agentCodeNews.js` - 使用并行翻译
- `src/services/tech/v2exNews.js` - 并行获取 + 内容清理

**工具**
- `src/utils/http.js` - 重试机制 + 指数退避
- `src/utils/formatters/DingTalkMarkdownUtils.js` - 对象参数支持 + 时间格式优化
- `src/utils/formatters/V2exFormatter.js` - 格式优化
- `src/utils/formatters/XTwitterFormatter.js` - 格式优化
- `src/utils/formatters/AiNewsFormatter.js` - 使用 EMOJI 常量
- `src/utils/formatters/AgentCodeFormatter.js` - 使用 EMOJI 常量

**配置**
- `src/config/modules.js` - 新增 macro 和 newsHighlights 模块

---

## [2026-01-12] 功能更新

### 项目重命名说明 🔖

> 原项目名 `crypto-daily-checkin` 更名为 `tech-daily`
>
> 更名原因：项目从单纯的加密货币签到发展为涵盖 AI、宏观金融、技术社区的综合性科技日报。

### 新增功能

- **V2EX 每日摘要模块**

  - 集成 V2EX API 获取热门技术讨论
  - Hacker News 风格的时间衰减评分算法
  - 自动过滤无关节点（如 promotions）
  - 卡片式布局，带节点标签和回复数

- **X/Twitter 热门技术贴**

  - 聚合 Claude Code、Cursor AI、GitHub Copilot、Vibe Coding 等关键词
  - 质量过滤：浏览量 ≥ 10,000 且有回复
  - 本周发布内容过滤
  - 互动数据展示（浏览量、点赞、转发、评论）

- **Markdown 排版优化**

  - 统一使用 DingTalk Markdown 格式
  - 卡片式信息展示，层次分明
  - 引用块格式化元数据
  - 支持长消息自动分片

### 优化

- **统一格式化器接口**

  - 抽取 `DingTalkMarkdownUtils.js` 工具类
  - 所有 Formatter 使用统一的格式化方法
  - 新增 `cardItem()` 卡片式条目
  - 新增 `formatRelativeTime()` 相对时间格式化

- **内容过滤增强**

  - V2EX 排除广告节点
  - X/Twitter 质量和时间双重过滤
  - Agent Code 关键词过滤优化

### 新增环境变量

| 变量                     | 默认  | 说明                |
| ------------------------ | ----- | ------------------- |
| `MODULE_V2EX`            | true  | V2EX 每日摘要        |
| `MODULE_X_TWITTER`       | false | X/Twitter 热门技术贴 |
| `RAPID_API_KEY`          | -     | RapidAPI 密钥        |

### 文件结构变更

```
src/
├── services/
│   └── tech/
│       ├── v2exNews.js           # 新增 V2EX 服务
│       └── xTwitterNews.js       # 新增 X/Twitter 服务
└── utils/
    └── formatters/
        ├── V2exFormatter.js       # 新增 V2EX 格式化器
        └── XTwitterFormatter.js    # 新增 X/Twitter 格式化器
```

---

## [2025-12-18] 功能更新

### 新增功能

- **Agent Code 前沿资讯模块**

  - 聚合 GitHub Blog、Anthropic、OpenAI 官方博客
  - 抓取 GitHub Trending 热门 AI/ML 开源项目
  - 社区讨论：Reddit r/LocalLLaMA、r/MachineLearning、Lobste.rs、Hacker News
  - 开发者资讯：Dev.to AI、Echo JS
  - 智能关键词过滤（agent, copilot, cursor, vibe coding 等）

- **AI 精选推荐模块**
  - 收集所有资讯后发送给 LLM 进行价值评估
  - AI 从全部内容中筛选最有价值的 6 条
  - 每条推荐附带 AI 给出的推荐理由
  - 解决了简单限制来源条数可能遗漏重要消息的问题

### 优化

- **钉钉 Markdown 排版优化**

  - 新增 `DingTalkMarkdownUtils.js` 格式化工具类
  - 统一的模块标题格式 `## 🏆 标题`
  - 使用分隔线 `---` 优化视觉层级
  - 价格信息使用粗体高亮
  - 引用块格式化 AI 锐评

- **消息格式重构**
  - 各 Formatter 使用统一的格式化工具
  - 添加消息头部日期显示
  - 优化链接列表排版

### 新增环境变量

| 变量                        | 默认 | 说明                |
| --------------------------- | ---- | ------------------- |
| `MODULE_AGENT_CODE`         | true | Agent Code 前沿资讯 |
| `MODULE_AI_RECOMMENDATIONS` | true | AI 精选推荐         |

---

## [2025-12-18] 功能更新

### 新增功能

- **钉钉群机器人推送**
  - 支持加签 (HMAC-SHA256) 安全验证方式
  - 支持 Markdown 格式消息
  - 长消息自动分片发送
- **LLM 智能锐评**
  - 集成 OpenRouter / OpenAI 兼容格式 API
  - 每日自动生成市场分析与资讯点评

### 优化

- **模块化开关配置**
  - 通过环境变量灵活启用/禁用各功能模块
  - 支持通知渠道独立开关
- **消息分片机制**
  - 抽取通用 `messageSplitter` 工具函数
  - 钉钉/企业微信共享分片逻辑
- **README 文档**
  - 新增推送服务 Token 获取详细指南
  - 完善项目结构说明

---

## [2025-02-18] 功能更新

### 新增功能

- 迁移至 Bun 运行时环境
  - 显著提升运行性能和稳定性
  - 优化依赖管理和构建流程
  - 美化命令行输出效果
- 添加每日天气预报功能
  - 支持重庆地区天气信息查询
  - 显示温度、风向等详细信息
- 添加温馨话语功能
  - 每日随机发送暖心情话
  - 支持备用 API 自动切换
- 优化消息格式
  - 添加 emoji 表情
  - 更友好的展示方式

### 消息格式示例

```
崽崽早安！💖

【今日天气】
重庆 晴
🌡️ 温度：20℃ ~ 28℃
💨 风向：东南风 3级
💡 温馨提示：天气不错，适合出门走走

【温馨话语】
月亮不会奔向太阳，我却可以奔向你。

周三了
```

### 技术细节

- 使用 Bun 运行时环境
  - 更快的启动速度和执行效率
  - 内置的依赖管理和构建工具
  - 优化的异步处理机制
- 使用 vvhan API 获取天气数据
- 使用 lovelive.tools 和 uomg API 获取情话数据
- 完善的错误处理机制
- API 失败自动切换备用方案

### 注意事项

- 所有 API 均为免费公开接口
- 如遇到 API 访问失败会自动使用备用方案
- 消息发送失败会在控制台输出错误日志
