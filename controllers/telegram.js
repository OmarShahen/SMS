const { telegramBot } = require('../bot/telegram-bot')


const telegramWebhook = (request, response) => {

    try {

        telegramBot.processUpdate(request.body)

        return response.status(200).json({
            accepted: true,
            message: 'Telegram Web Hook is working successfully!'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { telegramWebhook }