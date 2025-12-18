const weatherService = require("./lifestyle/WeatherService");
const quoteService = require("./lifestyle/QuoteService");
const { getMarketData } = require("./crypto/market");
const { getCryptoNews } = require("./crypto/news");
const { getGoldPrice } = require("./finance/gold");
const { getAINews } = require("./tech/aiNews");
const { getFearAndGreedIndex } = require("./crypto/sentiment");
const llmService = require("./llm/LLMService");

const { formatWeather } = require("../utils/formatters/WeatherFormatter");
const { formatQuote } = require("../utils/formatters/QuoteFormatter");
const { formatCrypto } = require("../utils/formatters/CryptoFormatter");
const { formatGold } = require("../utils/formatters/GoldFormatter");
const { formatAiNews } = require("../utils/formatters/AiNewsFormatter");
const { formatCommentary } = require("../utils/formatters/CommentaryFormatter");
const { GREETINGS } = require("../config/constants");

class DailyReportGenerator {
  /**
   * Get random greeting
   * @returns {string}
   */
  getRandomGreeting() {
    const randomIndex = Math.floor(Math.random() * GREETINGS.size);
    return GREETINGS.get(randomIndex);
  }

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
   * Generate the full daily message
   * @returns {Promise<string>}
   */
  async generateDailyMessage() {
    try {
      // Order: Gold -> Crypto -> AI News -> LLM Commentary
      const [goldData, cryptoData, aiNews] = await Promise.all([
        getGoldPrice().catch((e) => {
          console.error("Gold fetch error", e);
          return null;
        }),
        this.getCryptoReportSource(),
        getAINews().catch((e) => {
          console.error("AI News fetch error", e);
          return [];
        }),
      ]);

      console.log("正在生成 AI 锐评...");
      const commentary = await llmService.generateCommentary({
        goldData,
        cryptoData,
        aiNews,
      });

      const formattedParts = [
        formatGold(goldData),
        formatCrypto(cryptoData),
        formatAiNews(aiNews),
        formatCommentary(commentary),
      ];

      // Filter out empty strings
      const validParts = formattedParts.filter(
        (part) => part && part.trim() !== ""
      );

      const message = `${validParts.join("\n\n")}`;
      console.log("Generated Message Preview:\n", message);
      return message;
    } catch (error) {
      console.error("Failed to generate daily message:", error);
      return `消息生成失败！💔`;
    }
  }
}

module.exports = new DailyReportGenerator();
