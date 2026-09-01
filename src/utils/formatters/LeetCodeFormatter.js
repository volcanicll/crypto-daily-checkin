const { sectionHeader, cardItem } = require("./DingTalkMarkdownUtils");
const { EMOJI } = require("../../config/constants");

const DIFFICULTY_ICON = {
  简单: "🟢",
  中等: "🟡",
  困难: "🔴",
};

/**
 * 格式化 LeetCode 每日一题
 * @param {object|null} question - { id, title, difficulty, acRate, url, date }
 * @returns {string} 格式化的内容
 */
const formatLeetCode = (question) => {
  if (!question || !question.title) return "";

  let message = sectionHeader(EMOJI.leetcode, "LeetCode 每日一题");
  message += "> _每天一题，保持手感 💪_\n\n";

  const difficultyIcon = DIFFICULTY_ICON[question.difficulty] || "🎯";
  const acRate = question.acRate !== null && question.acRate !== undefined
    ? `${question.acRate}%`
    : "—";

  message += cardItem({
    title: `${question.id}. ${question.title}`,
    url: question.url,
    summary: `难度：${difficultyIcon} ${question.difficulty} ｜ 通过率：${acRate}`,
    source: "力扣中国",
  });

  return message;
};

module.exports = { formatLeetCode };
