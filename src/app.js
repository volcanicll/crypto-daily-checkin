const coinGeckoService = require("./services/checkin/coinGecko");
const coinMarketService = require("./services/checkin/coinMarket");
const wxBotService = require("./services/notification/wxBot/WxBotService");
const groupBotService = require("./services/notification/groupBot/GroupBotService");
const telegramBotService = require("./services/notification/telegram/TelegramBotService");
const dingTalkBotService = require("./services/notification/dingtalk/DingTalkBotService");
const { getCurrentDayOfWeek } = require("./utils/date");
const { formatCheckInResult } = require("./utils/message");
const dailyReportGenerator = require("./services/DailyReportGenerator");

async function run() {
  console.log("开始执行日报内容生成...");

  try {
    // 执行签到
    // const checkInResults = {
    //   CoinGecko: await coinGeckoService.checkIn(),
    //   CoinMarket: await coinMarketService.checkIn(),
    // };

    // 准备消息内容
    const dailyMessage = await dailyReportGenerator.generateDailyMessage();

    const messageContent = `${dailyMessage}\n`;

    await Promise.all([
      // wxBotService.sendMessage({
      //   msgtype: "text",
      //   text: { content: messageContent },
      // }),
      // groupBotService.sendMarkdown(messageContent),
      dingTalkBotService.sendMarkdown("每日播报", messageContent),
      telegramBotService.sendMessage(messageContent),
    ]);

    console.log("执行完成！");
  } catch (error) {
    console.error("执行出错：", error);
  }
}

// 运行主函数
run();
