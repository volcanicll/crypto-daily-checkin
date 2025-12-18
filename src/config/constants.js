const BASE_URL = {
  WEIXIN: "https://qyapi.weixin.qq.com",
  DINGTALK: "https://oapi.dingtalk.com",
  COINGECKO: "https://www.coingecko.com",
  COINMARKET: "https://api.coinmarketcap.com",
  // 免费天气API
  WEATHER: "https://api.vvhan.com/api/weather",
  // 免费一言API
  QINGHUA: "https://api.lovelive.tools/api/SweetNothings/1",
  // 备用情话API
  QINGHUA_BACKUP: "https://api.uomg.com/api/rand.qinghua",
  JOKE: "https://api.vvhan.com/api/joke",
  ONE: "https://api.vvhan.com/api/60s",
  POETRY: "https://v1.jinrishici.com/all.json",
  HITOKOTO: "https://v1.hitokoto.cn",
};

const GREETINGS = new Map([
  [0, "崽崽早安！💖"],
  [1, "懒懒起床啦！💕"],
  [2, "宝宝今天也要加油哦！💞"],
  [3, "早安懒崽！今天也要元气满满！❤"],
  [4, "宝崽，新的一天开始啦！💝"],
  [5, "早安小可爱！今天也要开开心心！✨"],
  [6, "早安小懒虫！太阳晒屁股啦！🌞"],
  [7, "亲爱的，该起床啦！🌈"],
  [8, "美好的一天从见到你开始！🌸"],
  [9, "今天也要像小太阳一样闪耀呢！☀️"],
  [10, "早安小天使！愿你今天充满好运！🍀"],
  [11, "早安宝贝！记得吃早餐哦！🥐"],
  [12, "崽崽，想你了！今天也要加油！💪"],
  [13, "早安小可爱！今天也要打起精神！🌟"],
  [14, "亲爱的宝贝，新的一天又是属于你的！💫"],
]);

const DAYS_OF_WEEK = ["星期天", "周一", "周二", "周三", "周四", "周五", "周六"];

module.exports = {
  BASE_URL,
  GREETINGS,
  DAYS_OF_WEEK,
};
