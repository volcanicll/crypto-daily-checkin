/**
 * 消息分片工具
 * 用于处理超长消息的分割，支持按字节或字符长度限制
 */

/**
 * 计算字符串的字节长度（UTF-8）
 * @param {string} str 
 * @returns {number}
 */
function getByteLength(str) {
  return Buffer.byteLength(str, 'utf8');
}

/**
 * 将长消息按字节限制分割成多个块
 * 优先在换行符处分割，保持消息格式完整
 * @param {string} content - 消息内容
 * @param {number} maxBytes - 最大字节数
 * @returns {string[]}
 */
function splitMessageByBytes(content, maxBytes) {
  if (getByteLength(content) <= maxBytes) {
    return [content];
  }

  const chunks = [];
  const lines = content.split('\n');
  let currentChunk = '';

  for (const line of lines) {
    const lineWithNewline = currentChunk ? '\n' + line : line;
    const testContent = currentChunk + lineWithNewline;

    if (getByteLength(testContent) <= maxBytes) {
      currentChunk = testContent;
    } else {
      // 当前块已满，保存并开始新块
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      
      // 检查单行是否超过限制
      if (getByteLength(line) > maxBytes) {
        // 如果单行就超过限制，按字符分割
        const splitLine = splitLongLineByBytes(line, maxBytes);
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
 * 分割超长单行（按字节边界）
 * @param {string} line 
 * @param {number} maxBytes 
 * @returns {string[]}
 */
function splitLongLineByBytes(line, maxBytes) {
  const chunks = [];
  let current = '';

  for (const char of line) {
    const test = current + char;
    if (getByteLength(test) <= maxBytes) {
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
 * 将长消息按字符长度限制分割成多个块
 * 优先在换行符处分割，保持消息格式完整
 * @param {string} content - 消息内容
 * @param {number} maxLength - 最大字符数
 * @returns {string[]}
 */
function splitMessageByLength(content, maxLength) {
  if (content.length <= maxLength) {
    return [content];
  }

  const chunks = [];
  const lines = content.split('\n');
  let currentChunk = '';

  for (const line of lines) {
    const lineWithNewline = currentChunk ? '\n' + line : line;
    const testContent = currentChunk + lineWithNewline;

    if (testContent.length <= maxLength) {
      currentChunk = testContent;
    } else {
      // 当前块已满，保存并开始新块
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      
      // 检查单行是否超过限制
      if (line.length > maxLength) {
        // 如果单行就超过限制，按字符分割
        const splitLine = splitLongLineByLength(line, maxLength);
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
 * @param {number} maxLength 
 * @returns {string[]}
 */
function splitLongLineByLength(line, maxLength) {
  const chunks = [];
  let current = '';

  for (const char of line) {
    if ((current + char).length <= maxLength) {
      current += char;
    } else {
      if (current) chunks.push(current);
      current = char;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

module.exports = {
  getByteLength,
  splitMessageByBytes,
  splitMessageByLength,
};
