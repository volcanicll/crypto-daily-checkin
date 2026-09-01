const { describe, it, expect } = require("bun:test");
const { formatLeetCode } = require("../src/utils/formatters/LeetCodeFormatter");
const { formatTechHistory } = require("../src/utils/formatters/TechHistoryFormatter");
const { formatSecurityRadar } = require("../src/utils/formatters/SecurityRadarFormatter");
const { buildDailyQuestion } = require("../src/services/tech/leetcodeDaily");
const { filterTechEvents, isTechEvent } = require("../src/services/tech/techHistory");
const { parseFeedItems } = require("../src/services/tech/securityRadar");

describe("buildDailyQuestion", () => {
  it("转换为标准结构并生成题目链接", () => {
    const result = buildDailyQuestion({
      date: "2026-09-02",
      question: {
        questionFrontendId: "3875",
        titleSlug: "construct-uniform-parity-array-i",
        translatedTitle: "构造奇偶一致的数组 I",
        title: "Construct Uniform Parity Array I",
        difficulty: "Easy",
        acRate: 0.7705938697318,
      },
    });

    expect(result.title).toBe("构造奇偶一致的数组 I");
    expect(result.difficulty).toBe("简单");
    // 小数形式归一化为百分数
    expect(result.acRate).toBe(77.1);
    expect(result.url).toBe("https://leetcode.cn/problems/construct-uniform-parity-array-i/");
  });

  it("已是百分数形式的 acRate 不再放大", () => {
    const result = buildDailyQuestion({
      question: { titleSlug: "x", difficulty: "Medium", acRate: 43.5 },
    });
    expect(result.acRate).toBe(43.5);
  });

  it("缺失题目时返回 null", () => {
    expect(buildDailyQuestion(null)).toBe(null);
    expect(buildDailyQuestion({ question: {} })).toBe(null);
  });

  it("未知难度原样保留", () => {
    const result = buildDailyQuestion({
      question: { titleSlug: "x", difficulty: "SuperHard" },
    });
    expect(result.difficulty).toBe("SuperHard");
  });
});

describe("formatLeetCode", () => {
  it("生成含题目、难度、通过率的卡片", () => {
    const out = formatLeetCode({
      id: "3875",
      title: "构造奇偶一致的数组 I",
      difficulty: "中等",
      acRate: 55.3,
      url: "https://leetcode.cn/problems/x/",
    });
    expect(out).toContain("LeetCode 每日一题");
    expect(out).toContain("3875. 构造奇偶一致的数组 I");
    expect(out).toContain("🟡 中等");
    expect(out).toContain("55.3%");
    expect(out).toContain("https://leetcode.cn/problems/x/");
  });

  it("空数据返回空字符串", () => {
    expect(formatLeetCode(null)).toBe("");
    expect(formatLeetCode({})).toBe("");
  });

  it("通过率缺失时显示占位符", () => {
    const out = formatLeetCode({
      id: "1", title: "T", difficulty: "困难", url: "https://x/",
    });
    expect(out).toContain("—");
  });
});

describe("isTechEvent / filterTechEvents", () => {
  it("科技关键词命中", () => {
    expect(isTechEvent({ text: "谷歌公司正式成立" })).toBe(true);
    expect(isTechEvent({ text: "某地发生地震" })).toBe(false);
  });

  it("筛选科技事件并按年份倒序", () => {
    const events = [
      { year: 2008, text: "Google Chrome 首个测试版本发布" },
      { year: 1998, text: "谷歌公司成立" },
      { year: 2010, text: "某国举行大选" },
      { year: 1969, text: "阿波罗登月，人类首次踏上月球" },
      { year: 2008, text: "Google Chrome 首个测试版本发布" }, // 重复
    ];
    const result = filterTechEvents(events);
    expect(result.length).toBe(3);
    expect(result[0].year).toBe(2008);
    expect(result[result.length - 1].year).toBe(1969);
  });

  it("超过 limit 时截断", () => {
    const events = Array.from({ length: 10 }, (_, i) => ({
      year: 2000 + i,
      text: `软件版本 ${i} 发布`,
    }));
    expect(filterTechEvents(events, 5).length).toBe(5);
  });
});

describe("formatTechHistory", () => {
  it("生成带年份与词条链接的列表", () => {
    const out = formatTechHistory([
      { year: 2008, text: "Google Chrome 发布", url: "https://zh.wikipedia.org/wiki/2008年" },
    ]);
    expect(out).toContain("科技史上的今天");
    expect(out).toContain("**2008年** · Google Chrome 发布");
    expect(out).toContain("[📖](https://zh.wikipedia.org/wiki/2008年)");
  });

  it("空数据返回空字符串", () => {
    expect(formatTechHistory([])).toBe("");
    expect(formatTechHistory(null)).toBe("");
  });
});

describe("parseFeedItems", () => {
  const RSS = `<?xml version="1.0"?>
  <rss><channel>
    <item>
      <title><![CDATA[某漏洞预警]]></title>
      <link>https://www.freebuf.com/a.html</link>
      <description><![CDATA[描述内容]]></description>
      <pubDate>Wed, 02 Sep 2026 00:43:36 +0800</pubDate>
    </item>
    <item>
      <title><![CDATA[第二条]]></title>
      <link>https://www.freebuf.com/b.html</link>
    </item>
  </channel></rss>`;

  it("解析 RSS 条目并标注来源", () => {
    const items = parseFeedItems(RSS, { name: "FreeBuf" }, 10);
    expect(items.length).toBe(2);
    expect(items[0].title).toBe("某漏洞预警");
    expect(items[0].link).toBe("https://www.freebuf.com/a.html");
    expect(items[0].source).toBe("FreeBuf");
    expect(items[0].category).toBe("security");
    expect(items[0].pubDate).toContain("2026");
  });

  it("limit 生效", () => {
    expect(parseFeedItems(RSS, { name: "FreeBuf" }, 1).length).toBe(1);
  });

  it("Atom 条目也可解析", () => {
    const atom = `<?xml version="1.0"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <entry>
        <title>Atom 条目</title>
        <link href="https://example.com/atom" />
        <summary>摘要</summary>
        <updated>2026-09-02T00:00:00Z</updated>
      </entry>
    </feed>`;
    const items = parseFeedItems(atom, { name: "T" }, 10);
    expect(items.length).toBe(1);
    expect(items[0].link).toBe("https://example.com/atom");
  });
});

describe("formatSecurityRadar", () => {
  it("生成安全雷达区块", () => {
    const out = formatSecurityRadar([
      {
        title: "某漏洞预警",
        link: "https://www.freebuf.com/a.html",
        description: "描述",
        source: "FreeBuf",
        pubDate: new Date().toISOString(),
      },
    ]);
    expect(out).toContain("安全雷达");
    expect(out).toContain("[某漏洞预警](https://www.freebuf.com/a.html)");
    expect(out).toContain("FreeBuf");
  });

  it("空数据返回空字符串", () => {
    expect(formatSecurityRadar([])).toBe("");
    expect(formatSecurityRadar(null)).toBe("");
  });
});
