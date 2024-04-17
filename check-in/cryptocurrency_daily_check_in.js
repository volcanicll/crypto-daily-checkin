const cryptocurrency_daily_check_in = async () => {
  try {
    await fetch(
      "https://api.coinmarketcap.com/user-info/v3/user-info/check-ineligible",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: process.env.coinmarketCookie,
          Origin: "https://coinmarketcap.com",
          Referer: "https://coinmarketcap.com/",
          Accept: "application/json, text/plain, */*",
          "Sec-Ch-Ua":
            '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": "Windows",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          "X-Csrf-Token": process.env.coinmarketToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({}),
      }
    );

    const res = await fetch(
      "https://api.coinmarketcap.com/asset/v3/loyalty/check-in/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: process.env.coinmarketCookie,
          "Device-Info":
            "%7B%22screen_resolution%22%3A%221920%2C1080%22%2C%22available_screen_resolution%22%3A%221920%2C1050%22%2C%22system_version%22%3A%22Windows%2010%22%2C%22brand_model%22%3A%22unknown%22%2C%22system_lang%22%3A%22zh-CN%22%2C%22timezone%22%3A%22GMT%2B8%22%2C%22timezoneOffset%22%3A-480%2C%22user_agent%22%3A%22Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F123.0.0.0%20Safari%2F537.36%22%2C%22list_plugin%22%3A%22PDF%20Viewer%2CChrome%20PDF%20Viewer%2CChromium%20PDF%20Viewer%2CMicrosoft%20Edge%20PDF%20Viewer%2CWebKit%20built-in%20PDF%22%2C%22canvas_code%22%3A%225a3b588a%22%2C%22webgl_vendor%22%3A%22Google%20Inc.%20(Intel)%22%2C%22webgl_renderer%22%3A%22ANGLE%20(Intel%2C%20Intel(R)%20HD%20Graphics%20630%20(0x0000591B)%20Direct3D11%20vs_5_0%20ps_5_0%2C%20D3D11)%22%2C%22audio%22%3A%22124.04347527516074%22%2C%22platform%22%3A%22Win32%22%2C%22web_timezone%22%3A%22Asia%2FShanghai%22%2C%22device_name%22%3A%22Chrome%20V123.0.0.0%20(Windows)%22%2C%22fingerprint%22%3A%22c997262e7befe217c14e41fc36d6f3ef%22%7D",
          Origin: "https://coinmarketcap.com",
          Referer: "https://coinmarketcap.com/",
          Accept: "application/json, text/plain, */*",
          "Sec-Ch-Ua":
            '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": "Windows",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          "X-Csrf-Token": process.env.coinmarketToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          platform: "web",
        }),
      }
    ).then((response) => response.json());

    console.log("coinmarket-log", res);
    const { status } = res;
    const { error_code, error_message } = status;
    if (error_code == "0" && error_message == "SUCCESS") return true;
    return false;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

module.exports = cryptocurrency_daily_check_in;
