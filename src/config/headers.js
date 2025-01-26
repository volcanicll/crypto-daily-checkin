const MOBILE_HEADERS = {
  "Sec-Ch-Ua":
    '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
  "Sec-Ch-Ua-Mobile": "?1",
  "Sec-Ch-Ua-Platform": "Android",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 8.0.0; Nexus 6P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  Accept: "*/*",
};

const DESKTOP_HEADERS = {
  "Sec-Ch-Ua":
    '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": "Windows",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
};

const DEVICE_INFO = {
  screen_resolution: "1920,1080",
  available_screen_resolution: "1920,1050",
  system_version: "Windows 10",
  brand_model: "unknown",
  system_lang: "zh-CN",
  timezone: "GMT+8",
  timezoneOffset: -480,
  platform: "Win32",
  web_timezone: "Asia/Shanghai",
  device_name: "Chrome V123.0.0.0 (Windows)",
  fingerprint: "c997262e7befe217c14e41fc36d6f3ef",
};

module.exports = {
  MOBILE_HEADERS,
  DESKTOP_HEADERS,
  DEVICE_INFO,
};
