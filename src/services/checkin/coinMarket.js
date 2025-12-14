const { BASE_URL } = require("../../config/constants");
const { DESKTOP_HEADERS, DEVICE_INFO } = require("../../config/headers");
const { env } = require("../../config/env");
const HttpClient = require("../../utils/http");

class CoinMarketService {
  constructor() {
    this.client = new HttpClient(BASE_URL.COINMARKET);
  }

  async checkIn() {
    const { cookie, token } = env.coinMarket;

    try {
      // 检查签到资格
      await this.checkEligibility(cookie, token);

      // 执行签到
      const result = await this.performCheckIn(cookie, token);

      if (this.isCheckInSuccessful(result)) {
        console.log("CoinMarket：签到成功");
        return true;
      }
      throw new Error(result.status?.error_message || "Unknown error");
    } catch (error) {
      console.error("CoinMarket：签到失败", error.message);
      return false;
    }
  }

  async checkEligibility(cookie, token) {
    return this.client.post(
      "/user-info/v3/user-info/check-ineligible",
      {},
      {
        headers: this.getHeaders(cookie, token),
      }
    );
  }

  async performCheckIn(cookie, token) {
    return this.client.post(
      "/asset/v3/loyalty/check-in/",
      { platform: "web" },
      {
        headers: {
          ...this.getHeaders(cookie, token),
          "Device-Info": this.getEncodedDeviceInfo(),
        },
      }
    );
  }

  isCheckInSuccessful(result) {
    const { status } = result;
    return status?.error_code === "0" && status?.error_message === "SUCCESS";
  }

  getHeaders(cookie, token) {
    return {
      ...DESKTOP_HEADERS,
      Cookie: cookie,
      Origin: "https://coinmarketcap.com",
      Referer: "https://coinmarketcap.com/",
      "X-Csrf-Token": token,
      "X-Requested-With": "XMLHttpRequest",
    };
  }

  getEncodedDeviceInfo() {
    return encodeURIComponent(JSON.stringify(DEVICE_INFO));
  }
}

module.exports = new CoinMarketService();
