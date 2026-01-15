const { translate } = require("google-translate-api-x");

/**
 * Translate text to Chinese if it's likely English
 */
async function translateToChinese(text) {
  try {
    if (!text) return "";
    // Simple check: if text contains Chinese characters, assume it's already Chinese (not perfect but helpful)
    if (/[\u4e00-\u9fa5]/.test(text)) return text;

    const res = await translate(text, {
      to: "zh-CN",
      rejectOnPartialFail: false,
    });
    // Ensure res and res.text exist
    return res && res.text ? res.text : text;
  } catch (error) {
    console.warn("Translation failed, returning original text:", error.message);
    return text;
  }
}

/**
 * Fetch with retry mechanism
 */
async function fetchWithRetry(fetchFn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed: ${error.message}`);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

/**
 * Filter items to only include those from today
 * @param {Array} items - Array of items with date field
 * @param {string} dateField - Name of the date field (default: 'posted_on')
 * @returns {Array} - Items from today only
 */
function filterTodayItems(items, dateField = "posted_on") {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return items.filter((item) => {
    try {
      const itemDate = new Date(item[dateField]);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() === today.getTime();
    } catch {
      return false;
    }
  });
}

module.exports = { translateToChinese, fetchWithRetry, filterTodayItems };
