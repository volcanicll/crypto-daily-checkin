/**
 * 新闻亮点服务
 * 使用 AI 识别和总结当日最重要的新闻
 */

const { env } = require("../../config/env");
const { HIGHLIGHTS_PROMPT } = require("../../config/prompts");
const { LLM_CONFIG } = require("../../config/constants");

class NewsHighlightsService {
  constructor() {
    this.apiKey = env.llm.apiKey;
    this.baseUrl = env.llm.baseUrl;
    this.model = env.llm.model;
  }

  /**
   * 生成新闻亮点
   * @param {Array} allNews - 所有新闻
   * @param {number} maxHighlights - 最大亮点数量
   * @returns {Promise<Array>} 新闻亮点数组
   */
  async generateHighlights(allNews, maxHighlights = 5) {
    if (!this.apiKey) {
      console.warn("LLM API Key 未配置，跳过新闻亮点生成");
      return [];
    }

    if (!allNews || allNews.length === 0) {
      return [];
    }

    try {
      console.log("正在生成新闻亮点...");

      // 构建 prompt
      const userPrompt = HIGHLIGHTS_PROMPT.buildPrompt(allNews);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: HIGHLIGHTS_PROMPT.system },
            { role: "user", content: userPrompt },
          ],
          max_tokens: LLM_CONFIG.maxTokens.highlights,
          temperature: HIGHLIGHTS_PROMPT.temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API 请求失败: ${response.status} - ${error}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim() || "";

      // 解析 AI 返回的亮点
      return this._parseHighlights(content, allNews);
    } catch (error) {
      console.error("新闻亮点生成失败:", error.message);
      return [];
    }
  }

  /**
   * 解析 AI 返回的亮点内容
   * 支持多种格式
   */
  _parseHighlights(content, allNews) {
    const highlights = [];

    // 尝试匹配格式: "1. 标题 - 影响"
    const lines = content.split("\n").filter(line => line.trim());

    for (const line of lines) {
      // 匹配数字开头格式
      const numberedMatch = line.match(/^(\d+)[.)\s]+(.+?)(?:\s+[-–—]\s+(.+))?$/);
      if (numberedMatch) {
        const title = numberedMatch[2].trim();
        const impact = numberedMatch[3]?.trim() || "";

        // 在原始新闻中查找匹配项
        const matchedNews = this._findMatchingNews(title, allNews);

        highlights.push({
          title: matchedNews?.title || title,
          url: matchedNews?.url || "",
          impact: impact || "重要市场动态",
          source: matchedNews?.source || "AI 筛选",
          category: matchedNews?.category || "highlights",
        });

        if (highlights.length >= 5) break;
        continue;
      }

      // 匹配标题格式
      const titleMatch = line.match(/^[-•]\s*(.+?)(?:\s+[-–—]\s+(.+))?$/);
      if (titleMatch) {
        const title = titleMatch[1].trim();
        const impact = titleMatch[2]?.trim() || "";

        const matchedNews = this._findMatchingNews(title, allNews);

        highlights.push({
          title: matchedNews?.title || title,
          url: matchedNews?.url || "",
          impact: impact || "值得关注",
          source: matchedNews?.source || "AI 筛选",
          category: "highlights",
        });

        if (highlights.length >= 5) break;
      }
    }

    console.log(`News Highlights: ${highlights.length} items generated`);
    return highlights;
  }

  /**
   * 在原始新闻中查找匹配项
   */
  _findMatchingNews(title, allNews) {
    // 精确匹配标题
    let match = allNews.find(n => n.title === title);
    if (match) return match;

    // 模糊匹配（去除标点和空格后比较）
    const normalizedTitle = title.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
    match = allNews.find(n => {
      const normalized = n.title.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
      return normalized === normalizedTitle || normalized.includes(normalizedTitle);
    });

    return match;
  }
}

module.exports = new NewsHighlightsService();
