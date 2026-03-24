/**
 * 并行翻译工具
 * 优化翻译性能，支持批量并行翻译
 */

const { translate } = require("google-translate-api-x");
const { TRANSLATION_CONFIG } = require("../config/constants");

/**
 * 翻译缓存类
 */
class TranslationCache {
  constructor() {
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * 生成缓存键
   */
  _getKey(text, targetLang = "zh-CN") {
    return `${targetLang}:${text.substring(0, 100)}`;
  }

  /**
   * 获取缓存
   */
  get(text, targetLang = "zh-CN") {
    const key = this._getKey(text, targetLang);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < TRANSLATION_CONFIG.translationTTL) {
      this.hits++;
      return cached.result;
    }

    this.misses++;
    return null;
  }

  /**
   * 设置缓存
   */
  set(text, result, targetLang = "zh-CN") {
    const key = this._getKey(text, targetLang);
    this.cache.set(key, {
      result,
      timestamp: Date.now(),
    });
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      total,
      hitRate: total > 0 ? ((this.hits / total) * 100).toFixed(2) + "%" : "0%",
    };
  }

  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

/**
 * 批量翻译器
 */
class TranslationBatcher {
  constructor(options = {}) {
    this.concurrency = options.concurrency || TRANSLATION_CONFIG.batchSize;
    this.delay = options.delay || TRANSLATION_CONFIG.delay;
    this.cache = new TranslationCache();
    this.chineseRegex = TRANSLATION_CONFIG.chineseRegex;
  }

  /**
   * 检查文本是否包含中文
   */
  _isChinese(text) {
    return this.chineseRegex.test(text);
  }

  /**
   * 单条翻译（内部方法）
   */
  async _translateOne(text, targetLang = "zh-CN") {
    // 检查缓存
    const cached = this.cache.get(text, targetLang);
    if (cached) {
      return cached;
    }

    // 检查是否已经是中文
    if (this._isChinese(text)) {
      this.cache.set(text, text, targetLang);
      return text;
    }

    try {
      const result = await translate(text, { to: targetLang });
      const translated = result?.text || text;
      this.cache.set(text, translated, targetLang);
      return translated;
    } catch (error) {
      console.error(`Translation error: ${error.message}`);
      return text; // 失败时返回原文
    }
  }

  /**
   * 将数组分批
   */
  _chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 延迟函数
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 批量翻译数组项
   * @param {Array} items - 需要翻译的项目数组
   * @param {string} targetLang - 目标语言，默认 "zh-CN"
   * @param {Function} getTextFn - 从 item 中获取文本的函数，默认 (item) => item
   * @param {Function} setTextFn - 设置翻译后文本的函数，默认 (item, translated) => item
   */
  async translateBatch(items, targetLang = "zh-CN", getTextFn, setTextFn) {
    if (!items || items.length === 0) {
      return items;
    }

    // 默认：直接翻译字符串数组
    if (typeof getTextFn !== "function") {
      getTextFn = (item) => item;
    }
    if (typeof setTextFn !== "function") {
      setTextFn = (item, translated) => translated;
    }

    // 分批处理
    const batches = this._chunk(items, this.concurrency);

    for (const batch of batches) {
      // 批内并行翻译
      await Promise.all(
        batch.map(async (item) => {
          const text = getTextFn(item);
          if (!text) return;

          const translated = await this._translateOne(text, targetLang);
          setTextFn(item, translated);
        })
      );

      // 批次间延迟（避免触发限流）
      if (this.delay > 0 && batches.indexOf(batch) < batches.length - 1) {
        await this._sleep(this.delay);
      }
    }

    return items;
  }

  /**
   * 翻译对象数组中的指定字段
   * @param {Array} items - 对象数组
   * @param {string|string[]} fields - 要翻译的字段名或字段名数组
   * @param {string} targetLang - 目标语言
   */
  async translateFields(items, fields, targetLang = "zh-CN") {
    const fieldArray = Array.isArray(fields) ? fields : [fields];

    for (const field of fieldArray) {
      await this.translateBatch(
        items,
        targetLang,
        (item) => item?.[field],
        (item, translated) => {
          if (item) {
            item[field] = translated;
          }
        }
      );
    }

    return items;
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * 清空缓存
   */
  clearCache() {
    this.cache.clear();
  }
}

/**
 * 创建默认翻译器实例
 */
const defaultBatcher = new TranslationBatcher();

/**
 * 快捷函数：翻译文本
 */
async function translateToChinese(text) {
  return defaultBatcher._translateOne(text);
}

/**
 * 快捷函数：批量翻译
 */
async function translateBatch(items, getTextFn, setTextFn) {
  return defaultBatcher.translateBatch(items, "zh-CN", getTextFn, setTextFn);
}

/**
 * 快捷函数：翻译对象字段
 */
async function translateFields(items, fields) {
  return defaultBatcher.translateFields(items, fields, "zh-CN");
}

module.exports = {
  TranslationBatcher,
  TranslationCache,
  translateToChinese,
  translateBatch,
  translateFields,
  defaultBatcher,
};
