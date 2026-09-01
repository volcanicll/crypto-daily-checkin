const { describe, it, expect } = require("bun:test");
const {
  getByteLength,
  splitMessageByBytes,
  splitMessageByLength,
} = require("../src/utils/messageSplitter");

describe("getByteLength", () => {
  it("计算 ASCII 字节长度", () => {
    expect(getByteLength("abc")).toBe(3);
  });

  it("计算中文 UTF-8 字节长度（每字 3 字节）", () => {
    expect(getByteLength("中文")).toBe(6);
  });

  it("混合中英文", () => {
    expect(getByteLength("a中b文")).toBe(8);
  });
});

describe("splitMessageByBytes", () => {
  it("短消息不分片", () => {
    expect(splitMessageByBytes("hello", 100)).toEqual(["hello"]);
  });

  it("多行消息按换行分片", () => {
    const content = "line1\nline2\nline3\nline4";
    const chunks = splitMessageByBytes(content, 12);
    expect(chunks.length).toBeGreaterThan(1);
    // 每片都不超限
    for (const chunk of chunks) {
      expect(getByteLength(chunk)).toBeLessThanOrEqual(12);
    }
  });

  it("内容完整不丢失", () => {
    const content = Array.from({ length: 50 }, (_, i) => `第${i}行内容`).join("\n");
    const chunks = splitMessageByBytes(content, 30);
    expect(chunks.join("\n").replace(/\n\n+/g, "\n")).toContain("第0行内容");
    expect(chunks.join("")).toContain("第49行内容");
  });

  it("单行超长时按字节强制分割（中文不越界）", () => {
    const longLine = "中".repeat(20); // 60 字节
    const chunks = splitMessageByBytes(longLine, 10);
    for (const chunk of chunks) {
      expect(getByteLength(chunk)).toBeLessThanOrEqual(10);
    }
    expect(chunks.join("")).toBe(longLine);
  });
});

describe("splitMessageByLength", () => {
  it("短消息不分片", () => {
    expect(splitMessageByLength("hello", 10)).toEqual(["hello"]);
  });

  it("按字符数分片", () => {
    const content = "aaa\nbbb\nccc\nddd";
    const chunks = splitMessageByLength(content, 8);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(8);
    }
  });

  it("单行超长按字符分割且内容不丢失", () => {
    const longLine = "x".repeat(25);
    const chunks = splitMessageByLength(longLine, 10);
    expect(chunks.join("")).toBe(longLine);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(10);
    }
  });
});
