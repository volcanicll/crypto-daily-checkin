/**
 * 结构化日志工具
 * 提供统一的日志接口和格式化输出
 */

/**
 * 日志级别
 */
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

/**
 * 获取当前日志级别
 */
function getCurrentLevel() {
  const envLevel = process.env.LOG_LEVEL?.toUpperCase();
  return LogLevel[envLevel] ?? LogLevel.INFO;
}

/**
 * 格式化日志消息
 */
function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";

  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

class Logger {
  constructor(options = {}) {
    this.context = options.context || "";
    this.level = options.level ?? getCurrentLevel();
    this.enableConsole = options.enableConsole ?? true;
  }

  /**
   * 创建子 logger（带上下文）
   */
  child(childContext) {
    const newContext = this.context ? `${this.context}:${childContext}` : childContext;
    return new Logger({
      context: newContext,
      level: this.level,
      enableConsole: this.enableConsole,
    });
  }

  /**
   * 添加上下文前缀
   */
  _addContext(message) {
    return this.context ? `[${this.context}] ${message}` : message;
  }

  /**
   * 日志输出
   */
  _log(level, levelName, message, meta) {
    if (level < this.level) return;

    const formattedMessage = formatMessage(levelName, this._addContext(message), meta);

    if (this.enableConsole) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage);
          break;
      }
    }
  }

  debug(message, meta) {
    this._log(LogLevel.DEBUG, "DEBUG", message, meta);
  }

  info(message, meta) {
    this._log(LogLevel.INFO, "INFO", message, meta);
  }

  warn(message, meta) {
    this._log(LogLevel.WARN, "WARN", message, meta);
  }

  error(message, meta) {
    this._log(LogLevel.ERROR, "ERROR", message, meta);
  }

  /**
   * 跟踪操作时间
   */
  track(module, action, duration, meta = {}) {
    this.info(`${action} completed`, {
      module,
      action,
      duration_ms: duration,
      ...meta,
    });
  }

  /**
   * 跟踪错误
   */
  trackError(module, action, error, meta = {}) {
    this.error(`${action} failed`, {
      module,
      action,
      error: error.message,
      stack: error.stack,
      ...meta,
    });
  }
}

/**
 * 创建默认 logger 实例
 */
const defaultLogger = new Logger();

/**
 * 模块 logger 工厂
 */
function createLogger(moduleName) {
  return defaultLogger.child(moduleName);
}

module.exports = {
  Logger,
  LogLevel,
  defaultLogger,
  createLogger,
};
