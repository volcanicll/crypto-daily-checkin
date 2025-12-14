/**
 * LLM 服务 - 使用 OpenAI 兼容格式调用 LLM API
 * 支持 OpenRouter 等兼容 OpenAI 的服务
 */

const { env } = require('../../config/env');

class LLMService {
  constructor() {
    this.apiKey = env.llm.apiKey;
    this.baseUrl = env.llm.baseUrl;
    this.model = env.llm.model;
  }

  /**
   * 生成日报锐评
   * @param {object} context - 包含各模块数据的上下文
   * @param {object} context.goldData - 金价数据
   * @param {object} context.cryptoData - 加密货币数据
   * @param {Array} context.aiNews - AI 新闻
   * @returns {Promise<string|null>} 锐评内容
   */
  async generateCommentary(context) {
    if (!this.apiKey) {
      console.warn('LLM API Key 未配置，跳过锐评生成');
      return null;
    }

    try {
      const prompt = this.buildPrompt(context);
      const response = await this.callAPI(prompt);
      return response;
    } catch (error) {
      console.error('LLM 锐评生成失败:', error.message);
      return null;
    }
  }

  /**
   * 构建 prompt
   * @param {object} context 
   * @returns {string}
   */
  buildPrompt(context) {
    const { goldData, cryptoData, aiNews } = context;

    let dataContext = '## 今日数据摘要\n\n';

    // 金价数据
    if (goldData) {
      dataContext += '### 金价\n';
      if (goldData.cn_gold) {
        dataContext += `- 国内金价: ¥${goldData.cn_gold.price?.toFixed(2)}/g (${goldData.cn_gold.change_percent > 0 ? '+' : ''}${goldData.cn_gold.change_percent?.toFixed(2)}%)\n`;
      }
      if (goldData.ny_gold) {
        dataContext += `- 纽约金价: $${goldData.ny_gold.price?.toFixed(2)}/oz (${goldData.ny_gold.change_percent > 0 ? '+' : ''}${goldData.ny_gold.change_percent?.toFixed(2)}%)\n`;
      }
      dataContext += '\n';
    }

    // 加密货币数据
    if (cryptoData?.marketData?.length > 0) {
      dataContext += '### 加密货币行情\n';
      cryptoData.marketData.slice(0, 5).forEach(coin => {
        const change = coin.price_change_percentage_24h?.toFixed(2);
        dataContext += `- ${coin.symbol?.toUpperCase()}: $${coin.current_price?.toLocaleString()} (${change > 0 ? '+' : ''}${change}%)\n`;
      });
      dataContext += '\n';
    }

    // 恐慌贪婪指数
    if (cryptoData?.sentimentData) {
      dataContext += `### 市场情绪\n`;
      dataContext += `- 恐慌贪婪指数: ${cryptoData.sentimentData.value} (${cryptoData.sentimentData.classification})\n\n`;
    }

    // AI 新闻
    if (aiNews?.length > 0) {
      dataContext += '### AI 前沿资讯（标题）\n';
      aiNews.slice(0, 3).forEach(news => {
        dataContext += `- ${news.title}\n`;
      });
      dataContext += '\n';
    }

    return dataContext;
  }

  /**
   * 调用 LLM API
   * @param {string} userPrompt 
   * @returns {Promise<string>}
   */
  async callAPI(userPrompt) {
    const systemPrompt = `你是一位风趣幽默的财经评论员，擅长用简短有力的语言对市场动态进行锐评。

要求：
1. 语言风格：简洁、犀利、幽默，带有网感
2. 内容长度：控制在 100 字以内
3. 评论角度：可以调侃市场、给出独到观点、或用有趣的比喻
4. 格式：直接输出评论内容，不要加任何标题或前缀
5. 如果数据不足，可以根据现有信息发挥

记住：你的目标是让读者会心一笑的同时，也能获得一点洞察。`;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API 请求失败: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  }
}

module.exports = new LLMService();
