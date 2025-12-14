const { BASE_URL } = require("../../../config/constants");
const { env } = require("../../../config/env");

class WxBotService {
  constructor() {
    this.baseUrl = BASE_URL.WEIXIN;
  }

  async sendMessage(config) {
    try {
      const accessToken = await this.getToken();
      if (!accessToken) {
        console.error("获取token失败！");
        return;
      }

      const messageConfig = this.createMessageConfig(config);
      const result = await this.postMessage(accessToken, messageConfig);

      if (result.errcode === 0) {
        console.log("企业微信：消息发送成功！");
      }
    } catch (error) {
      console.error("企业微信：消息发送失败！", error);
    }
  }

  async getToken() {
    const { companyId, appSecret } = env.wxApp;
    const response = await fetch(
      `${this.baseUrl}/cgi-bin/gettoken?corpid=${companyId}&corpsecret=${appSecret}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result.access_token || null;
  }

  async postMessage(accessToken, config) {
    const response = await fetch(
      `${this.baseUrl}/cgi-bin/message/send?access_token=${accessToken}`,
      {
        method: "POST",
        body: JSON.stringify({
          touser: "XiangCan" || "@all",
          ...config,
        }),
      }
    );
    return response.json();
  }

  createMessageConfig(config) {
    const { appId } = env.wxApp;
    return {
      msgtype: "text",
      agentid: appId,
      ...config,
    };
  }
}

module.exports = new WxBotService();
