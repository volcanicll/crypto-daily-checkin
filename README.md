# 自动签到助手

一个自动执行加密货币平台签到并发送通知的工具。

## 功能特性

- 支持多平台自动签到
  - [CoinGecko](https://www.coingecko.com)
  - [CoinMarketCap](https://coinmarketcap.com)
- 签到结果通知
  - 企业微信应用消息
  - 企业微信群机器人

## 目录结构

```
├── src/                    # 源代码目录
│   ├── config/            # 配置文件目录
│   ├── services/          # 业务服务目录
│   │   ├── checkin/       # 签到相关服务
│   │   └── notification/  # 通知相关服务
│   ├── utils/             # 工具函数
│   └── app.js            # 应用入口文件
├── .env                   # 环境变量
└── README.md             # 项目文档
```

## 环境变量配置

需要在 `.env` 文件中配置以下环境变量：

```env
# CoinGecko
COINGECKO_COOKIE=
COINGECKO_TOKEN=
COINGECKO_AUTH_TOKEN=

# CoinMarketCap
COINMARKET_COOKIE=
COINMARKET_TOKEN=

# 企业微信应用
WX_COMPANY_ID=
WX_APP_ID=
WX_APP_SECRET=

# 企业微信群机器人
BOT_KEY=
```

## 使用方法

1. 安装依赖

```bash
npm install
```

2. 配置环境变量
   复制 `.env.example` 文件为 `.env`，并填入相应的配置值。

3. 运行程序

```bash
node src/app.js
```

## 自动化运行

可以使用 GitHub Actions 或其他定时任务工具实现自动运行。
