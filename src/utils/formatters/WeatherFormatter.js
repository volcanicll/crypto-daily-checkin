/**
 * Format weather data into a user-friendly string
 * @param {object} weatherData 
 * @param {string} city 
 * @returns {string} Formatted weather report
 */
const formatWeather = (weatherData, city) => {
    if (!weatherData) {
        return `【天气接口摸鱼了哦...】
亲爱的，天气接口暂时出小差了呢 🥺
不过没关系，记得带伞带外套，注意保暖降温哦！
💝 温馨提示：天气不是问题，心情最重要，今天也要开开心心的！`;
    }

    return `【今日天气🌤️】
${city} ${weatherData.data.type}
🌡️ 温度：${weatherData.data.low}℃ ~ ${weatherData.data.high}℃
💨 风向：${weatherData.data.fengxiang} ${weatherData.data.fengli}
💡 温馨提示：${weatherData.tip || "今天也要像太阳一样闪耀哦！✨"}`;
};

module.exports = { formatWeather };
