/**
 * Format LLM commentary
 * @param {string|null} commentary 
 * @returns {string} Formatted commentary
 */
const formatCommentary = (commentary) => {
    if (!commentary) return "";
    return `【🎯 AI 锐评 🎯】\n${commentary}`;
};

module.exports = { formatCommentary };
