const { telegramBot } = require('./telegram-bot')
const utils = require('../utils/utils')
const StudentModel = require('../models/StudentModel')
const UserModel = require('../models/UserModel')
const GradeModel = require('../models/GradeModel')
const SubscriptionModel = require('../models/SubscriptionModel')
const AttendanceModel = require('../models/AttendanceModel')
const PaymentModel = require('../models/PaymentModel')
const ExamModel = require('../models/ExamModel')
const GroupModel = require('../models/GroupModel')
const AssignmentModel = require('../models/AssignmentModel')
const mongoose = require('mongoose')
const { ACADEMIC_YEARS, SUBSCRIPTION_STATUS, ATTENDANCE_STATUS, PAYMENT_METHODS, EXAM_TYPES } = require('../utils/values')
const { format } = require('date-fns')
const config = require('../config/config')
const { MENU_MESSAGE } = require('./messages/messages')
const { v4: uuidv4 } = require('uuid')


const initTelegramBot = () => {
  telegramBot.on('message', async (message) => {

    const chatId = message.chat.id
    const messageText = message.text

    if(messageText.startsWith('/start')) {
      const parts = messageText.split(" ")
      const param = parts[1]

      if(param) {
        if(param.startsWith('student-')) {
          const userId = param.replace('student-', '')
          const signupLink = `${config.URL}/organizations/${userId}/chats/${chatId}/signup`
          const message = `
          📋 للتسجيل، يرجى ملء النموذج عبر الرابط التالي: [اضغط هنا للتسجيل](${signupLink})
          `
          return telegramBot.sendMessage(chatId, message, { parse_mode: 'Markdown' })

        } else if(param.startsWith('parent-')) {
          const studentId = param.replace('parent-', '')

          const student = await StudentModel.findById(studentId)
          if(student.telegramId == chatId) {
            return telegramBot.sendMessage(chatId, 'لا يمكن تسجيلك فتكون ولي امر')
          }

          const updatedStudent = await StudentModel
          .findByIdAndUpdate(studentId, { parentTelegramId: chatId }, { new: true })
          const message = `تم تسجيلك بنجاح! يمكنك الآن متابعة الطالب ${updatedStudent.name} بكل سهولة.`

          return telegramBot.sendMessage(chatId, message)

        }
      }
    }

    const studentList = await StudentModel.find({ telegramId: chatId })
    if(studentList.length == 0) {
      const message = `هذا هو معرف التليجرام الخاص بك: <b>${chatId}</b>`
      return telegramBot.sendMessage(chatId, message, { parse_mode: 'HTML' })        
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

        telegramBot.sendMessage(chatId, MENU_MESSAGE)

    } else if(messageText == '1') {

        const accountInfoMessage = " بياناتك:\n\n" +
        `الاسم: ${student.name}\n` +
        `رقم التعريف: ${student.studentId}\n` +
        `الهاتف: ${student.phone}\n` +
        `المستوى الدراسي: ${ACADEMIC_YEARS[student.academicYear]}\n` +
        `رابط الحضور: ${config.URL}/qr-code/${student?.QRCodeUUID}\n\n` +
        `إذا واجهت أي مشكلة أو كانت هناك معلومات غير صحيحة، يرجى التواصل مع المعلم الخاص بك.\n\n` +
        `شكرًا لاستخدامك نظامنا!`     
        
        return telegramBot.sendMessage(chatId, accountInfoMessage)

    } else if(messageText == '2') {

      const subscriptions = await SubscriptionModel.aggregate([
        {
          $match: { studentId: student._id }
        },
        {
          $sort: { createdAt: 1 }
        }
      ])

      if(subscriptions.length == 0) {
        telegramBot.sendMessage(student.telegramId, 'لا يوجد اشتراكات مسجلة')
        return
      }

      let message = `
      📋 سجل الاشتراكات للطالب

      👤 اسم الطالب: ${student.name}
      🆔 رقم الطالب: ${student.studentId}
      `

      subscriptions.forEach((subscription) => {

        const subscriptionStatus = subscription.status != 'CANCELLED' && subscription.endDate < new Date() ? 'EXPIRED' : subscription.status

          message += `
          🆔 رقم الاشتراك: ${subscription.subscriptionId}
          💵 السعر: ${subscription.totalPrice} جنيه
          📖 عدد الحصص: ${subscription.allowedSessions}
          ✅ عدد الحضور: ${subscription.attendedSessions}
          📅 تاريخ البداية: ${subscription.startDate ? format(new Date(subscription.startDate), `yyyy-MM-dd`) : `غير مسجل`}
          📅 تاريخ النهاية: ${subscription.endDate ? format(new Date(subscription.endDate), `yyyy-MM-dd`) : `غير مسجل`}
          📌 الحالة: ${SUBSCRIPTION_STATUS[subscriptionStatus]}
          💳 مدفوع: ${subscription.isPaid ? "نعم" : "لا"}
          🔗 رابط الاشتراك: ${config.URL}/qr-code/${student.QRCodeUUID}
          ------------------
          `
      })

      message += "\nشكرًا لاختياركم لخدماتنا! 🎓"

      telegramBot.sendMessage(student.telegramId, message)

    } else if(messageText == '7') {
        
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

      const attendances = await AttendanceModel.aggregate([
        {
          $match: { studentId: student._id }
        },
        {
          $sort: { createdAt: 1 }
        },
        {
          $lookup: {
            from: 'subscriptions',
            localField: 'subscriptionId',
            foreignField: '_id',
            as: 'subscription'
          }
        },
        {
          $unwind: '$subscription'
        }
      ])

      if(attendances.length == 0) {
        telegramBot.sendMessage(student.telegramId, 'لا يوجد حضور مسجل')
        return
      }

      let message = `
      📋 سجل حضور الطالب

      👤 اسم الطالب: ${student.name}
      🆔 رقم الطالب: ${student.studentId}
      `

      attendances.forEach((attendance) => {

          message += `
          🆔 رقم الاشتراك: ${attendance?.subscription?.subscriptionId}
          📅 وقت الحضور: ${format(new Date(attendance.createdAt), `yyyy-MM-dd hh:mm a`)}
          📌 الحالة: ${ATTENDANCE_STATUS[attendance.status]}
          ------------------
          `
      })

      message += "\nشكرًا لاختياركم لخدماتنا! 🎓"

      telegramBot.sendMessage(student.telegramId, message)

    } else if(messageText == '4') {

      const payments = await PaymentModel.aggregate([
        {
          $match: { studentId: student._id }
        },
        {
          $sort: { createdAt: 1 }
        },
        {
          $lookup: {
            from: 'subscriptions',
            localField: 'subscriptionId',
            foreignField: '_id',
            as: 'subscription'
          }
        },
        {
          $unwind: '$subscription'
        }
      ])

      if(payments.length == 0) {
        telegramBot.sendMessage(student.telegramId, 'لا يوجد مدفوعات مسجلة')
        return
      }

      let message = `
      📋 سجل عمليات الدفع الطالب

      👤 اسم الطالب: ${student.name}
      🆔 رقم الطالب: ${student.studentId}
      `

      payments.forEach((payment) => {

          message += `
          🆔 رقم العملية: ${payment.paymentId}
          🆔 رقم الاشتراك: ${payment?.subscription?.subscriptionId}
          💵 المبلغ: ${payment.amount} جنيه
          📅 تاريخ: ${format(new Date(payment.createdAt), `yyyy-MM-dd`)}
          💳 طريقة الدفع: ${PAYMENT_METHODS[payment.paymentMethod]}
        ------------------
          `
      })

      message += "\nشكرًا لاختياركم لخدماتنا! 🎓"

      telegramBot.sendMessage(student.telegramId, message)

    } else if(messageText == '5') {

      const upcomingExam = await ExamModel.findOne({
        isActive: true,
        date: { $gt: new Date() },
        groups: student.groupId
      }).sort({ date: 1 })

      if(!upcomingExam) {
        telegramBot.sendMessage(student.telegramId, 'لا يوجد امتحان قادم')
        return
      }

      const message = `
      📅 تفاصيل الامتحان القادم

      📝 اسم الامتحان: ${upcomingExam.name}
      📚 النوع: ${EXAM_TYPES[upcomingExam.type]}
      ⏳ المدة: ${upcomingExam.duration} دقيقة
      📈 اجمالي الدرجات: ${upcomingExam.totalMarks}
      📅 تاريخ الامتحان: ${upcomingExam.date ? format(new Date(upcomingExam.date), `yyyy-MM-dd`) : `غير مسجل`}
      💬 الوصف: ${upcomingExam.description}

      نتمنى لك التوفيق والنجاح! 📚
      `

      telegramBot.sendMessage(student.telegramId, message)

    } else if(messageText == '6') {
      
      const upcomingAssignment = await AssignmentModel.findOne({
        isActive: true,
        dueDate: { $gt: new Date() },
        groups: student.groupId
      }).sort({ date: 1 })

      if(!upcomingAssignment) {
        telegramBot.sendMessage(student.telegramId, 'لا يوجد واجب قادم')
        return
      }

      const message = `
      📅 تفاصيل الواجب القادم

      📝 اسم الواجب: ${upcomingAssignment.title}
      📈 اجمالي الدرجات: ${upcomingAssignment.totalMarks}
      📅 تاريخ التسليم: ${upcomingAssignment.dueDate ? format(new Date(upcomingAssignment.dueDate), `yyyy-MM-dd`) : `غير مسجل`}
      💬 الوصف: ${upcomingAssignment.description}

      نتمنى لك التوفيق والنجاح! 📚
      `

      telegramBot.sendMessage(student.telegramId, message)

    } else if(messageText == '8') {

      const group = await GroupModel.findById(student.groupId)

      if(!group) {
        telegramBot.sendMessage(student.telegramId, 'لا يوجد مجموعة مسجلة')
        return
      }

      let message = `
      📋 المجموعة
      `

      message += `
          🆔 رقم المجموعة: ${group.groupId}
          🏫 اسم المجموعة: ${group.name}
          📅 السنة الدراسية: ${ACADEMIC_YEARS[group.academicYear]}
          📞 رقم الهاتف: ${group.supportPhone || `غير مسجل`}
          📍 العنوان: ${group.address || `غير مسجل`}
          🔗 رابط العنوان: ${group.addressLink || `غير مسجل`}
          🔗 رابط الواتس اب: ${group.whatsappLink || `غير مسجل`}
          💬 الوصف: ${group.description || `غير مسجل`}
      `

      message += "\nشكرًا لاختياركم لخدماتنا! 🎓"

      telegramBot.sendMessage(student.telegramId, message)

    } else if(messageText == '9') {

      const groups = await GroupModel.aggregate([
        {
          $match: { userId: student.userId, academicYear: student.academicYear }
        },
        {
          $sort: { createdAt: 1 }
        }
      ])

      if(groups.length == 0) {
        telegramBot.sendMessage(student.telegramId, 'لا يوجد مجموعات مسجلة')
        return
      }

      let message = `
      📋 مجموعات ${ACADEMIC_YEARS[student.academicYear]}
      `

      groups.forEach((group) => {

          message += `
          🆔 رقم المجموعة: ${group.groupId}
          🏫 اسم المجموعة: ${group.name}
          📅 السنة الدراسية: ${ACADEMIC_YEARS[group.academicYear]}
          📞 رقم الهاتف: ${group.supportPhone || `غير مسجل`}
          📍 العنوان: ${group.address || `غير مسجل`}
          🔗 رابط العنوان: ${group.addressLink || `غير مسجل`}
          🔗 رابط الواتس اب: ${group.whatsappLink || `غير مسجل`}
          💬 الوصف: ${group.description || `غير مسجل`}
        ------------------
          `
      })

      message += "\nشكرًا لاختياركم لخدماتنا! 🎓"

      telegramBot.sendMessage(student.telegramId, message)

    } else if(messageText == '10') {

      const registrationLink = `${config.TELEGRAM_BOT_URL}?start=parent-${student._id}` // Replace with the actual link
      const message = `ارسل هذا الرابط الي ولي الامر للمتابعة: ${registrationLink}`

      return telegramBot.sendMessage(chatId, message)

    } else if(messageText == '11') {

      if(!student.parentTelegramId) {
        return telegramBot.sendMessage(chatId, 'لا يوجد ولي امر مشترك')
      }

      await StudentModel.findByIdAndUpdate(student._id, { parentTelegramId: null }, { new: true })

      telegramBot.sendMessage(chatId, 'تم ازالة متابعة ولي الامر')
      return telegramBot.sendMessage(student.parentTelegramId, 'تم ازالة المتابعة عن طريق الطالب')

    } else if(messageText == '12') {

      const message = `هذا هو معرف التليجرام الخاص بك: <b>${chatId}</b>`
      return telegramBot.sendMessage(chatId, message, { parse_mode: 'HTML' })

    } else if(messageText == '13') {

      const updatedStudent = await StudentModel
      .findByIdAndUpdate(student._id, { QRCodeUUID: uuidv4() }, { new: true })

      const message = `تم انشاء كود تسجيل حضور جديد: ${config.URL}/qr-code/${updatedStudent.QRCodeUUID}`
      telegramBot.sendMessage(updatedStudent.telegramId, message)

    } else if(messageText == '0') {

        const updatedStudent = await StudentModel
        .findByIdAndUpdate(student._id, { telegramId: null }, { new: true })

        return telegramBot.sendMessage(chatId, `تم تسجيل خروج حساب ${updatedStudent.name}`)

    } else {
        telegramBot.sendMessage(chatId, MENU_MESSAGE)
    }
    
  })

}

module.exports = { initTelegramBot }