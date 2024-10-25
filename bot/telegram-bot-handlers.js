const { telegramBot } = require('./telegram-bot')
const utils = require('../utils/utils')
const StudentModel = require('../models/StudentModel')
const UserModel = require('../models/UserModel')
const GradeModel = require('../models/GradeModel')
const mongoose = require('mongoose')
const { ACADEMIC_YEARS } = require('../utils/values')


const initTelegramBot = () => {

  telegramBot.on('message', async (msg) => {

    const chatId = msg.chat.id
    const messageText = msg.text

    const studentList = await StudentModel.find({ telegramId: chatId })
    if(studentList.length == 0 && !utils.isValidTelegramInput(messageText)) {
        const errorMessage = `الرجاء إدخال البيانات بالتنسيق التالي: \n\nرقم المدرس-رقم هاتف الطالب \n\nمثلًا:\n 1-01065630331`;
        return telegramBot.sendMessage(chatId, errorMessage)        
    }

    const student = studentList[0]

    if(utils.isValidTelegramInput(messageText)) {
        const [userId, studentPhone] = messageText.split('-')

        const userList = await UserModel.find({ userId })
        if(userList.length == 0) {
            return telegramBot.sendMessage(chatId, 'رقم المدرس غير مسجل')
        }

        const user = userList[0]
        const studentList = await StudentModel.find({ userId: user._id, phone: studentPhone })
        if(studentList.length == 0) {
            return telegramBot.sendMessage(chatId, 'رقم هاتف الطالب غير مسجل')
        }

        const studentTelegramIdsList = await StudentModel.find({ userId: user._id, telegramId: chatId })
        if(studentTelegramIdsList.length != 0) {
            return telegramBot.sendMessage(chatId, 'البوت مفعل مع رقم هاتف اخر')
        }

        const student = studentList[0]

        const updatedStudent = await StudentModel
        .findByIdAndUpdate(student._id, { telegramId: chatId }, { new: true })

        const welcomeMessage = "مرحبًا بك!\n\n" +
        `الاسم: ${updatedStudent.name}\n` +
        `رقم التعريف: ${updatedStudent.studentId}\n` +
        `الهاتف: ${updatedStudent.phone}\n` +
        `المستوى الدراسي: ${ACADEMIC_YEARS[updatedStudent.academicYear]}\n\n` +
        `لقد تم تسجيلك بنجاح. يمكنك الآن متابعة درجات امتحاناتك من خلال هذا البوت.\n\n` +
        `إذا واجهت أي مشكلة أو كانت هناك معلومات غير صحيحة، يرجى التواصل مع المعلم الخاص بك.\n\n` +
        `شكرًا لاستخدامك نظامنا!`

        telegramBot.sendMessage(chatId, welcomeMessage)

        const menuMessage = 
        "مرحبًا بك في نظام إدارة الدرجات!\n\n" +
        "الخيارات المتاحة:\n\n" +
        "1. عرض بياناتي\n\n" +
        "2. عرض درجاتي\n\n" +
        "3. تسجيل الخروج\n\n" +
        "4. عرض الخيارات\n\n" +

        "يرجى اختيار رقم الخيار الذي ترغب في استخدامه."

        telegramBot.sendMessage(chatId, menuMessage)

    } else if(messageText == '1') {

        const accountInfoMessage = " بياناتك:\n\n" +
        `الاسم: ${student.name}\n` +
        `رقم التعريف: ${student.studentId}\n` +
        `الهاتف: ${student.phone}\n` +
        `المستوى الدراسي: ${ACADEMIC_YEARS[student.academicYear]}\n\n` +
        `إذا واجهت أي مشكلة أو كانت هناك معلومات غير صحيحة، يرجى التواصل مع المعلم الخاص بك.\n\n` +
        `شكرًا لاستخدامك نظامنا!`     
        
        return telegramBot.sendMessage(chatId, accountInfoMessage)

    } else if(messageText == '2') {
        
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
            return telegramBot.sendMessage(chatId, "لم يتم العثور على درجات للطالب")
        }

        let message = `درجات الطالب ${student.name}:\n`
        grades.forEach(grade => {
          const percentage = (grade.totalScore / grade.totalMarks) * 100
          message += `- ${grade.examName}: ${grade.totalScore}/${grade.totalMarks} (${percentage.toFixed(2)}%)\n`
        })

        telegramBot.sendMessage(chatId, message)

    } else if(messageText == '3') {

        const updatedStudent = await StudentModel
        .findByIdAndUpdate(student._id, { telegramId: null }, { new: true })

        return telegramBot.sendMessage(chatId, `تم تسجيل خروج حساب ${updatedStudent.name}`)

    } else {

        const menuMessage = 
        "مرحبًا بك في نظام إدارة الدرجات!\n\n" +
        "الخيارات المتاحة:\n\n" +
        "1. عرض بياناتي\n\n" +
        "2. عرض درجاتي\n\n" +
        "3. تسجيل الخروج\n\n" +
        "4. عرض الخيارات\n\n" +

        "يرجى اختيار رقم الخيار الذي ترغب في استخدامه."

        telegramBot.sendMessage(chatId, menuMessage)
    }
    
  })

}

module.exports = { initTelegramBot }