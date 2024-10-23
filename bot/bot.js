const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    console.log(messageText)
    bot.sendMessage(chatId, 'Welcome to SMS made by omar')
})