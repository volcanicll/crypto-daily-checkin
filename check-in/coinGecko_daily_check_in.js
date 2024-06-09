const coinGecko_daily_check_in = async () => {
  const { coingeckoCookie, coingeckoToken, coingeckoAuthToken } = process.env;

  try {
    const authTokenRes = await fetch(
      "https://www.coingecko.com/accounts/csrf_meta.json",
      {
        method: "GET",
        headers: {
          ":authority": "www.coingecko.com",
          ":method": "GET",
          ":path": "/accounts/csrf_meta.json",
          ":scheme": "https",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          "Cache-Control": "no-cache",
          Cookie: coingeckoCookie,
          Pragma: "no-cache",
          Priority: "u=1, i",
          Referer: "https://www.coingecko.com/en/candy",
          "Sec-Ch-Ua":
            '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          "Sec-Ch-Ua-Arch": "",
          "Sec-Ch-Ua-Bitness": "64",
          "Sec-Ch-Ua-Full-Version": "125.0.6422.142",
          "Sec-Ch-Ua-Full-Version-List":
            '"Google Chrome";v="125.0.6422.142", "Chromium";v="125.0.6422.142", "Not.A/Brand";v="24.0.0.0"',
          "Sec-Ch-Ua-Mobile": "?1",
          "Sec-Ch-Ua-Model": "Nexus 6P",
          "Sec-Ch-Ua-Platform": "Android",
          "Sec-Ch-Ua-Platform-Version": "8.0.0",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 8.0.0; Nexus 6P Build/OPP3.170518.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
        },
      }
    ).then((response) => response.json());

    const checkRes = await fetch(
      "https://www.coingecko.com/en/candy/daily_check_in",
      {
        method: "POST",
        headers: {
          ":authority": "www.coingecko.com",
          ":method": "POST",
          ":path": "/en/candy/daily_check_in",
          " :scheme": "https",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          "Cache-Control": "no-cache",
          "Content-Length": "0",
          Cookie: "",
          Origin: "https://www.coingecko.com",
          Pragma: "no-cache",
          Priority: "u=1, i",
          Referer: "https://www.coingecko.com/en/candy",
          "Sec-Ch-Ua":
            '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          "Sec-Ch-Ua-Arch": "",
          "Sec-Ch-Ua-Bitness": "64",
          "Sec-Ch-Ua-Full-Version": "125.0.6422.142",
          "Sec-Ch-Ua-Full-Version-List":
            '"Google Chrome";v="125.0.6422.142", "Chromium";v="125.0.6422.142", "Not.A/Brand";v="24.0.0.0"',
          "Sec-Ch-Ua-Mobile": "?1",
          "Sec-Ch-Ua-Model": "Nexus 6P",
          "Sec-Ch-Ua-Platform": "Android",
          "Sec-Ch-Ua-Platform-Version": "8.0.0",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 8.0.0; Nexus 6P Build/OPP3.170518.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
          "X-Csrf-Token": authTokenRes.token,
        },
        // body: `authenticity_token=${coingeckoAuthToken}`,
      }
    ).then((response) => response.text());

    console.log("coinGecko_daily_check_in", checkRes);
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

module.exports = coinGecko_daily_check_in;
