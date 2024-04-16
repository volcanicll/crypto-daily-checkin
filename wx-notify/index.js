/**
 * @name WXbot
 * @description 获取环境变量参数，执行微信消息通知函数
 */

let getToken = require("./getToken");
let postMsg = require("./postMsg");

const { WX_COMPANY_ID, WX_APP_ID, WX_APP_SECRET } = process.env;

// 主函数
async function wxNotify(config) {
  try {
    // 获取token
    const accessToken = await getToken({
      id: WX_COMPANY_ID,
      secret: WX_APP_SECRET,
    });
    if (!accessToken) {
      console.log("获取token失败！", accessToken);
      return;
    }

    // 发送消息
    const defaultConfig = {
      msgtype: "text",
      agentid: WX_APP_ID,
      ...config,
    };
    const option = { ...defaultConfig, ...config };
    const res = await postMsg(accessToken, option);
    if (res.errcode === 0) {
      console.log("wx:信息发送成功！");
    }
    return true;
  } catch (error) {
    console.log("wx:信息发送失败！", error);
    return false;
  }
}

module.exports = wxNotify;
