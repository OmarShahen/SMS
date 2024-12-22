const { telegramBot } = require('../bot/telegram-bot')
const StudentModel = require('../models/StudentModel')


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

const sendMessage = async (request, response) => {

    try {

        const { studentId } = request.params
        const { message } = request.body

        const student = await StudentModel.findById(studentId)

        if(!student.telegramId) {
            return response.status(400).json({
                accepted: false,
                message: 'الطالب غير مسجل علي التليجرام',
                field: 'studentId'
            })
        }

        if(!message) {
            return response.status(400).json({
                accepted: false,
                message: 'لا يوجد رسالة للارسال',
                field: 'message'
            })
        }

        telegramBot.sendMessage(student.telegramId, message)

        return response.status(200).json({
            accepted: true,
            message: 'تم ارسال الرسالة بنجاح'
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

module.exports = { telegramWebhook, sendMessage }