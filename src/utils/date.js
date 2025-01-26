const { DAYS_OF_WEEK } = require("../config/constants");

function getCurrentDayOfWeek() {
  const today = new Date();
  return DAYS_OF_WEEK[today.getDay()];
}

module.exports = {
  getCurrentDayOfWeek,
};
