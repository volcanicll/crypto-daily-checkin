const coinGecko_daily_check_in = async () => {
  const { coingeckoCookie, coingeckoToken, coingeckoAuthToken } = process.env;

  try {
    const res = await fetch(
      "https://www.coingecko.com/account/candy/daily_check_in",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: coingeckoCookie,
          Origin: "https://www.coingecko.com",
          Referer: "https://www.coingecko.com/account/candy",
          Accept:
            "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
          "Sec-Ch-Ua":
            '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',

          "Sec-Ch-Ua-Arch": "x86",
          "Sec-Ch-Ua-Bitness": "64",
          "Sec-Ch-Ua-Full-Version": "123.0.6312.122",
          "Sec-Ch-Ua-Full-Version-List":
            '"Google Chrome";v="123.0.6312.122", "Not:A-Brand";v="8.0.0.0", "Chromium";v="123.0.6312.122"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Model": "",
          "Sec-Ch-Ua-Platform": "Windows",
          "Sec-Ch-Ua-Platform-Version": "10.0.0",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          "X-Csrf-Token": coingeckoToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `authenticity_token=${coingeckoAuthToken}`,
      }
    ).then((response) => response.text());

    console.log("coinGecko_daily_check_in", res);
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

module.exports = coinGecko_daily_check_in;
