/**
 * RSS 增强缓存
 * 缓存 RSS feed 响应，减少重复请求
 */

const { CACHE_CONFIG } = require("../config/constants");

/**
 * 内存缓存项
 */
class CacheItem {
  constructor(data, ttl) {
    this.data = data;
    this.expiresAt = Date.now() + ttl;
  }

  isExpired() {
    return Date.now() > this.expiresAt;
  }
}

/**
 * RSS 缓存类
 */
class RSSEnhancedCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.defaultTTL = options.ttl || CACHE_CONFIG.rssTTL;
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * 生成缓存键
   */
  _getKey(url) {
    return `rss:${url}`;
  }

  /**
   * 获取缓存
   * @param {string} url - RSS URL
   * @returns {string|null} 缓存的 RSS 内容或 null
   */
  get(url) {
    const key = this._getKey(url);
    const item = this.cache.get(key);

    if (!item) {
      this.misses++;
      return null;
    }

    if (item.isExpired()) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return item.data;
  }

  /**
   * 设置缓存
   * @param {string} url - RSS URL
   * @param {string} data - RSS 内容
   * @param {number} ttl - 过期时间（毫秒）
   */
  set(url, data, ttl = this.defaultTTL) {
    const key = this._getKey(url);
    this.cache.set(key, new CacheItem(data, ttl));

    // 定期清理过期缓存
    if (this.cache.size > 100) {
      this._cleanup();
    }
  }

  /**
   * 获取或抓取 RSS
   * @param {string} url - RSS URL
   * @param {Function} fetchFn - 抓取函数
   * @returns {Promise<string>} RSS 内容
   */
  async getOrFetch(url, fetchFn) {
    // 先检查缓存
    const cached = this.get(url);
    if (cached !== null) {
      return cached;
    }

    // 缓存未命中，执行抓取
    const data = await fetchFn();

    // 存入缓存
    this.set(url, data);

    return data;
  }

  /**
   * 清理过期缓存项
   */
  _cleanup() {
    for (const [key, item] of this.cache.entries()) {
      if (item.isExpired()) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      total,
      hitRate: total > 0 ? ((this.hits / total) * 100).toFixed(2) + "%" : "0%",
    };
  }

  /**
   * 获取缓存大小
   */
  size() {
    return this.cache.size;
  }
}

/**
 * 创建默认 RSS 缓存实例
 */
const defaultRSSCache = new RSSEnhancedCache();

module.exports = {
  RSSEnhancedCache,
  defaultRSSCache,
};
