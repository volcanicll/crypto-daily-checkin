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
    // 尝试所有可用的天气 API
    const weatherApis = [
      BASE_URL.WEATHER,
      "https://api.vvhan.com/api/weather", // 备用API 1
      "https://tianqiapi.com/api", // 备用API 2
      "https://www.yiketianqi.com/api", // 备用API 3
    ];

    let weatherData = null;
    for (const api of weatherApis) {
      const data = await safeRequest(`${api}?city=${encodeURIComponent(city)}`);
      if (data && data.info) {
        weatherData = data;
        break;
      }
    }

    if (!weatherData) {
      return `【今日天气】
亲爱的，天气接口暂时出小差了呢 🥺
不过没关系，记得带伞带外套，注意保暖降温哦！
💝 温馨提示：天气不是问题，心情最重要，今天也要开开心心的！`;
    }

    return `【今日天气】
${city} ${weatherData.info.type}
🌡️ 温度：${weatherData.info.low}℃ ~ ${weatherData.info.high}℃
💨 风向：${weatherData.info.fengxiang} ${weatherData.info.fengli}
💡 温馨提示：${weatherData.info.tip || "今天也要像太阳一样闪耀哦！✨"}`;
  } catch (error) {
    console.error("处理天气数据失败:", error);
    return `【今日天气】
亲爱的宝贝，虽然天气数据获取失败了 🌧
但是不要担心呢，记得：
🌂 带把伞~以防万一
🧥 适当增减衣物~
🌞 保持好心情最重要啦！`;
  }
}

// 获取情话
async function getLoveWords() {
  try {
    // 尝试所有可用的情话 API
    const loveApisConfig = [
      { url: BASE_URL.QINGHUA, path: "returnObj" },
      { url: BASE_URL.QINGHUA_BACKUP, path: "content" },
      { url: BASE_URL.HITOKOTO, path: "hitokoto" },
      { url: "https://api.vvhan.com/api/love", path: "data" },
    ];

    let loveMessage = null;
    for (const api of loveApisConfig) {
      const data = await safeRequest(api.url);
      if (data && data[api.path]) {
        loveMessage = data[api.path];
        break;
      }
    }

    if (!loveMessage) {
      return `【温馨话语】
亲爱的，你是我所有美好故事的开始 💝
永远爱你，今天也要开心哦！✨`;
    }

    return `【温馨话语】
${loveMessage}`;
  } catch (error) {
    console.error("获取情话失败:", error);
    return `【温馨话语】
即使所有情话都说不出口，
但我的心意永远都在哦！💕
今天也要元气满满，开开心心！🌈`;
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
    return `${getRandomGreeting()}\n\n亲爱的宝贝，
虽然今天消息生成遇到了一点小问题 🥺
但是我的心意不会变：
愿你今天也能开开心心，元气满满！
记得按时吃饭，注意保暖，照顾好自己哦！
永远爱你！💖`;
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
