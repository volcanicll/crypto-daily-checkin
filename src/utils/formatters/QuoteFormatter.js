/**
 * Format daily quote
 * @param {string|null} quoteContent 
 * @returns {string} Formatted quote
 */
const formatQuote = (quoteContent) => {
    if (!quoteContent) {
        return `【💞 Love 💞】
亲爱的，你是我所有美好故事的开始 💝
永远爱你，今天也要开心哦！✨`;
    }

    return `【💕 每日情话 💕】
${quoteContent}`;
};

module.exports = { formatQuote };
