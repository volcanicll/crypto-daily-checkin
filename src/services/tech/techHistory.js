/**
 * 科技史上的今天服务
 * 数据源：Wikipedia「历史上的今天」Feed API（免密钥，返回简体中文）
 * 从当天的历史事件中筛选与科技相关的条目
 */

const HttpClient = require("../../utils/http");
// 「历史上的今天」事件接口响应体积较大，放宽超时
const http = new HttpClient({ timeout: 30000 });

// 科技相关关键词（标题/正文任一命中即视为科技事件）
const TECH_KEYWORDS = [
  "计算机", "电脑", "软件", "硬件", "互联网", "网络", "网站", "科技", "技术",
  "电子", "芯片", "半导体", "处理器", "苹果", "微软", "谷歌", "Google", "Microsoft",
  "Apple", "IBM", "Intel", "英特尔", "Linux", "Unix", "安卓", "Android", "iPhone",
  "编程", "程序", "代码", "图灵", "人工智能", "机器人", "算法",
  "电话", "电报", "电视", "收音机", "广播", "相机", "摄影", "录像",
  "太空", "卫星", "火箭", "航天", "登月", "NASA", "探测器", "飞船",
  "发明", "专利", "蒸汽机", "发动机", "电力", "灯泡", "物理", "化学", "数学",
];

/**
 * 判断事件是否与科技相关
 * @param {object} event - { year, text, url, title }
 * @returns {boolean}
 */
function isTechEvent(event) {
  const text = `${event.title || ""} ${event.text || ""}`;
  return TECH_KEYWORDS.some((keyword) => text.includes(keyword));
}

/**
 * 从 Wikipedia 事件列表中筛选科技事件（去重、按年份倒序）
 * @param {Array} events - 原始事件数组
 * @param {number} limit - 最大返回条数
 * @returns {Array}
 */
function filterTechEvents(events, limit = 5) {
  const seen = new Set();
  const result = [];

  for (const event of events) {
    if (!event?.text) continue;

    const mapped = {
      year: event.year || "",
      text: event.text,
      title: event.pages?.[0]?.titles?.normalized || "",
      url: event.pages?.[0]?.content_urls?.desktop?.page || "",
    };

    if (!isTechEvent(mapped)) continue;

    // selected 与 events 可能重复，按内容去重
    const key = mapped.text;
    if (seen.has(key)) continue;
    seen.add(key);

    result.push(mapped);
    if (result.length >= limit) break;
  }

  return result.sort((a, b) => (b.year || 0) - (a.year || 0));
}

/**
 * 获取科技史上的今天
 * @param {number} limit - 最大条数
 * @returns {Promise<Array>} 科技事件数组，失败返回空数组
 */
async function getTechHistory(limit = 5) {
  try {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const url = `https://api.wikimedia.org/feed/v1/wikipedia/zh/onthisday/events/${mm}/${dd}`;

    const data = await http.get(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "User-Agent": "TechDaily/2.0 (daily tech digest bot)",
      },
    });

    // events 已包含当日编辑精选，直接过滤
    const techEvents = filterTechEvents(data?.events || [], limit);

    console.log(`科技史上的今天: ${techEvents.length} 条`);
    return techEvents;
  } catch (error) {
    console.error("Error fetching tech history:", error.message);
    return [];
  }
}

module.exports = { getTechHistory, filterTechEvents, isTechEvent };
