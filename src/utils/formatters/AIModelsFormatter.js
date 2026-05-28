const {
  sectionHeader,
  cardItem,
  formatRelativeTime,
} = require("./DingTalkMarkdownUtils");
const { EMOJI } = require("../../config/constants");

/**
 * 格式化 AI 模型排行数据
 * @param {Array} models
 * @returns {string}
 */
const formatAIModels = (models) => {
  if (!models || models.length === 0) return "";

  let message = sectionHeader(EMOJI.aiModels, "今日 AI 模型排行");
  message += "> _HuggingFace Trending · 热门模型_\n\n";

  models.forEach((model) => {
    const relativeTime = formatRelativeTime(model.posted_on);
    message += cardItem(
      model.title,
      model.url,
      model.description,
      model.source,
      relativeTime,
    );
  });

  return message;
};

module.exports = { formatAIModels };
