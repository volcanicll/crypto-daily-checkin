// import chalk from "chalk";
// const chalk = require("chalk");
const {
  generateDailyMessage,
  getLoveWords,
  getWeather,
} = require("./utils/contentGenerator");

async function sendDailyMessage() {
  try {
    const message = await generateDailyMessage("北京"); // 可以配置城市
    await sendMessage(message);
  } catch (error) {
    console.error("生成或发送消息失败:", error);
  }
}

const testFun = async () => {
  const loveWords = await getLoveWords();
  const weather = await getWeather("重庆");

  console.log(
    `${"💕 每日情话：" + loveWords}
  ${"🌤️ 天气预报：" + weather}`
  );
};

testFun();
