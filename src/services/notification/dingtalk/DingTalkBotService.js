const crypto = require("crypto");
const { BASE_URL } = require("../../../config/constants");
const { env } = require("../../../config/env");
const { splitMessageByLength } = require("../../../utils/messageSplitter");

// 钉钉机器人文本消息长度限制（字符数）
const MAX_TEXT_LENGTH = 4000;

class DingTalkBotService {
  constructor() {
    this.baseUrl = BASE_URL.DINGTALK;
    this.accessToken = env.dingTalk.accessToken;
    this.secret = env.dingTalk.secret;
  }

  /**
   * 生成签名
   * @param {number} timestamp - 毫秒级时间戳
   * @returns {string} - URL 编码后的签名
   */
  generateSign(timestamp) {
    const stringToSign = `${timestamp}\n${this.secret}`;
    const hmac = crypto.createHmac("sha256", this.secret);
    hmac.update(stringToSign);
    return encodeURIComponent(hmac.digest("base64"));
  }

  /**
   * 构建带签名的请求 URL
   * @returns {string}
   */
  buildRequestUrl() {
    const timestamp = Date.now();
    const sign = this.generateSign(timestamp);
    return `${this.baseUrl}/robot/send?access_token=${this.accessToken}&timestamp=${timestamp}&sign=${sign}`;
  }

  /**
   * 发送单条消息
   * @param {object} config
   * @returns {Promise<object>}
   */
  async sendSingleMessage(config) {
    const url = this.buildRequestUrl();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    return response.json();
  }

  /**
   * 标准化消息配置
   * 支持简化格式 { msgtype, content } 自动转换为钉钉 API 所需格式
   * @param {string|object} messageOrConfig
   * @returns {object}
   */
  normalizeConfig(messageOrConfig) {
    // 字符串 -> text 消息
    if (typeof messageOrConfig === "string") {
      return { msgtype: "text", text: { content: messageOrConfig } };
    }

    const { msgtype, content, title, ...rest } = messageOrConfig;

    // 已经是完整格式（有 text 或 markdown 字段），直接返回
    if (messageOrConfig.text || messageOrConfig.markdown) {
      return messageOrConfig;
    }

    // 简化格式 { msgtype, content } -> 完整格式
    if (msgtype === "text") {
      return { msgtype: "text", text: { content }, ...rest };
    }

    if (msgtype === "markdown") {
      return {
        msgtype: "markdown",
        markdown: {
          title: title || "消息通知",
          text: content,
        },
        ...rest,
      };
    }

    // 其他格式，原样返回
    return messageOrConfig;
  }

  /**
   * 发送消息（自动分片处理超长文本消息）
   * @param {string|object} messageOrConfig - 支持以下格式：
   *   - 字符串：直接作为 text 消息发送
   *   - { msgtype: 'text', content: '...' }：简化 text 格式
   *   - { msgtype: 'markdown', content: '...', title?: '...' }：简化 markdown 格式
   *   - { msgtype: 'text', text: { content: '...' } }：完整 text 格式
   *   - { msgtype: 'markdown', markdown: { title: '...', text: '...' } }：完整 markdown 格式
   * @returns {Promise<object>}
   */
  async sendMessage(messageOrConfig) {
    // 检查配置
    if (!this.accessToken || !this.secret) {
      console.warn("钉钉机器人：配置缺失，跳过发送");
      return { errcode: -1, errmsg: "Configuration missing" };
    }

    try {
      // 标准化配置
      const config = this.normalizeConfig(messageOrConfig);

      // 仅对文本消息进行分片处理，markdown 不校验长度
      if (config.msgtype === "text" && config.text?.content) {
        const content = config.text.content;
        const chunks = splitMessageByLength(content, MAX_TEXT_LENGTH);

        if (chunks.length > 1) {
          console.log(`钉钉机器人：消息过长，将分 ${chunks.length} 条发送...`);
        }

        for (let i = 0; i < chunks.length; i++) {
          const chunkConfig = {
            ...config,
            text: {
              ...config.text,
              content:
                chunks.length > 1
                  ? `📋 [${i + 1}/${chunks.length}]\n\n${chunks[i]}`
                  : chunks[i],
            },
          };

          const result = await this.sendSingleMessage(chunkConfig);

          if (result.errcode === 0) {
            console.log(
              `钉钉机器人：消息 ${i + 1}/${chunks.length} 发送成功！`
            );
          } else {
            console.error(
              `钉钉机器人：消息 ${i + 1}/${chunks.length} 发送失败！`,
              result
            );
          }

          // 分片发送时增加延迟，避免触发频率限制
          if (i < chunks.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }

        return { errcode: 0, errmsg: "ok" };
      } else {
        // 非文本消息（如 markdown），直接发送，不校验长度
        const result = await this.sendSingleMessage(config);
        if (result.errcode === 0) {
          console.log("钉钉机器人：消息发送成功！");
        } else {
          console.error("钉钉机器人：消息发送失败！", result);
        }
        return result;
      }
    } catch (error) {
      console.error("钉钉机器人：消息发送异常！", error);
      return { errcode: -3, errmsg: error.message };
    }
  }

  /**
   * 发送 Markdown 消息（不校验长度）
   * @param {string} title - 消息标题
   * @param {string} text - Markdown 内容
   * @returns {Promise<object>}
   */
  async sendMarkdown(title, text) {
    return this.sendMessage({
      msgtype: "markdown",
      markdown: {
        title,
        text,
      },
    });
  }

  /**
   * 发送带 @ 的消息
   * @param {string} content - 消息内容
   * @param {string[]} atMobiles - 要 @ 的手机号列表
   * @param {boolean} isAtAll - 是否 @ 所有人
   * @returns {Promise<object>}
   */
  async sendTextWithAt(content, atMobiles = [], isAtAll = true) {
    return this.sendMessage({
      msgtype: "text",
      text: { content },
      at: {
        atMobiles,
        isAtAll,
      },
    });
  }
}

module.exports = new DingTalkBotService();
