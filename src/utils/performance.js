/**
 * 性能监控工具
 * 跟踪各模块的执行时间和性能指标
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.activeTracks = new Map();
  }

  /**
   * 开始跟踪操作
   * @param {string} module - 模块名
   * @param {string} action - 操作名
   * @returns {string} 跟踪 ID
   */
  start(module, action) {
    const trackId = `${module}:${action}:${Date.now()}`;
    this.activeTracks.set(trackId, {
      module,
      action,
      startTime: Date.now(),
    });
    return trackId;
  }

  /**
   * 结束跟踪操作
   * @param {string} trackId - 跟踪 ID
   * @returns {number} 耗时（毫秒）
   */
  end(trackId) {
    const track = this.activeTracks.get(trackId);
    if (!track) {
      console.warn(`Performance track ${trackId} not found`);
      return 0;
    }

    const duration = Date.now() - track.startTime;
    this.activeTracks.delete(trackId);

    // 记录指标
    const key = `${track.module}:${track.action}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        module: track.module,
        action: track.action,
        count: 0,
        totalTime: 0,
        minTime: Infinity,
        maxTime: 0,
      });
    }

    const metric = this.metrics.get(key);
    metric.count++;
    metric.totalTime += duration;
    metric.minTime = Math.min(metric.minTime, duration);
    metric.maxTime = Math.max(metric.maxTime, duration);

    return duration;
  }

  /**
   * 跟踪异步函数
   * @param {string} module - 模块名
   * @param {string} action - 操作名
   * @param {Function} fn - 要执行的异步函数
   * @returns {Promise<any>} 函数执行结果
   */
  async track(module, action, fn) {
    const trackId = this.start(module, action);
    try {
      return await fn();
    } finally {
      this.end(trackId);
    }
  }

  /**
   * 获取指定模块/操作的指标
   * @param {string} module - 模块名（可选）
   * @param {string} action - 操作名（可选）
   * @returns {Array} 指标数组
   */
  getMetrics(module = null, action = null) {
    const metrics = [];

    for (const [key, metric] of this.metrics.entries()) {
      if (module && metric.module !== module) continue;
      if (action && metric.action !== action) continue;

      metrics.push({
        ...metric,
        avgTime: metric.count > 0 ? metric.totalTime / metric.count : 0,
      });
    }

    return metrics;
  }

  /**
   * 生成性能报告
   * @returns {string} 格式化的性能报告
   */
  report() {
    if (this.metrics.size === 0) {
      return "暂无性能数据";
    }

    let report = "\n📊 性能报告\n";
    report += "=" .repeat(50) + "\n";

    // 按模块分组
    const byModule = new Map();
    for (const metric of this.metrics.values()) {
      if (!byModule.has(metric.module)) {
        byModule.set(metric.module, []);
      }
      byModule.get(metric.module).push(metric);
    }

    // 输出每个模块的指标
    for (const [module, metrics] of byModule.entries()) {
      report += `\n【${module}】\n`;

      // 按总时间排序
      metrics.sort((a, b) => b.totalTime - a.totalTime);

      for (const metric of metrics) {
        const avgTime = (metric.totalTime / metric.count).toFixed(0);
        report += `  ${metric.action}: `;
        report += `平均 ${avgTime}ms | `;
        report += `总计 ${metric.totalTime}ms | `;
        report += `次数 ${metric.count}\n`;
      }
    }

    // 计算总时间
    let grandTotal = 0;
    for (const metric of this.metrics.values()) {
      grandTotal += metric.totalTime;
    }

    report += "\n" + "=".repeat(50) + "\n";
    report += `总耗时: ${grandTotal}ms (${(grandTotal / 1000).toFixed(2)}s)\n`;

    return report;
  }

  /**
   * 生成简短摘要（用于日志末尾）
   * @returns {string} 简短的性能摘要
   */
  summary() {
    if (this.metrics.size === 0) {
      return "";
    }

    let total = 0;
    let slowest = { time: 0, name: "" };

    for (const [key, metric] of this.metrics.entries()) {
      total += metric.totalTime;
      if (metric.totalTime > slowest.time) {
        slowest = {
          time: metric.totalTime,
          name: `${metric.module}:${metric.action}`,
        };
      }
    }

    return `\n⏱️ 性能: ${(total / 1000).toFixed(1)}s | 最慢: ${slowest.name} (${(slowest.time / 1000).toFixed(1)}s)`;
  }

  /**
   * 清空所有指标
   */
  reset() {
    this.metrics.clear();
    this.activeTracks.clear();
  }

  /**
   * 获取慢速操作列表
   * @param {number} threshold - 时间阈值（毫秒）
   * @returns {Array} 慢速操作列表
   */
  getSlowOperations(threshold = 1000) {
    const slow = [];

    for (const [key, metric] of this.metrics.entries()) {
      const avgTime = metric.totalTime / metric.count;
      if (avgTime > threshold) {
        slow.push({
          ...metric,
          avgTime,
        });
      }
    }

    return slow.sort((a, b) => b.avgTime - a.avgTime);
  }
}

/**
 * 创建默认性能监控实例
 */
const defaultPerf = new PerformanceMonitor();

module.exports = {
  PerformanceMonitor,
  defaultPerf,
};
