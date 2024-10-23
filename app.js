const express = require('express')
const app = express()
const http = require('http')
const dotenv = require('dotenv').config()
const config = require('./config/config')
const TelegramBot = require('node-telegram-bot-api')
const functions = require('firebase-functions')

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

const utils = require('./utils/utils')
const StudentModel = require('./models/StudentModel')
const UserModel = require('./models/UserModel')
const GradeModel = require('./models/GradeModel')
const mongoose = require('mongoose')

//const Bree = require('bree')

const morgan = require('morgan')
const db = require('./config/database')
const cors = require('cors')
const { verifyLanguage } = require('./middlewares/language')


const server = http.createServer(app)

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(verifyLanguage)

/*const bree = new Bree({ jobs: [{ name: 'mail-report', interval: 'at 11:24pm' }]})
bree.start()*/


app.use('/api', require('./routes/auth'))
app.use('/api', require('./routes/users'))
app.use('/api', require('./routes/analytics'))
app.use('/api', require('./routes/groups'))
app.use('/api', require('./routes/students'))
app.use('/api', require('./routes/exams'))
app.use('/api', require('./routes/grades'))
app.use('/api', require('./routes/shifts'))
app.use('/api', require('./routes/subscriptions'))
app.use('/api', require('./routes/attendances'))
app.use('/api', require('./routes/assignments'))
app.use('/api', require('./routes/submissions'))


db()
.then(data => console.log('Mongo is up and running... ;)'))
.catch(error => console.error(error))


app.get('/', (request, response) => {
    return response.status(200).json({
        message: `welcome to RA'AYA`
    })
})


bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const messageText = msg.text

    if(utils.isValidTelegramInput(messageText)) {
        const [userId, studentPhone] = messageText.split('-')

        const userList = await UserModel.find({ userId })
        if(userList.length == 0) {
            return bot.sendMessage(chatId, 'رقم المدرس غير مسجل')
        }

        const user = userList[0]
        const studentList = await StudentModel.find({ userId: user._id, phone: studentPhone })
        if(studentList.length == 0) {
            return bot.sendMessage(chatId, 'رقم هاتف الطالب غير مسجل')
        }

        const student = studentList[0]

        const grades = await GradeModel.aggregate([
            {
              $match: { studentId: mongoose.Types.ObjectId(student._id) }
            },
            {
              $lookup: {
                from: "exams",
                localField: "examId",
                foreignField: "_id",
                as: "exam"
              }
            },
            {
              $unwind: "$exam"
            },
            {
              $group: {
                _id: "$examId",
                examName: { $first: "$exam.name" },
                totalScore: { $sum: "$score" },
                totalMarks: { $first: "$exam.totalMarks" },
                examCount: { $sum: 1 }
              }
            }
          ])

        if (grades.length == 0) {
            return bot.sendMessage(chatId, "لم يتم العثور على درجات للطالب");
        }

        let message = `درجات الطالب ${student.name}:\n`;
        grades.forEach(grade => {
          const percentage = (grade.totalScore / grade.totalMarks) * 100;
          message += `- ${grade.examName}: ${grade.totalScore}/${grade.totalMarks} (${percentage.toFixed(2)}%)\n`;
        })

        bot.sendMessage(chatId, message)

    } else {
        const errorMessage = `الرجاء إدخال البيانات بالتنسيق التالي: \n\nرقم المدرس-رقم هاتف الطالب \n\nمثلًا: 1-01065630331`;
        bot.sendMessage(chatId, errorMessage)
    }

})


server.listen(config.PORT, () => console.log(`server started on port ${config.PORT} [${config.APP_NAME} APP]`))

exports.app = functions.https.onRequest(app)