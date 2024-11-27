const express = require('express')
const app = express()
const http = require('http')
const dotenv = require('dotenv').config()
const config = require('./config/config')
const functions = require('firebase-functions')
const { initTelegramBot } = require('./bot/telegram-bot-handlers')


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
app.use('/api', require('./routes/groups'))
app.use('/api', require('./routes/students'))
app.use('/api', require('./routes/exams'))
app.use('/api', require('./routes/grades'))
app.use('/api', require('./routes/shifts'))
app.use('/api', require('./routes/subscriptions'))
app.use('/api', require('./routes/attendances'))
app.use('/api', require('./routes/assignments'))
app.use('/api', require('./routes/submissions'))
app.use('/api', require('./routes/payments'))
app.use(require('./routes/telegram'))


db()
.then(data => console.log('Mongo is up and running... ;)'))
.catch(error => console.error(error))


app.get('/', (request, response) => {
    return response.status(200).json({
        message: `Welcome to RA'AYA-SMS`
    })
})


initTelegramBot()

//server.listen(config.PORT, () => console.log(`server started on port ${config.PORT} [${config.APP_NAME} APP]`))

exports.app = functions.https.onRequest(app)