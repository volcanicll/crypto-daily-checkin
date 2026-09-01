const { describe, it, expect } = require("bun:test");
const {
  sectionHeader,
  divider,
  infoRow,
  priceItem,
  cardItem,
  linkItem,
  messageHeader,
  truncateText,
} = require("../src/utils/formatters/DingTalkMarkdownUtils");

describe("truncateText", () => {
  it("空值返回空字符串", () => {
    expect(truncateText(null)).toBe("");
    expect(truncateText("")).toBe("");
  });

  it("清理换行和方括号", () => {
    expect(truncateText("a\nb[c]d")).toBe("a bcd");
  });

  it("超长时截断并加省略号", () => {
    const result = truncateText("x".repeat(100), 10);
    expect(result.length).toBeLessThanOrEqual(10);
    expect(result.endsWith("...")).toBe(true);
  });
});

describe("sectionHeader / divider / infoRow", () => {
  it("sectionHeader 生成二级标题", () => {
    expect(sectionHeader("🚀", "标题")).toBe("\n## 🚀 标题\n\n");
  });

  it("divider 生成水平分隔线", () => {
    expect(divider()).toBe("\n\n---\n\n");
  });

  it("infoRow 生成加粗键值行", () => {
    expect(infoRow("日期", "2026-09-02")).toBe("- **日期**: 2026-09-02\n");
  });
});

describe("priceItem", () => {
  it("生成价格引用块", () => {
    expect(priceItem("💰", "黄金", "$100", "+1%")).toBe(
      "> 💰 **黄金**\n> $100  +1%\n> \n"
    );
  });
});

describe("cardItem", () => {
  it("对象参数形式", () => {
    const item = cardItem({ title: "T", url: "https://a.b", summary: "S", source: "SRC" });
    expect(item).toContain("**[T](https://a.b)**");
    expect(item).toContain("> S");
    expect(item).toContain("SRC");
  });

  it("多参数形式（向后兼容）", () => {
    const item = cardItem("T", "https://a.b", "", "SRC", "2小时前");
    expect(item).toContain("**[T](https://a.b)**");
    expect(item).toContain("SRC · 2小时前");
  });

  it("无摘要时不生成引用行", () => {
    const item = cardItem({ title: "T", url: "https://a.b" });
    expect(item).not.toContain(">");
  });
});

describe("linkItem", () => {
  it("生成带来源的链接行", () => {
    const item = linkItem({ title: "T", url: "https://a.b", source: "GitHub" });
    expect(item).toBe("- [T](https://a.b)  _GitHub_\n");
  });

  it("无来源时省略", () => {
    const item = linkItem({ title: "T", url: "https://a.b" });
    expect(item).toBe("- [T](https://a.b)\n");
  });
});

describe("messageHeader", () => {
  it("默认标题为每日播报", () => {
    const header = messageHeader();
    expect(header.startsWith("# 每日播报")).toBe(true);
    expect(header).toContain("**");
  });

  it("支持自定义标题", () => {
    expect(messageHeader("Tech Daily").startsWith("# Tech Daily")).toBe(true);
  });
});
