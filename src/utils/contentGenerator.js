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
async function getWeather(city = "重庆") {
  try {
    const data = await safeRequest(
      `${BASE_URL.WEATHER}?city=${encodeURIComponent(city)}`
    );

    if (!data || !data.info) {
      return `【今日天气】
${city}
🌡️ 温度：暂时获取失败
💨 风向：暂时获取失败
💡 温馨提示：天气信息获取失败了，不过依然要开心哦！`;
    }

    return `【今日天气】
${city} ${data.info.type}
🌡️ 温度：${data.info.low}℃ ~ ${data.info.high}℃
💨 风向：${data.info.fengxiang} ${data.info.fengli}
💡 温馨提示：${data.info.tip || "今天也要开开心心哦！"}`;
  } catch (error) {
    console.error("处理天气数据失败:", error);
    return "【天气获取失败】但是今天也要元气满满哦！";
  }
}

// 获取情话
async function getLoveWords() {
  try {
    // 尝试第一个API
    let data = await safeRequest(BASE_URL.QINGHUA);

    if (!data || !data.returnObj) {
      // 如果第一个API失败，尝试备用API
      data = await safeRequest(BASE_URL.QINGHUA_BACKUP);
      if (!data || !data.content) {
        return `【温馨话语】
今天也要加油哦！`;
      }
      return `【温馨话语】
${data.content}`;
    }

    return `【温馨话语】
${data.returnObj}`;
  } catch (error) {
    console.error("获取情话失败:", error);
    return `【温馨话语】
今天也要开开心心，充满希望！`;
  }
}

// 生成完整的每日消息
async function generateDailyMessage(city) {
  try {
    const greeting = getRandomGreeting();
    const parts = await Promise.all([getWeather(city), getLoveWords()]);
    return `${greeting}\n\n${parts.join("\n\n")}`;
  } catch (error) {
    console.error("生成消息失败:", error);
    // 即使出错也返回基本的问候语
    return `${getRandomGreeting()}\n\n今天也要开开心心哦！`;
  }
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
