const axios = require('axios');

class HttpClient {
  constructor(baseURL = '') {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        // 'Content-Type': 'application/json' // Removed to avoid issues with some APIs
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // Add response interceptor for error handling
    this.instance.interceptors.response.use(
      response => response,
      error => {
        console.error('API Request Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  async get(url, config = {}) {
    try {
      const response = await this.instance.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post(url, data, config = {}) {
    try {
      const response = await this.instance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HttpClient;

