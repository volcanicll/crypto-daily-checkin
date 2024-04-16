let coinGecko_daily_check_in = require("./check-in/coinGecko_daily_check_in");
let cryptocurrency_daily_check_in = require("./check-in/cryptocurrency_daily_check_in");
let wxNotify = require("./wx-notify/index");

const booleanMap = new Map([
  [true, "签到成功"],
  [false, "签到失败"],
]);

const run = async () => {
  try {
    // coinGecko
    const is_coinGecko_success = await coinGecko_daily_check_in();

    // cryptocurrency
    const is_cryptocurrency_success = await cryptocurrency_daily_check_in();

    const template = {
      msgtype: "text",
      text: {
        content: `coinGecko： 『${booleanMap.get(is_coinGecko_success)}』\n
         cryptocurrency：『${booleanMap.get(is_cryptocurrency_success)}』`,
      },
    };

    await wxNotify(template);
  } catch (error) {
    console.log("error", error);
  }
};

// 运行主函数
run();
