/**
 * 发送消息通知到企业微信
 */
const BASE_URL = "https://qyapi.weixin.qq.com";

const postMsg = async (accessToken, config) => {
  console.log("config", config);
  const res = await fetch(
    `${BASE_URL}/cgi-bin/message/send?access_token=${accessToken}`,
    {
      method: "POST",
      body: JSON.stringify({
        touser: "XiangCan" || "@all",
        ...config,
      }),
    }
  ).then((response) => response.json());
  return res;
};

module.exports = postMsg;
