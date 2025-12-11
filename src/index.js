// import chalk from "chalk";
// const chalk = require("chalk");
const dailyReportGenerator = require("./services/DailyReportGenerator");

async function sendDailyMessage() {
  try {
    const message = await dailyReportGenerator.generateDailyMessage("北京"); // 可以配置城市
    await sendMessage(message);
  } catch (error) {
    console.error("生成或发送消息失败:", error);
  }
}

const testFun = async () => {
  // Only for testing parts if needed, but generateDailyMessage covers all.
  // We can expose individual methods if needed, but for now just showing usage of main generator.
  const message = await dailyReportGenerator.generateDailyMessage("重庆");
  console.log(message);
};

testFun();
