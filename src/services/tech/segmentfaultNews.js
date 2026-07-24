const HttpClient = require("../../utils/http");
const http = new HttpClient();
const cheerio = require("cheerio");
const { translateBatch } = require("../../utils/translation");
const { filterTodayItems } = require("../../utils/common");

/**
 * SegmentFault 技术问答社区配置
 * 中文技术问答平台，类似StackOverflow
 */
const SEGMENTFAULT_CONFIG = {
  baseUrl: "https://segmentfault.com",
  endpoints: {
    // 热门问题
    hot: "/questions/hot",
    // 最新问题
    recent: "/questions/recent",
    // 热门文章
    articles: "/articles/hot",
    // 技术频道
    channels: "/channels",
  },
  // RSS源
  rss: {
    hot: "https://segmentfault.com/questions/hot/rss",
    recent: "https://segmentfault.com/questions/recent/rss",
    articles: "https://segmentfault.com/articles/hot/rss",
  },
  topN: 10,
};

/**
 * SegmentFault 客户端类
 */
class SegmentFaultClient {
  constructor() {
    this.baseUrl = SEGMENTFAULT_CONFIG.baseUrl;
  }

  /**
   * 获取 RSS 内容
   * @param {string} url - RSS 源地址
   * @returns {Promise<Array>}
   */
  async fetchRSS(url) {
    const headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Accept: "application/rss+xml,application/xml,text/xml,*/*",
    };

    const xml = await http.get(url, { headers });
    const $ = cheerio.load(xml, { xmlMode: true });
    const items = [];

    $("item").each((i, el) => {
      if (i >= 20) return false;

      const $el = $(el);
      const title = $el.find("title").text().trim();
      let link = $el.find("link").text().trim();

      // 获取描述
      let description = $el.find("description").text();
      if (!description) description = $el.find("summary").text();

      // 清理HTML
      if (description) {
        description = description.replace(/<[^>]*>?/gm, "").trim();
        description = description.replace(/\s+/g, " ");
        if (description.length > 200) {
          description = description.substring(0, 197) + "...";
        }
      }

      // 获取作者
      const author = $el.find("author").text().trim() || "Unknown";

      // 获取发布时间
      let pubDate = $el.find("pubDate").text().trim();
      if (!pubDate) pubDate = $el.find("published").text().trim();

      if (title && link) {
        items.push({
          title,
          url: link,
          description: description || "",
          author,
          posted_on: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        });
      }
    });

    return items;
  }

  /**
   * 获取页面内容（备用方案）
   * @param {string} path - 页面路径
   * @returns {Promise<Array>}
   */
  async fetchPage(path) {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    };

    const html = await http.get(url, { headers });
    const $ = cheerio.load(html);
    const items = [];

    // 解析问题列表
    $(".news-item, .question-item").each((i, el) => {
      if (i >= 15) return false;

      const $el = $(el);
      const title = $el.find("h2 a, .title a").text().trim();
      let link = $el.find("h2 a, .title a").attr("href");
      if (link && !link.startsWith("http")) {
        link = `${this.baseUrl}${link}`;
      }

      const description = $el.find(".text, .excerpt").text().trim();
      const author = $el.find(".author, .user-name").text().trim() || "Unknown";
      const time = $el.find(".time, .date").text().trim();

      if (title && link) {
        items.push({
          title,
          url: link,
          description: description ? description.substring(0, 200) : "",
          author,
          posted_on: time ? this.parseTime(time) : new Date().toISOString(),
        });
      }
    });

    return items;
  }

  /**
   * 解析相对时间
   * @param {string} timeStr - 时间字符串（如"2小时前"）
   * @returns {string}
   */
  parseTime(timeStr) {
    const now = new Date();
    const match = timeStr.match(/(\d+)\s*(分钟|小时|天|周|月)前/);
    
    if (!match) return now.toISOString();
    
    const amount = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case "分钟":
        now.setMinutes(now.getMinutes() - amount);
        break;
      case "小时":
        now.setHours(now.getHours() - amount);
        break;
      case "天":
        now.setDate(now.getDate() - amount);
        break;
      case "周":
        now.setDate(now.getDate() - amount * 7);
        break;
      case "月":
        now.setMonth(now.getMonth() - amount);
        break;
    }
    
    return now.toISOString();
  }
}

/**
 * 获取 SegmentFault 热门技术问答
 * @returns {Promise<Array>}
 */
async function getSegmentFaultNews() {
  const client = new SegmentFaultClient();

  try {
    console.log("Fetching SegmentFault hot questions...");
    
    // 并行获取问题和文章
    const [questions, articles] = await Promise.all([
      client.fetchRSS(SEGMENTFAULT_CONFIG.rss.hot).catch(e => {
        console.error("SegmentFault questions fetch error:", e.message);
        return [];
      }),
      client.fetchRSS(SEGMENTFAULT_CONFIG.rss.articles).catch(e => {
        console.error("SegmentFault articles fetch error:", e.message);
        return [];
      }),
    ]);

    // 合并并分类
    const allItems = [
      ...questions.map(q => ({ ...q, type: "question" })),
      ...articles.map(a => ({ ...a, type: "article" })),
    ];

    // 基本去重（基于URL）
    const seen = new Set();
    const uniqueItems = allItems.filter(item => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });

    // 使用并行翻译优化性能
    const itemsToTranslate = uniqueItems.slice(0, 25);
    console.log(`Translating ${itemsToTranslate.length} SegmentFault items...`);

    // 并行翻译标题
    await translateBatch(
      itemsToTranslate,
      (item) => item.title,
      (item, translated) => { item.title = translated; }
    );

    // 过滤只保留当天的内容
    const todayItems = filterTodayItems(itemsToTranslate);
    console.log(`SegmentFault: filtered to ${todayItems.length} items from today`);

    // 取前N条
    return todayItems.slice(0, SEGMENTFAULT_CONFIG.topN);
  } catch (error) {
    console.error("Error fetching SegmentFault news:", error.message);
    return [];
  }
}

module.exports = {
  getSegmentFaultNews,
  SegmentFaultClient,
  SEGMENTFAULT_CONFIG,
};