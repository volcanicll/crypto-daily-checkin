let coinGecko_daily_check_in = require("./check-in/coinGecko_daily_check_in");
let cryptocurrency_daily_check_in = require("./check-in/cryptocurrency_daily_check_in");
let bot_send_msg = require("./group-bot/index");

const booleanMap = new Map([
  [true, "签到成功"],
  [false, "签到失败"],
]);

const textMap = new Map([
  [0, "崽！💖"],
  [1, "懒懒！💕"],
  [2, "宝宝！💞"],
  [3, "懒崽！❤"],
  [4, "宝崽！💝"],
]);

const generateRandomAndCheckDivisibility = () =>
  (Math.floor(Math.random() * 100) + 1) % 5;

const run = async () => {
  try {
    // coinGecko
    const is_coinGecko_success = await coinGecko_daily_check_in();

    // cryptocurrency
    const is_cryptocurrency_success = await cryptocurrency_daily_check_in();

    const template = {
      msgtype: "text",
      text: {
        content: `coinGecko：『${booleanMap.get(
          is_coinGecko_success
        )}』\ncoinMarket：『${booleanMap.get(
          is_cryptocurrency_success
        )}』\n ${textMap.get(generateRandomAndCheckDivisibility())}`,
      },
    };

    bot_send_msg(template);
  } catch (error) {
    console.log("error", error);
  }
};

// 运行主函数
run();
