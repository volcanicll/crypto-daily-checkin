const HttpClient = require('../../utils/http');
const http = new HttpClient();

/**
 * Fetch Gold Price from Sina Finance
 * @returns {Promise<Object>} - Gold price data
 */
async function getGoldPrice() {
    try {
        // hf_XAU: NY Gold (USD/oz)
        // gds_AUTD: Shanghai Gold (CNY/g)
        const response = await http.get('http://hq.sinajs.cn/list=hf_XAU,gds_AUTD', {
            headers: {
                'Referer': 'https://finance.sina.com.cn/',
                // 'User-Agent': 'Mozilla/5.0 ...' // Already set in http.js
            }
        });

        // Parse Sina format: var hq_str_hf_XAU="...";
        const results = {};

        const matches = response.matchAll(/var hq_str_(\w+)="([^"]+)";/g);
        for (const match of matches) {
            const code = match[1];
            const data = match[2].split(',');

            if (code === 'hf_XAU') {
                // NY Gold
                const current = parseFloat(data[0]);
                const prevClose = parseFloat(data[7]);
                const changePercent = prevClose ? ((current - prevClose) / prevClose * 100) : 0;

                results.ny_gold = {
                    price: current,
                    change_percent: changePercent,
                    name: '纽约金 (XAU)',
                    currency: 'USD'
                };
            } else if (code === 'gds_AUTD') {
                // Shanghai Gold
                const current = parseFloat(data[0]);
                const prevClose = parseFloat(data[7]);
                const changePercent = prevClose ? ((current - prevClose) / prevClose * 100) : 0;

                results.cn_gold = {
                    price: current,
                    change_percent: changePercent,
                    name: '上海金 (AU T+D)',
                    currency: 'CNY'
                };
            }
        }

        return results;
    } catch (error) {
        console.error('Error fetching gold price:', error.message);
        return {};
    }
}

module.exports = {
    getGoldPrice
};
