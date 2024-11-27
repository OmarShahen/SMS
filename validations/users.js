const config = require('../config/config')
const utils = require('../utils/utils')

const checkSpeciality = (specialities) => {
    for(let i=0;i<specialities.length;i++) {
        if(!utils.isObjectId(specialities[i])) {
            return false
        }
    }

    return true
}

const isObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

const validateModuleFields = (moduleObj, moduleName) => {

    const { isCreate, isRead, isUpdate, isDelete } = moduleObj

    if(!moduleObj) return { isAccepted: false, message: 'Module is required', field: 'module' }

    if(!isObject(moduleObj)) return { isAccepted: false, message: 'Module format is invalid', field: 'module' }

    if(typeof isCreate != 'boolean') return { isAccepted: false, message: `isCreate of ${moduleName} format is invalid`, field: `${moduleName}.isCreate` } 

    if(typeof isRead != 'boolean') return { isAccepted: false, message: `isRead of ${moduleName} format is invalid`, field: `${moduleName}.isRead` } 

    if(typeof isUpdate != 'boolean') return { isAccepted: false, message: `isUpdate of ${moduleName} format is invalid`, field: `${moduleName}.isUpdate` } 

    if(typeof isDelete != 'boolean') return { isAccepted: false, message: `isDelete of ${moduleName} format is invalid`, field: `${moduleName}.isDelete` } 

    return { isAccepted: true, message: 'data is valid', data: moduleObj }
}

const validateModules = (modules) => {

    const { students, groups, subscriptions, payments, shifts, attendances, exams, grades, assignments } = modules

    const studentsValidation = validateModuleFields(students, 'students')
    const groupsValidation = validateModuleFields(groups, 'groups')
    const subscriptionsValidation = validateModuleFields(subscriptions, 'subscriptions')
    const paymentsValidation = validateModuleFields(payments, 'payments')
    const shiftsValidation = validateModuleFields(shifts, 'shifts')
    const attendancesValidation = validateModuleFields(attendances, 'attendances')
    const examsValidation = validateModuleFields(exams, 'exams')
    const gradesValidation = validateModuleFields(grades, 'grades')
    const assignmentsValidation = validateModuleFields(assignments, 'assignments')

    if(!studentsValidation.isAccepted) return studentsValidation
    if(!groupsValidation.isAccepted) return studentsValidation
    if(!subscriptionsValidation.isAccepted) return studentsValidation
    if(!paymentsValidation.isAccepted) return studentsValidation
    if(!shiftsValidation.isAccepted) return studentsValidation
    if(!attendancesValidation.isAccepted) return studentsValidation
    if(!examsValidation.isAccepted) return studentsValidation
    if(!gradesValidation.isAccepted) return studentsValidation
    if(!assignmentsValidation.isAccepted) return studentsValidation

    return { isAccepted: true, message: 'data is valid', data: modules }

}

