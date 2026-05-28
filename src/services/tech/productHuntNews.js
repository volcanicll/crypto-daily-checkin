const HttpClient = require("../../utils/http");
const http = new HttpClient();
const { translateBatch } = require("../../utils/translation");
const { env } = require("../../config/env");

const PRODUCTHUNT_API = "https://api.producthunt.com/v2/api/graphql";

/**
 * GraphQL 查询：获取当日热门产品
 */
const TOP_POSTS_QUERY = `
query {
  posts(order: VOTES, first: 10) {
    edges {
      node {
        name
        tagline
        url
        votesCount
        website
        createdAt
      }
    }
  }
}
`;

/**
 * 获取 Product Hunt 每日热门产品
 * @returns {Promise<Array>}
 */
async function getProductHuntNews() {
  // 没有 token 时静默跳过
  if (!env.productHunt.token) {
    console.log("Product Hunt: 未配置 API Token，跳过");
    return [];
  }

  try {
    console.log("Fetching Product Hunt top products...");

    const data = await http.post(
      PRODUCTHUNT_API,
      { query: TOP_POSTS_QUERY },
      {
        headers: {
          Authorization: `Bearer ${env.productHunt.token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const edges = data?.data?.posts?.edges || [];

    const items = edges.map((edge) => {
      const node = edge.node;
      return {
        title: node.name,
        description: `${node.tagline || ""} · 👍 ${node.votesCount || 0}`,
        url: node.url || node.website || "",
        source: "Product Hunt",
        posted_on: node.createdAt
          ? new Date(node.createdAt).toISOString()
          : new Date().toISOString(),
      };
    });

    // 翻译产品标语
    if (items.length > 0) {
      await translateBatch(
        items,
        (item) => item.title,
        (item, translated) => { item.title = translated; }
      );
    }

    console.log(`Product Hunt: collected ${items.length} top products`);
    return items;
  } catch (error) {
    console.error("Error fetching Product Hunt:", error.message);
    return [];
  }
}

module.exports = {
  getProductHuntNews,
};
