/**
 * LeetCode 每日一题服务
 * 数据源：力扣中国公开 GraphQL 接口（免密钥）
 */

const { API_CONFIG } = require("../../config/constants");

const DAILY_QUESTION_QUERY = `
query questionOfToday {
  todayRecord {
    date
    question {
      questionFrontendId
      titleSlug
      title
      translatedTitle
      difficulty
      acRate
    }
  }
}`;

const DIFFICULTY_MAP = {
  Easy: "简单",
  Medium: "中等",
  Hard: "困难",
};

/**
 * 将 GraphQL 返回的题目记录转换为标准结构
 * @param {object} record - todayRecord[0]
 * @returns {object|null}
 */
function buildDailyQuestion(record) {
  const question = record?.question;
  if (!question?.titleSlug) return null;

  // acRate 为小数形式（0.77 表示 77%），归一化为百分数
  const acRate =
    typeof question.acRate === "number"
      ? Math.round((question.acRate <= 1 ? question.acRate * 100 : question.acRate) * 10) / 10
      : null;

  return {
    date: record.date || "",
    id: question.questionFrontendId || "",
    title: question.translatedTitle || question.title || question.titleSlug,
    difficulty: DIFFICULTY_MAP[question.difficulty] || question.difficulty || "未知",
    acRate,
    url: `https://leetcode.cn/problems/${question.titleSlug}/`,
  };
}

/**
 * 获取 LeetCode 每日一题
 * @returns {Promise<object|null>} 题目信息，失败返回 null
 */
async function getLeetCodeDaily() {
  try {
    const response = await fetch("https://leetcode.cn/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.cn/",
        // 力扣对浏览器 UA 返回反爬挑战页，简单 bot UA 反而直通
        "User-Agent": "TechDaily/2.0",
      },
      body: JSON.stringify({ query: DAILY_QUESTION_QUERY }),
      signal: AbortSignal.timeout(API_CONFIG.timeout),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const record = data?.data?.todayRecord?.[0];
    const result = buildDailyQuestion(record);

    if (result) {
      console.log(`LeetCode 每日一题: ${result.id}.${result.title}`);
    }
    return result;
  } catch (error) {
    console.error("Error fetching LeetCode daily question:", error.message);
    return null;
  }
}

module.exports = { getLeetCodeDaily, buildDailyQuestion };
