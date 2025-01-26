const coinGeckoService = require("./services/checkin/coinGecko");
const coinMarketService = require("./services/checkin/coinMarket");
const wxBotService = require("./services/notification/wxBot/WxBotService");
const groupBotService = require("./services/notification/groupBot/GroupBotService");
const { getCurrentDayOfWeek } = require("./utils/date");
const { formatCheckInResult } = require("./utils/message");
const { generateDailyMessage } = require("./utils/contentGenerator");

async function run() {
  console.log("开始执行自动签到...");

  try {
    // 执行签到
    // const checkInResults = {
    //   CoinGecko: await coinGeckoService.checkIn(),
    //   CoinMarket: await coinMarketService.checkIn(),
    // };

    // 准备消息内容
    // const checkInResultText = formatCheckInResult(checkInResults);
    const dayOfWeek = getCurrentDayOfWeek();

    // 获取天气和情话内容
    const dailyMessage = await generateDailyMessage("北京");

    // 组合所有内容
    const messageContent = `${dailyMessage}\n\n${dayOfWeek}了`;

    // 发送通知
    const messageConfig = {
      msgtype: "text",
      text: { content: messageContent },
    };

    await Promise.all([
      wxBotService.sendMessage(messageConfig),
      // groupBotService.sendMessage(messageConfig),
    ]);

    console.log("执行完成！");
  } catch (error) {
    console.error("执行出错：", error);
  }
}

// 运行主函数
run();
