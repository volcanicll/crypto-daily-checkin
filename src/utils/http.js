const axios = require('axios');
const https = require('https');
const { API_CONFIG } = require('../config/constants');

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 计算重试延迟（指数退避）
 */
function calculateRetryDelay(attempt, initialDelay, multiplier) {
  return initialDelay * Math.pow(multiplier, attempt);
}

/**
 * 判断错误是否可重试
 */
function isRetryableError(error) {
  // 网络错误
  if (!error.response) {
    return true;
  }

  // 429 Too Many Requests
  if (error.response?.status === 429) {
    return true;
  }

  // 5xx 服务器错误
  if (error.response?.status >= 500) {
    return true;
  }

  // 408 Request Timeout
  if (error.response?.status === 408) {
    return true;
  }

  return false;
}

class HttpClient {
  constructor(baseURL = '', options = {}) {
    this.baseURL = baseURL;
    this.timeout = options.timeout || API_CONFIG.timeout;
    this.maxRetries = options.maxRetries ?? API_CONFIG.retryAttempts;
    this.retryInitialDelay = options.retryInitialDelay || API_CONFIG.retryInitialDelay;
    this.retryMultiplier = options.retryMultiplier || API_CONFIG.retryMultiplier;

    this.instance = axios.create({
      baseURL,
      timeout: this.timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      httpsAgent: new https.Agent({
        // 只在开发环境禁用证书验证
        rejectUnauthorized: process.env.NODE_ENV !== 'development'
      })
    });

    // 请求拦截器 - 记录请求时间
    this.instance.interceptors.request.use(
      config => {
        config.metadata = { startTime: Date.now() };
        return config;
      },
      error => Promise.reject(error)
    );

    // 响应拦截器 - 错误处理和日志
    this.instance.interceptors.response.use(
      response => {
        const duration = Date.now() - response.config.metadata?.startTime;
        response.config.metadata = { ...response.config.metadata, duration };
        return response;
      },
      error => {
        console.error(`API Request Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * 执行带重试的请求
   */
  async _requestWithRetry(requestFn, attempt = 0) {
    try {
      return await requestFn();
    } catch (error) {
      // 检查是否应该重试
      if (attempt >= this.maxRetries || !isRetryableError(error)) {
        throw error;
      }

      // 计算延迟并重试
      const delay = calculateRetryDelay(attempt, this.retryInitialDelay, this.retryMultiplier);
      console.warn(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${this.maxRetries})`);

      await sleep(delay);
      return this._requestWithRetry(requestFn, attempt + 1);
    }
  }

  async get(url, config = {}) {
    return this._requestWithRetry(async () => {
      const response = await this.instance.get(url, config);
      return response.data;
    });
  }

  async post(url, data, config = {}) {
    return this._requestWithRetry(async () => {
      const response = await this.instance.post(url, data, config);
      return response.data;
    });
  }

  /**
   * 获取实例（用于高级用法）
   */
  getAxiosInstance() {
    return this.instance;
  }
}

module.exports = HttpClient;
