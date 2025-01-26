const BASE_URL = {
  WEIXIN: "https://qyapi.weixin.qq.com",
  COINGECKO: "https://www.coingecko.com",
  COINMARKET: "https://api.coinmarketcap.com",
};

const GREETINGS = new Map([
  [0, "崽！💖"],
  [1, "懒懒！💕"],
  [2, "宝宝！💞"],
  [3, "懒崽！❤"],
  [4, "宝崽！💝"],
]);

const DAYS_OF_WEEK = ["星期天", "周一", "周二", "周三", "周四", "周五", "周六"];

module.exports = {
  BASE_URL,
  GREETINGS,
  DAYS_OF_WEEK,
};
