const isPasswordStrong = (password) => {

    const minLength = 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    
    if (password.length < minLength) {
      return { isAccepted: false, message: 'ضعيف: يجب أن تتكون كلمة المرور من 8 أحرف على الأقل' }
    } else if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      return { isAccepted: false, message: 'متوسط: يجب أن تتضمن كلمة المرور أحرف كبيرة وصغيرة وأرقاما وأحرفا خاصة' }
    }
    
    return { isAccepted: true, message: 'قوي: كلمة المرور تفي بمعايير كلمة المرور القوية' }
}

module.exports = { isPasswordStrong }