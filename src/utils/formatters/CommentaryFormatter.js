const { sectionHeader, blockquote } = require("./DingTalkMarkdownUtils");

/**
 * Format LLM commentary
 * @param {string|null} commentary
 * @returns {string} Formatted commentary
 */
const formatCommentary = (commentary) => {
  if (!commentary) return "";

  let message = sectionHeader("🎯", "AI 锐评");
  message += blockquote(commentary);

  return message;
};

module.exports = { formatCommentary };
