const { BASE_URL } = require("../../../config/constants");

class GroupBotService {
  constructor() {
    this.baseUrl = BASE_URL.WEIXIN;
  }

  async sendMessage(config) {
    const { BOT_KEY } = process.env;

    try {
      const response = await fetch(
        `${this.baseUrl}/cgi-bin/webhook/send?key=${BOT_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        }
      );

      const result = await response.json();

      if (result.errcode === 0) {
        console.log("群机器人：消息发送成功！");
      }
    } catch (error) {
      console.error("群机器人：消息发送失败！", error);
    }
  }
}

module.exports = new GroupBotService();
