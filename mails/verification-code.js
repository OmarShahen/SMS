const config = require('../config/config')
const { transporter } = require('./config/config')

const sendVerificationCode = async (verificationData) => {

    try {

        const { receiverEmail, verificationCode } = verificationData

        const mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: receiverEmail,
            subject: 'التحقق من البريد الإلكتروني للحساب',
            text: `هذا هو رمز التحقق من حسابك ${verificationCode}`
        }

        const success = await transporter.sendMail(mailOptions)

        return { isSent: true }

    } catch(error) {    
        console.error(error)
        return { isSent: false }
    }

}

module.exports = { sendVerificationCode }