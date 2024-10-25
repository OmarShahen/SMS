const router = require('express').Router()
const telegramController = require('../controllers/telegram')


router.post(`/bot${process.env.TELEGRAM_TOKEN}`, (request, response) => telegramController.telegramWebhook(request, response))


module.exports = router