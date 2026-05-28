const HttpClient = require("../../utils/http");
const http = new HttpClient();
const { translateBatch } = require("../../utils/translation");
const { env } = require("../../config/env");

const GITHUB_API = "https://api.github.com/search/repositories";

/**
 * 获取 GitHub 近 7 天新热门仓库
 * @returns {Promise<Array>}
 */
async function getGitHubNewStars() {
  try {
    console.log("Fetching GitHub new trending repos...");

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "TechDaily/1.0",
    };

    // 如果配置了 GitHub Token，添加认证头
    if (env.github.token) {
      headers["Authorization"] = `token ${env.github.token}`;
    }

    const data = await http.get(GITHUB_API, {
      params: {
        q: `created:>${since}`,
        sort: "stars",
        order: "desc",
        per_page: 10,
      },
      headers,
    });

    const repos = data.items || [];

    const items = repos.map((repo) => {
      const stars = repo.stargazers_count || 0;
      const starStr =
        stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : String(stars);

      return {
        title: `${repo.full_name} ⭐ ${starStr}`,
        description: `${repo.description || ""}${repo.language ? ` · ${repo.language}` : ""}`,
        url: repo.html_url,
        source: "GitHub",
        posted_on: repo.created_at
          ? new Date(repo.created_at).toISOString()
          : new Date().toISOString(),
      };
    });

    // 翻译描述
    if (items.length > 0) {
      await translateBatch(
        items,
        (item) => item.description,
        (item, translated) => { item.description = translated; }
      );
    }

    console.log(`GitHub Stars: collected ${items.length} new trending repos`);
    return items;
  } catch (error) {
    console.error("Error fetching GitHub new stars:", error.message);
    return [];
  }
}

module.exports = {
  getGitHubNewStars,
};
