const router = require('express').Router()
const telegramController = require('../controllers/telegram')
const authorization = require('../middlewares/verify-permission')
const { verifyStudentId } = require('../middlewares/verify-routes-params')


router.post(`/bot${process.env.TELEGRAM_TOKEN}`, (request, response) => telegramController.telegramWebhook(request, response))

router.post(
    '/api/v1/telegram/students/:studentId/send-message',
    authorization.allPermission,
    verifyStudentId,
    (request, response) => telegramController.sendMessage(request, response)
)


module.exports = router