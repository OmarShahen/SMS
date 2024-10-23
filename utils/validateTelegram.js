const isValidTelegramInput = (input) => {
    const regex = /^\d+-\d{11}$/; // Regex to match "teacherID-" followed by exactly 11 digits
    return regex.test(input)
}

module.exports = { isValidTelegramInput }