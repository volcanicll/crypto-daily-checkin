const { getMarketData } = require("./crypto/market");
const { getCryptoNews } = require("./crypto/news");
const { getGoldPrice } = require("./finance/gold");
const { getAINews } = require("./tech/aiNews");
const { getAgentCodeNews } = require("./tech/agentCodeNews");
const { getFearAndGreedIndex } = require("./crypto/sentiment");
const llmService = require("./llm/LLMService");

const { formatCrypto } = require("../utils/formatters/CryptoFormatter");
const { formatGold } = require("../utils/formatters/GoldFormatter");
const { formatAiNews } = require("../utils/formatters/AiNewsFormatter");
const { formatAgentCode } = require("../utils/formatters/AgentCodeFormatter");
const { formatCommentary } = require("../utils/formatters/CommentaryFormatter");
const {
  formatAiRecommendations,
} = require("../utils/formatters/AiRecommendationsFormatter");
const {
  messageHeader,
  divider,
} = require("../utils/formatters/DingTalkMarkdownUtils");
const { contentModules } = require("../config/modules");

class DailyReportGenerator {
  /**
   * Encapsulate Crypto info fetching
   */
  async getCryptoReportSource() {
    try {
      const [marketData, newsData, sentimentData] = await Promise.all([
        getMarketData(),
        getCryptoNews(),
        getFearAndGreedIndex(),
      ]);
      return { marketData, newsData, sentimentData };
    } catch (error) {
      console.error("Error fetching crypto info:", error);
      return { marketData: [], newsData: [], sentimentData: null };
    }
  }

  /**
   * Generate the full daily message based on enabled modules
   * @returns {Promise<string>}
   */
  async generateDailyMessage() {
    try {
      console.log(
        "启用的内容模块:",
        Object.entries(contentModules)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(", ")
      );

      // 并行获取所有启用模块的数据
      const dataPromises = {};

      if (contentModules.gold) {
        dataPromises.gold = getGoldPrice().catch((e) => {
          console.error("Gold fetch error", e);
          return null;
        });
      }

      if (contentModules.crypto) {
        dataPromises.crypto = this.getCryptoReportSource();
      }

      if (contentModules.aiNews) {
        dataPromises.aiNews = getAINews().catch((e) => {
          console.error("AI News fetch error", e);
          return [];
        });
      }

      if (contentModules.agentCode) {
        dataPromises.agentCode = getAgentCodeNews().catch((e) => {
          console.error("Agent Code News fetch error", e);
          return [];
        });
      }

      // 等待所有数据获取完成
      const keys = Object.keys(dataPromises);
      const values = await Promise.all(Object.values(dataPromises));
      const data = keys.reduce((acc, key, i) => {
        acc[key] = values[i];
        return acc;
      }, {});

      // LLM 锐评需要其他模块数据，单独处理
      let commentary = null;
      if (contentModules.llmCommentary) {
        console.log("正在生成 AI 锐评...");
        commentary = await llmService.generateCommentary({
          goldData: data.gold || null,
          cryptoData: data.crypto || {
            marketData: [],
            newsData: [],
            sentimentData: null,
          },
          aiNews: data.aiNews || [],
        });
      }

      // 按配置顺序格式化内容
      const formattedParts = [];

      if (contentModules.gold && data.gold) {
        formattedParts.push(formatGold(data.gold));
      }

      if (contentModules.crypto && data.crypto) {
        formattedParts.push(formatCrypto(data.crypto));
      }

      if (contentModules.aiNews && data.aiNews) {
        formattedParts.push(formatAiNews(data.aiNews));
      }

      if (contentModules.agentCode && data.agentCode) {
        formattedParts.push(formatAgentCode(data.agentCode));
      }

      // AI 精选推荐：合并所有资讯，让 AI 筛选最有价值的
      let aiRecommendations = null;
      if (contentModules.aiRecommendations) {
        const allNews = [...(data.aiNews || []), ...(data.agentCode || [])];
        if (allNews.length > 0) {
          console.log("正在生成 AI 精选推荐...");
          aiRecommendations = await llmService.generateRecommendations(
            allNews,
            6
          );
        }
      }

      if (aiRecommendations && aiRecommendations.length > 0) {
        formattedParts.push(formatAiRecommendations(aiRecommendations));
      }

      if (contentModules.llmCommentary && commentary) {
        formattedParts.push(formatCommentary(commentary));
      }

      // Filter out empty strings
      const validParts = formattedParts.filter(
        (part) => part && part.trim() !== ""
      );

      if (validParts.length === 0) {
        return "暂无内容 📭";
      }

      // 添加消息头和分隔线
      const header = messageHeader();
      const separator = divider();
      const message = header + separator + validParts.join(separator);
      console.log("Generated Message Preview:\n", message);
      return message;
    } catch (error) {
      console.error("Failed to generate daily message:", error);
      return `消息生成失败！💔`;
    }
  }
}

module.exports = new DailyReportGenerator();
