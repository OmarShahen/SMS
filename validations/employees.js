const utils = require('../utils/utils')
const config = require('../config/config')


const addEmployee = (employeeData) => {

    const { firstName, email, password } = employeeData

    if(!firstName) return { isAccepted: false, message: 'Name is required', field: 'firstName' }

    if(!utils.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name format', field: 'firstName' }

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'Email formate is invalid', field: 'email' }

    if(!password) return { isAccepted: false, message: 'Password is required', field: 'password' }

    const validatedPassword = utils.isPasswordStrong(password)

    if(!validatedPassword.isAccepted) return { isAccepted: false, message: validatedPassword.message, field: 'password' }


    return { isAccepted: true, message: 'data is valid', data: employeeData }
}

const updateEmployee = (employeeData) => {

    const { firstName, email } = employeeData

    if(!firstName) return { isAccepted: false, message: 'Name is required', field: 'firstName' }

    if(!utils.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name format', field: 'firstName' }

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'Email formate is invalid', field: 'email' }


    return { isAccepted: true, message: 'data is valid', data: employeeData }
}

const updateEmployeeBlock = (employeeData) => {

    const { isBlocked } = employeeData

    if(typeof isBlocked != 'boolean') return { isAccepted: false, message: 'Invalid isBlocked format', field: 'isBlocked' }
    
    return { isAccepted: true, message: 'data is valid', data: employeeData }

}

module.exports = { 
    addEmployee, 
    updateEmployee,
    updateEmployeeBlock
}