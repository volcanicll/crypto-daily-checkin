const {
  sectionHeader,
  cardItem,
  formatRelativeTime,
} = require("./DingTalkMarkdownUtils");
const { EMOJI } = require("../../config/constants");

/**
 * 格式化 GitHub 新热门仓库数据
 * @param {Array} repos
 * @returns {string}
 */
const formatGitHubStars = (repos) => {
  if (!repos || repos.length === 0) return "";

  let message = sectionHeader(EMOJI.githubStars, "开源新星");
  message += "> _GitHub 新项目 · 近 7 天热门_\n\n";

  repos.forEach((repo) => {
    const relativeTime = formatRelativeTime(repo.posted_on);
    message += cardItem(
      repo.title,
      repo.url,
      repo.description,
      repo.source,
      relativeTime,
    );
  });

  return message;
};

module.exports = { formatGitHubStars };
