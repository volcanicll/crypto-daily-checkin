const { sectionHeader, blockquote } = require("./DingTalkMarkdownUtils");

/**
 * Format LLM commentary
 * @param {string|null} commentary
 * @returns {string} Formatted commentary
 */
const formatCommentary = (commentary) => {
  if (!commentary) return "";

  let message = sectionHeader("🎯", "AI 锐评");
  message += "> _基于今日数据的市场洞察与建议_\n\n";
  message += blockquote(commentary);

  return message;
};

module.exports = { formatCommentary };
