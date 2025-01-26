const axios = require("axios");
const { BASE_URL } = require("../config/constants");

// 统一的错误处理
const safeRequest = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error(`请求 ${url} 失败:`, error.message);
    return null;
  }
};

// 获取天气信息
async function getWeather(city = "北京") {
  const data = await safeRequest(
    `${BASE_URL.WEATHER}?city=${encodeURIComponent(city)}`
  );
  if (!data) return "【天气获取失败】";

  return `【今日天气】
${data.city} ${data.info.type}
🌡️ 温度：${data.info.low}℃ ~ ${data.info.high}℃
💨 风向：${data.info.fengxiang} ${data.info.fengli}
💡 温馨提示：${data.info.tip || "今天也要开开心心哦！"}`;
}

// 获取土味情话
async function getLoveWords() {
  const data = await safeRequest(BASE_URL.QINGHUA);
  if (!data) return "【情话获取失败】";

  return `【情话时间】
${data.ishan}`;
}

// 生成完整的每日消息
async function generateDailyMessage(city) {
  const greeting = getRandomGreeting();
  const parts = await Promise.all([getWeather(city), getLoveWords()]);

  return `${greeting}\n\n${parts.join("\n\n")}`;
}

// 从 GREETINGS 中随机获取一个问候语
function getRandomGreeting() {
  const { GREETINGS } = require("../config/constants");
  const randomIndex = Math.floor(Math.random() * GREETINGS.size);
  return GREETINGS.get(randomIndex);
}

module.exports = {
  generateDailyMessage,
  getWeather,
  getLoveWords,
};