const updateUserMainData = (userData) => {

    const { firstName, sessionPrice } = userData


    if(firstName && !utils.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name formate', field: 'firstName' }

    if(sessionPrice && typeof sessionPrice != 'number') return { isAccepted: false, message: 'Session price format is invalid', field: 'sessionPrice' }


    return { isAccepted: true, message: 'data is valid', data: userData }

}

const updateUserProfileImage = (userData) => {

    const { profileImageURL } = userData

    if(!profileImageURL) return { isAccepted: false, message: 'Image URL is required', field: 'profileImageURL' }

    if(!utils.isValidURL(profileImageURL)) return { isAccepted: false, message: 'Image URL format is invalid', field: 'profileImageURL' }


    return { isAccepted: true, message: 'data is valid', data: userData }

}

const updateUserVisibility = (userData) => {

    const { isShow } = userData

    if(typeof isShow != 'boolean') return { isAccepted: false, message: 'Invalid isShow format', field: 'isShow' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const updateUserBlocked = (userData) => {

    const { isBlocked } = userData

    if(typeof isBlocked != 'boolean') return { isAccepted: false, message: 'Invalid isBlocked format', field: 'isBlocked' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const updateUserActivation = (userData) => {

    const { isDeactivated } = userData

    if(typeof isDeactivated != 'boolean') return { isAccepted: false, message: 'Invalid isDeactivated format', field: 'isDeactivated' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const updateUserSpeciality = (userData) => {

    const { speciality } = userData

    if(!speciality) return { isAccepted: false, message: 'Speciality is required', field: 'speciality' }

    if(!Array.isArray(speciality)) return { isAccepted: false, message: 'Speciality must be a list', field: 'speciality' }    

    if(speciality.length == 0) return { isAccepted: false, message: 'Speciality must be atleast one', field: 'speciality' }

    if(!checkSpeciality(speciality)) return { isAccepted: false, message: 'Invalid speciality format', field: 'speciality'}

    return { isAccepted: true, message: 'data is valid', data: userData }

}

const updateUserEmail = (userData) => {

    const { email } = userData

    if(!email) return { isAccepted: false, message: 'email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'invalid email formate', field: 'email' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const updateUserLanguage = (userData) => {

    const { lang } = userData

    if(!lang) return { isAccepted: false, message: 'language is required', field: 'lang' }

    if(!config.LANGUAGES.includes(lang)) return { isAccepted: false, message: 'invalid lang format', field: 'lang' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const updateUserPassword = (userData) => {

    const { password } = userData

    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }

    if(typeof password != 'string') return { isAccepted: false, message: 'invalid password formate', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const verifyAndUpdateUserPassword = (userData) => {

    const { newPassword, currentPassword } = userData

    if(!newPassword) return { isAccepted: false, message: 'new password is required', field: 'newPassword' }

    if(typeof newPassword != 'string') return { isAccepted: false, message: 'invalid new password format', field: 'newPassword' }

    if(!currentPassword) return { isAccepted: false, message: 'current password is required', field: 'currentPassword' }

    if(typeof currentPassword != 'string') return { isAccepted: false, message: 'invalid current password format', field: 'currentPassword' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const addEmployeeUser = (userData) => {

    const { ownerId, firstName, email, password, isBlocked, modules } = userData

    if(!ownerId) return { isAccepted: false, message: 'Owner ID is required', field: 'ownerId' }

    if(!utils.isObjectId(ownerId)) return { isAccepted: false, message: 'Owner ID is required', field: 'ownerId' }

    if(!firstName) return { isAccepted: false, message: 'First name is required', field: 'firstName' }

    if(!utils.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name formate', field: 'firstName' }

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'Email formate is invalid', field: 'email' }

    if(!password) return { isAccepted: false, message: 'Password is required', field: 'password' }

    if(typeof isBlocked != 'boolean') return { isAccepted: false, message: 'isBlocked format is invalid', field: 'isBlocked' }

    if(!modules) return { isAccepted: false, message: 'Modules is required', field: 'modules' }

    if(!isObject(modules)) return { isAccepted: false, message: 'Modules format is invalid', field: 'modules' }

    const moduleValidation = validateModules(modules)

    if(!moduleValidation.isAccepted) return moduleValidation


    return { isAccepted: true, message: 'data is valid', data: userData }
} 

const updateEmployeeUser = (userData) => {

    const { firstName, email, isBlocked, modules } = userData

    if(!firstName) return { isAccepted: false, message: 'First name is required', field: 'firstName' }

    if(!utils.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name formate', field: 'firstName' }

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'Email formate is invalid', field: 'email' }

    if(typeof isBlocked != 'boolean') return { isAccepted: false, message: 'isBlocked format is invalid', field: 'isBlocked' }

    if(!modules) return { isAccepted: false, message: 'Modules is required', field: 'modules' }

    if(!isObject(modules)) return { isAccepted: false, message: 'Modules format is invalid', field: 'modules' }

    const moduleValidation = validateModules(modules)

    if(!moduleValidation.isAccepted) return moduleValidation


    return { isAccepted: true, message: 'data is valid', data: userData }
} 



module.exports = { 
    updateUserMainData, 
    updateUserProfileImage,
    updateUserEmail, 
    updateUserPassword,
    updateUserLanguage,
    verifyAndUpdateUserPassword,
    updateUserSpeciality,
    addEmployeeUser,
    updateEmployeeUser,
    updateUserActivation,
    updateUserVisibility,
    updateUserBlocked
}