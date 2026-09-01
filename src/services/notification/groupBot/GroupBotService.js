const { BASE_URL, API_CONFIG } = require("../../../config/constants");
const { env } = require("../../../config/env");

// 微信群机器人文本消息限制 2048 字节，预留一些空间
const MAX_MESSAGE_BYTES = 1800;

class GroupBotService {
  constructor() {
    this.baseUrl = BASE_URL.WEIXIN;
  }

  /**
   * 计算字符串的字节长度（UTF-8）
   * @param {string} str 
   * @returns {number}
   */
  getByteLength(str) {
    return Buffer.byteLength(str, 'utf8');
  }

  /**
   * 将长消息按字节限制分割成多个块
   * 优先在换行符处分割，保持消息格式完整
   * @param {string} content 
   * @param {number} maxBytes 
   * @returns {string[]}
   */
  splitMessage(content, maxBytes = MAX_MESSAGE_BYTES) {
    if (this.getByteLength(content) <= maxBytes) {
      return [content];
    }

    const chunks = [];
    const lines = content.split('\n');
    let currentChunk = '';

    for (const line of lines) {
      const lineWithNewline = currentChunk ? '\n' + line : line;
      const testContent = currentChunk + lineWithNewline;

      if (this.getByteLength(testContent) <= maxBytes) {
        currentChunk = testContent;
      } else {
        // 当前块已满，保存并开始新块
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        
        // 检查单行是否超过限制
        if (this.getByteLength(line) > maxBytes) {
          // 如果单行就超过限制，按字符分割
          const splitLine = this.splitLongLine(line, maxBytes);
          chunks.push(...splitLine.slice(0, -1));
          currentChunk = splitLine[splitLine.length - 1] || '';
        } else {
          currentChunk = line;
        }
      }
    }

    // 添加最后一块
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  /**
   * 分割超长单行（按字符边界）
   * @param {string} line 
   * @param {number} maxBytes 
   * @returns {string[]}
   */
  splitLongLine(line, maxBytes) {
    const chunks = [];
    let current = '';

    for (const char of line) {
      const test = current + char;
      if (this.getByteLength(test) <= maxBytes) {
        current = test;
      } else {
        if (current) chunks.push(current);
        current = char;
      }
    }

    if (current) chunks.push(current);
    return chunks;
  }

  /**
   * 发送单条消息
   * @param {object} config 
   * @returns {Promise<object>}
   */
  async sendSingleMessage(config) {
    const response = await fetch(
      `${this.baseUrl}/cgi-bin/webhook/send?key=${env.wxBot.key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
        signal: AbortSignal.timeout(API_CONFIG.timeout),
      }
    );

    return response.json();
  }

  /**
   * 发送消息（自动分片处理超长消息）
   * @param {object} config 
   */
  async sendMessage(config) {
    try {
      // 检查是否是文本消息且需要分割
      if (config.msgtype === 'text' && config.text?.content) {
        const content = config.text.content;
        const chunks = this.splitMessage(content);

        if (chunks.length > 1) {
          console.log(`群机器人：消息过长，将分 ${chunks.length} 条发送...`);
        }

        for (let i = 0; i < chunks.length; i++) {
          const chunkConfig = {
            ...config,
            text: {
              ...config.text,
              content: chunks.length > 1 
                ? `📋 [${i + 1}/${chunks.length}]\n\n${chunks[i]}` 
                : chunks[i],
            },
          };

          const result = await this.sendSingleMessage(chunkConfig);

          if (result.errcode === 0) {
            console.log(`群机器人：消息 ${i + 1}/${chunks.length} 发送成功！`);
          } else {
            console.error(`群机器人：消息 ${i + 1}/${chunks.length} 发送失败！`, result);
          }

          // 分片发送时增加延迟，避免触发频率限制
          if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      } else {
        // 非文本消息，直接发送
        const result = await this.sendSingleMessage(config);
        if (result.errcode === 0) {
          console.log("群机器人：消息发送成功！");
        } else {
          console.error("群机器人：消息发送失败！", result);
        }
      }
    } catch (error) {
      console.error("群机器人：消息发送失败！", error);
    }
  }
}

module.exports = new GroupBotService();
