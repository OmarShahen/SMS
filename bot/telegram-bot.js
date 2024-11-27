const config = require('../config/config')
const TelegramBot = require('node-telegram-bot-api')

const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN, { webHook: true })

//const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

telegramBot.setWebHook(config.TELEGRAM_WEBHOOK)
.then(() => console.log(`Web hook set successfully to ${config.TELEGRAM_WEBHOOK}`))
.catch(error => console.log(`error setting the web hook ${error}`))

module.exports = { telegramBot }