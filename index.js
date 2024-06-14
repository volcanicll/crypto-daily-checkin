let coinGecko_daily_check_in = require("./check-in/coinGecko_daily_check_in");
let cryptocurrency_daily_check_in = require("./check-in/cryptocurrency_daily_check_in");
let bot_send_msg = require("./group-bot/index");
let { getRandomGreeting, getCurrentDayOfWeek } = require("./utils");

const booleanMap = new Map([
  [true, "签到成功"],
  [false, "签到失败"],
]);

const run = async () => {
  console.log("开始");
  try {
    // coinGecko
    const is_coinGecko_success = await coinGecko_daily_check_in();

    // cryptocurrency
    const is_cryptocurrency_success = await cryptocurrency_daily_check_in();

    let content = `coinGecko：『${booleanMap.get(
      is_coinGecko_success
    )}』\ncoinMarket：『${booleanMap.get(
      is_cryptocurrency_success
    )}』\n爱你哦， ${getRandomGreeting()}`;

    const template = {
      msgtype: "text",
      text: {
        content: content,
      },
    };

    bot_send_msg(template);
  } catch (error) {
    console.log("error", error);
  }
};

// 运行主函数
run();
