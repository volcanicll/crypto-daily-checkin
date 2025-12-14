const { BASE_URL } = require("../../config/constants");
const { MOBILE_HEADERS } = require("../../config/headers");
const { env } = require("../../config/env");
const HttpClient = require("../../utils/http");

class CoinGeckoService {
  constructor() {
    this.client = new HttpClient(BASE_URL.COINGECKO);
  }

  async checkIn() {
    const { cookie } = env.coinGecko;

    try {
      // 获取 CSRF Token
      const { token } = await this.getAuthToken(cookie);
      if (!token) {
        throw new Error("Failed to get CSRF token");
      }

      // 执行签到
      await this.performCheckIn(cookie, token);
      console.log("CoinGecko：签到成功");
      return true;
    } catch (error) {
      console.error("CoinGecko：签到失败", error.message);
      return false;
    }
  }

  async getAuthToken(cookie) {
    return this.client.get("/accounts/csrf_meta.json", {
      headers: {
        ...MOBILE_HEADERS,
        Cookie: cookie,
      },
    });
  }

  async performCheckIn(cookie, token) {
    return this.client.post("/en/candy/daily_check_in", null, {
      headers: {
        ...MOBILE_HEADERS,
        Cookie: cookie,
        "X-Csrf-Token": token,
      },
    });
  }
}

module.exports = new CoinGeckoService();
