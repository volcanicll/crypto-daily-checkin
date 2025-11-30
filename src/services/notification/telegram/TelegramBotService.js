const HttpClient = require('../../../utils/http');
const http = new HttpClient();

class TelegramBotService {
    constructor() {
        this.token = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.apiUrl = `https://api.telegram.org/bot${this.token}`;
    }

    /**
     * Send text message to Telegram chat
     * @param {string} text - Message content
     * @returns {Promise<boolean>} - Success status
     */
    async sendMessage(text) {
        if (!this.token || !this.chatId) {
            console.warn('Telegram configuration missing. Skipping notification.');
            return false;
        }

        try {
            await http.post(`${this.apiUrl}/sendMessage`, {
                chat_id: this.chatId,
                text: text,
                parse_mode: 'Markdown'
            });
            console.log('Telegram notification sent successfully.');
            return true;
        } catch (error) {
            console.error('Error sending Telegram notification:', error.message);
            return false;
        }
    }
}

module.exports = new TelegramBotService();
