const coinGecko_daily_check_in = async () => {
  const { coingeckoCookie, coingeckoToken, coingeckoAuthToken } = process.env;

  try {
    const authTokenRes = await fetch(
      "https://www.coingecko.com/accounts/csrf_meta.json",
      {
        method: "GET",
        headers: {
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
          "Sec-Ch-Ua-Arch": "x86",
          "Sec-Ch-Ua-Bitness": "64",
          "Sec-Ch-Ua-Full-Version": "125.0.6422.142",
          "Sec-Ch-Ua-Full-Version-List":
            '"Google Chrome";v="125.0.6422.142", "Chromium";v="125.0.6422.142", "Not.A/Brand";v="24.0.0.0"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Model": "",
          "Sec-Ch-Ua-Platform": "Windows",
          "Sec-Ch-Ua-Platform-Version": "10.0.0",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        },
      }
    ).then((response) => response.json());

    const checkRes = await fetch(
      "https://www.coingecko.com/en/candy/daily_check_in",
      {
        method: "POST",
        headers: {
          // "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: coingeckoCookie,
          Origin: "https://www.coingecko.com",
          Referer: "https://www.coingecko.com/en/candy",
          Accept: "*/*",
          "Sec-Ch-Ua-Arch": "x86",
          "Sec-Ch-Ua-Bitness": "64",
          "Sec-Ch-Ua-Full-Version": "125.0.6422.142",
          "Sec-Ch-Ua-Full-Version-List":
            '"Google Chrome";v="125.0.6422.142", "Chromium";v="125.0.6422.142", "Not.A/Brand";v="24.0.0.0"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Model": "",
          "Sec-Ch-Ua-Platform": "Windows",
          "Sec-Ch-Ua-Platform-Version": "10.0.0",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          "X-Csrf-Token": authTokenRes.token,
          // "X-Requested-With": "XMLHttpRequest",
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
