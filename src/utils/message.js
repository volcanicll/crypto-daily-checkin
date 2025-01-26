const { GREETINGS } = require("../config/constants");

function getRandomGreeting() {
  const randomIndex = Math.floor(Math.random() * GREETINGS.size);
  return GREETINGS.get(randomIndex);
}

function formatCheckInResult(results) {
  const booleanMap = new Map([
    [true, "签到成功"],
    [false, "签到失败"],
  ]);

  return Object.entries(results)
    .map(([platform, success]) => `${platform}：『${booleanMap.get(success)}』`)
    .join("\n");
}

module.exports = {
  getRandomGreeting,
  formatCheckInResult,
};
