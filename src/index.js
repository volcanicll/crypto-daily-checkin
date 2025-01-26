const { generateDailyMessage } = require("./utils/contentGenerator");

async function sendDailyMessage() {
  try {
    const message = await generateDailyMessage("北京"); // 可以配置城市
    await sendMessage(message);
  } catch (error) {
    console.error("生成或发送消息失败:", error);
  }
}
