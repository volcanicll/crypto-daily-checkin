const HttpClient = require("../../utils/http");
const http = new HttpClient();
const { translateBatch } = require("../../utils/translation");

const HUGGINGFACE_API = "https://huggingface.co/api/models";

/**
 * 获取 HuggingFace 趋势模型
 * @returns {Promise<Array>}
 */
async function getAIModelsNews() {
  try {
    console.log("Fetching HuggingFace trending models...");

    const data = await http.get(HUGGINGFACE_API, {
      params: {
        sort: "trending",
        limit: 10,
        filter: "text-generation",
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    const models = Array.isArray(data) ? data : [];

    const items = models.slice(0, 5).map((model) => {
      const downloads = model.downloads || 0;
      const likes = model.likes || 0;
      const downloadStr =
        downloads >= 1000000
          ? `${(downloads / 1000000).toFixed(1)}M`
          : downloads >= 1000
            ? `${(downloads / 1000).toFixed(1)}K`
            : String(downloads);

      return {
        title: model.id || model.modelId || "Unknown Model",
        description: `下载 ${downloadStr} · ❤️ ${likes}${model.pipeline_tag ? ` · ${model.pipeline_tag}` : ""}`,
        url: `https://huggingface.co/${model.id || model.modelId}`,
        source: "HuggingFace",
        posted_on: model.lastModified
          ? new Date(model.lastModified).toISOString()
          : new Date().toISOString(),
      };
    });

    // 翻译模型描述
    if (items.length > 0) {
      await translateBatch(
        items,
        (item) => item.title,
        (item, translated) => { item.title = translated; }
      );
    }

    console.log(`AI Models: collected ${items.length} trending models`);
    return items;
  } catch (error) {
    console.error("Error fetching HuggingFace models:", error.message);
    return [];
  }
}

module.exports = {
  getAIModelsNews,
};
