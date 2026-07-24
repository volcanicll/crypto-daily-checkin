const HttpClient = require("../../utils/http");
const http = new HttpClient();

/**
 * 掘金（Juejin）技术社区配置
 * 中文开发者社区，提供技术文章和讨论
 */
const JUEJIN_CONFIG = {
  baseUrl: "https://api.juejin.cn",
  endpoints: {
    // 推荐文章
    recommend: "/content_api/v1/content/article_rank?category_id=1&type=hot",
    // 热门文章
    hot: "/content_api/v1/content/article_rank?category_id=1&type=hot",
    // 最新文章
    recent: "/content_api/v1/content/article_list?category_id=1&cursor=0&limit=20&sort_type=2",
  },
  // 技术分类ID
  categories: {
    frontend: "6809637767543259144",
    backend: "6809637769959738381",
    ai: "6809637773838385159",
    devops: "6809637771511388167",
    mobile: "6809637769959738377",
    database: "6809637770638833671",
  },
  topN: 10,
};

/**
 * 掘金 API 客户端类
 */
class JuejinClient {
  constructor() {
    this.baseUrl = JUEJIN_CONFIG.baseUrl;
  }

  /**
   * 发送 API 请求
   * @param {string} endpoint - API 端点
   * @param {object} data - 请求数据
   * @returns {Promise<object>}
   */
  async request(endpoint, data = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Referer": "https://juejin.cn/",
      "Origin": "https://juejin.cn",
    };

    const response = await http.post(url, data, { headers });
    return response;
  }

  /**
   * 获取推荐文章
   * @returns {Promise<Array>}
   */
  async fetchRecommend() {
    const data = await this.request(JUEJIN_CONFIG.endpoints.recommend);
    return this.normalize(data);
  }

  /**
   * 获取热门文章
   * @returns {Promise<Array>}
   */
  async fetchHot() {
    const data = await this.request(JUEJIN_CONFIG.endpoints.hot);
    return this.normalize(data);
  }

  /**
   * 获取最新文章
   * @returns {Promise<Array>}
   */
  async fetchRecent() {
    const data = await this.request(JUEJIN_CONFIG.endpoints.recent);
    return this.normalize(data);
  }

  /**
   * 标准化文章数据格式
   * @param {object} response - API 响应
   * @returns {Array}
   */
  normalize(response) {
    if (!response || !response.data) {
      return [];
    }

    const articles = response.data || [];
    return articles.map(item => {
      const content = item.content || {};
      const author = item.author || {};
      const community = item.community || {};

      return {
        id: item.content_id || item.id,
        title: content.title || item.title || "",
        url: `https://juejin.cn/post/${content.content_id || item.id}`,
        description: this.cleanContent(content.brief_content || content.content || "", 150),
        author: author.user_name || "Unknown",
        posted_on: item.content ? 
          new Date(item.content.ctime * 1000).toISOString() : 
          new Date().toISOString(),
        category: community.name || "技术",
        tags: (content.tag_ids || []).slice(0, 3),
        digg_count: item.content_counter?.digg_count || 0,
        comment_count: item.content_counter?.comment_count || 0,
        view_count: item.content_counter?.view_count || 0,
      };
    });
  }

  /**
   * 清理内容文本
   * @param {string} content - 原始内容
   * @param {number} maxLength - 最大长度
   * @returns {string}
   */
  cleanContent(content, maxLength = 150) {
    if (!content) return "";

    // 移除HTML标签
    let cleaned = content.replace(/<[^>]*>?/gm, "");
    // 移除Markdown格式
    cleaned = cleaned.replace(/#{1,6}\s+/gm, "");
    cleaned = cleaned.replace(/\*\*/g, "");
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
    cleaned = cleaned.replace(/[\r\n]+/g, " ");
    cleaned = cleaned.replace(/\s{2,}/g, " ");

    // 截断
    if (cleaned.length > maxLength) {
      return cleaned.substring(0, maxLength - 3) + "...";
    }
    return cleaned;
  }
}

/**
 * 获取掘金技术热闻
 * @returns {Promise<Array>}
 */
async function getJuejinNews() {
  const client = new JuejinClient();

  try {
    console.log("Fetching Juejin hot articles...");
    
    // 获取推荐和热门文章
    const [recommend, hot] = await Promise.all([
      client.fetchRecommend().catch(e => {
        console.error("Juejin recommend fetch error:", e.message);
        return [];
      }),
      client.fetchHot().catch(e => {
        console.error("Juejin hot fetch error:", e.message);
        return [];
      }),
    ]);

    // 合并去重
    const allArticles = [...recommend, ...hot];
    const seen = new Set();
    const uniqueArticles = allArticles.filter(article => {
      if (seen.has(article.id)) return false;
      seen.add(article.id);
      return true;
    });

    // 按热度排序（点赞+评论+浏览）
    const sortedArticles = uniqueArticles.sort((a, b) => {
      const scoreA = (a.digg_count || 0) * 2 + (a.comment_count || 0) * 3 + (a.view_count || 0) * 0.1;
      const scoreB = (b.digg_count || 0) * 2 + (b.comment_count || 0) * 3 + (b.view_count || 0) * 0.1;
      return scoreB - scoreA;
    });

    // 取前N条
    const topArticles = sortedArticles.slice(0, JUEJIN_CONFIG.topN);
    
    console.log(`Juejin: returning ${topArticles.length} top articles`);
    return topArticles;
  } catch (error) {
    console.error("Error fetching Juejin news:", error.message);
    return [];
  }
}

module.exports = {
  getJuejinNews,
  JuejinClient,
  JUEJIN_CONFIG,
};