const { BOT_KEY } = process.env;

// group_bot
const bot_send_msg = async (config) => {
  try {
    const res = await fetch(
      `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${BOT_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...config,
        }),
      }
    ).then((response) => response.json());
    console.log(res);
    if (res.errcode === 0) {
      console.log("bot信息发送成功！");
    }
  } catch (error) {
    console.log("bot信息发送失败！");
    console.log(error);
  }
};

module.exports = bot_send_msg;
