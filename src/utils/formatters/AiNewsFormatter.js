/**
 * Format AI news data
 * @param {Array} aiNews 
 * @returns {string} Formatted AI news report
 */
const formatAiNews = (aiNews) => {
    if (!aiNews || aiNews.length === 0) return "";

    let message = "【🤖 AI 前沿资讯 🤖】\n";
    aiNews.forEach((news, index) => {
        message += `${index + 1}. [${news.title}](${news.url})\n`;
    });

    return message;
};

module.exports = { formatAiNews };
