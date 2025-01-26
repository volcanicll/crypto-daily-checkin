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
  try {
    const data = await safeRequest(
      `${BASE_URL.WEATHER}?city=${encodeURIComponent(city)}`
    );
    if (!data || !data.data) return "【天气获取失败】";

    const weatherData = data.data;
    return `【今日天气】
${city} ${weatherData.weather || "未知"}
🌡️ 温度：${weatherData.temperature || "未知"}
💨 风向：${weatherData.windDirection || "未知"} ${weatherData.windPower || ""}
💡 温馨提示：今天也要开开心心哦！`;
  } catch (error) {
    console.error("处理天气数据失败:", error);
    return "【天气获取失败】";
  }
}

// 获取土味情话
async function getLoveWords() {
  try {
    // 使用备用的情话 API
    const data = await safeRequest("https://api.vvhan.com/api/sao");
    if (!data) return "【情话获取失败】";

    return `【情话时间】
${data.ishan || data}`;
  } catch (error) {
    console.error("获取情话失败:", error);
    return "【情话获取失败】";
  }
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
