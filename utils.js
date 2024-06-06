function getCurrentDayOfWeek() {
  const daysOfWeek = ["星期天", "周一", "周二", "周三", "周四", "周五", "周六"];
  const today = new Date();
  return daysOfWeek[today.getDay()];
}

function getRandomGreeting() {
  const greetings = new Map([
    [0, "崽！💖"],
    [1, "懒懒！💕"],
    [2, "宝宝！💞"],
    [3, "懒崽！❤"],
    [4, "宝崽！💝"],
  ]);

  const randomIndex = Math.floor(Math.random() * greetings.size);

  return greetings.get(randomIndex);
}

module.exports = {
  getCurrentDayOfWeek,
  getRandomGreeting,
};
