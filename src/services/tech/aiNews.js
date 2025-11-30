const HttpClient = require('../../utils/http');
const http = new HttpClient();

/**
 * Fetch AI News from Hacker News
 * Filters top stories for AI-related keywords.
 */
async function getAiNews() {
    try {
        // 1. Get top stories IDs
        const topStoriesIds = await http.get('https://hacker-news.firebaseio.com/v0/topstories.json');

        // 2. Fetch details for top 15 stories (to save time/bandwidth)
        const recentIds = topStoriesIds.slice(0, 15);
        const storyPromises = recentIds.map(id =>
            http.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        );

        const stories = await Promise.all(storyPromises);

        // 3. Filter for AI keywords
        const aiKeywords = ['AI', 'GPT', 'LLM', 'OpenAI', 'DeepMind', 'Anthropic', 'Llama', 'Neural', 'Machine Learning', 'Artificial Intelligence'];
        const aiNews = stories.filter(story => {
            if (!story || !story.title) return false;
            const text = story.title.toLowerCase();
            return aiKeywords.some(kw => text.includes(kw.toLowerCase()));
        });

        return aiNews.slice(0, 10).map(item => ({
            title: item.title,
            summary: '', // HN doesn't have summary usually
            url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
            time: new Date(item.time * 1000).toISOString()
        }));

    } catch (error) {
        console.error('Error fetching AI news:', error.message);
        return [];
    }
}

module.exports = {
    getAiNews
};
