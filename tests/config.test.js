const { describe, it, expect } = require("bun:test");

// 清除环境变量，确保测试验证的是配置的默认行为而非 CI 环境中的 secret 值
const _envKeys = [
  "NOTIFY_TELEGRAM",
  "NOTIFY_DINGTALK",
  "NOTIFY_WX_BOT",
  "NOTIFY_WX_APP",
  "MODULE_GOLD",
  "MODULE_CRYPTO",
  "MODULE_AI_NEWS",
  "MODULE_HORIZON",
  "MODULE_V2EX",
  "MODULE_MACRO_NEWS",
  "MODULE_NEWS_HIGHLIGHTS",
  "MODULE_X_TWITTER",
  "MODULE_AI_RECOMMENDATIONS",
  "MODULE_LLM_COMMENTARY",
  "MODULE_WEATHER",
  "MODULE_QUOTE",
  "MODULE_AI_MODELS",
  "MODULE_GITHUB_STARS",
  "MODULE_PRODUCT_HUNT",
  "MODULE_REDDIT",
  "MODULE_JUEJIN",
  "MODULE_SEGMENTFAULT",
  "MODULE_AGENT_CODE",
  "MODULE_LEETCODE",
  "MODULE_TECH_HISTORY",
  "MODULE_SECURITY_RADAR",
];
_envKeys.forEach((k) => delete process.env[k]);

const {
  contentModules,
  notificationServices,
  isContentModuleEnabled,
  getEnabledContentModules,
  getEnabledNotifications,
} = require("../src/config/modules");
const { env, getEnv, validateEnv } = require("../src/config/env");

describe("contentModules 默认开关", () => {
  it("默认启用的模块为 true", () => {
    expect(contentModules.gold).toBe(true);
    expect(contentModules.crypto).toBe(true);
    expect(contentModules.aiNews).toBe(true);
    expect(contentModules.horizon).toBe(true);
    expect(contentModules.reddit).toBe(true);
  });

  it("需要显式开启的模块默认为 false", () => {
    expect(contentModules.xTwitter).toBe(false);
    expect(contentModules.weather).toBe(false);
    expect(contentModules.quote).toBe(false);
    expect(contentModules.productHunt).toBe(false);
  });
});

describe("notificationServices 默认开关", () => {
  it("Telegram 和钉钉默认启用", () => {
    expect(notificationServices.telegram).toBe(true);
    expect(notificationServices.dingtalk).toBe(true);
  });

  it("企业微信渠道默认禁用", () => {
    expect(notificationServices.wxBot).toBe(false);
    expect(notificationServices.wxApp).toBe(false);
  });

  it("getEnabledNotifications 只返回启用的渠道", () => {
    const enabled = getEnabledNotifications();
    expect(enabled).toContain("telegram");
    expect(enabled).not.toContain("wxBot");
  });
});

describe("isContentModuleEnabled / getEnabledContentModules", () => {
  it("已启用模块返回 true", () => {
    expect(isContentModuleEnabled("gold")).toBe(true);
  });

  it("未启用模块返回 false", () => {
    expect(isContentModuleEnabled("weather")).toBe(false);
  });

  it("未知模块返回 false 而不是抛错", () => {
    expect(isContentModuleEnabled("nonexistent")).toBe(false);
  });

  it("getEnabledContentModules 返回非空列表", () => {
    expect(getEnabledContentModules().length).toBeGreaterThan(0);
  });
});

describe("env 工具函数", () => {
  it("getEnv 支持点号路径", () => {
    expect(getEnv("llm.baseUrl")).toBe(env.llm.baseUrl);
  });

  it("getEnv 路径不存在时返回默认值", () => {
    expect(getEnv("no.such.key", "fallback")).toBe("fallback");
  });

  it("validateEnv 检出缺失的必填项", () => {
    const result = validateEnv(["no.such.key"]);
    expect(result.valid).toBe(false);
    expect(result.missing).toEqual(["no.such.key"]);
  });

  it("validateEnv 对已有默认值的配置项通过", () => {
    const result = validateEnv(["llm.baseUrl"]);
    expect(result.valid).toBe(true);
  });
});
