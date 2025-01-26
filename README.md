# Crypto Daily CheckIn

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
npm start
```

## 自动化运行

本项目使用 GitHub Actions 实现自动运行：

- 每天早上 7:30 自动执行
- 自动发送天气预报和问候语
- 无需手动干预

## 技术栈

- Node.js
- Axios：网络请求
- GitHub Actions：自动化运行
- 企业微信机器人 API

## API 来源

- 天气数据：vvhan API
- 情话数据：lovelive.tools 和 uomg API

## 注意事项

- 所有 API 均为免费公开接口
- 如遇到 API 访问失败会自动使用备用方案
- 消息发送失败会在控制台输出错误日志

## License

MIT License

# 每日推送机器人

一个简单的推送机器人，可以自动发送每日问候、天气预报和温馨话语。

## 功能特点

- 🌞 每日问候：随机选择温馨的问候语
- 🌤️ 天气预报：自动获取重庆地区天气信息
- 💝 温馨话语：每日一句暖心情话
- 📅 星期提醒：显示当前是星期几
- 🤖 企业微信机器人支持：支持发送到企业微信群

## 环境变量配置

需要在 `.env` 文件中配置以下环境变量：

```env
# 企业微信群机器人
GROUP_BOT_KEY=你的机器人key
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
npm start
```

## 自动化运行

本项目使用 GitHub Actions 实现自动运行，每天早上 7:30 自动执行。

## License

MIT License
