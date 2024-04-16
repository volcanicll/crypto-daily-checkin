/**
 * @description 根据企业ID、应用secret 获取token
 * @returns token
 */

// 获取token
async function getToken({ id, secret }) {
  const BASE_URL = "https://qyapi.weixin.qq.com";
  const res = await fetch(
    `${BASE_URL}/cgi-bin/gettoken?corpid=${id}&corpsecret=${secret}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response) => response.json());
  return res.access_token || null;
}

module.exports = getToken;
