const utils = require('../utils/utils')
const config = require('../config/config')

const addStudent = (studentData) => {

    const { userId, groupId, name, phone, parentPhone, gender, isActive, birthDate, academicYear, address, referredBy } = studentData

    if(!userId) return { isAccepted: false, message: 'User ID is required', field: 'userId' }

    if(!utils.isObjectId(userId)) return { isAccepted: false, message: 'User ID format is invalid', field: 'userId' }

    if(!groupId) return { isAccepted: false, message: 'Group ID is required', field: 'groupId' }

    if(!utils.isObjectId(groupId)) return { isAccepted: false, message: 'Group ID format is invalid', field: 'groupId' }

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }

    if(!utils.isPhoneValid(phone)) return { isAccepted: false, message: 'الرقم غير صحيح', field: 'phone' }

    if(!parentPhone) return { isAccepted: false, message: 'الرقم غير صحيح', field: 'parentPhone' }

    if(!utils.isPhoneValid(parentPhone)) return { isAccepted: false, message: 'تنسيق هاتف الوالدين غير صالح', field: 'parentPhone' }

    if(!gender) return { isAccepted: false, message: 'Gender is required', field: 'gender' }

    if(typeof gender != 'string') return { isAccepted: false, message: 'Gender format is invalid', field: 'gender' }

    if(!config.GENDER.includes(gender)) return { isAccepted: false, message: 'Gender value is invalid', field: 'gender' }

    if(birthDate && !utils.isDateValid(birthDate)) return { isAccepted: false, message: 'Birth date format is invalid', field: 'birthDate' }

    if(!academicYear) return { isAccepted: false, message: 'Academic year is required', field: 'academicYear' }

    if(typeof academicYear != 'string') return { isAccepted: false, message: 'Academic year format is invalid', field: 'academicYear' }

    if(!config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(address && typeof address != 'string') return { isAccepted: false, message: 'Address format is invalid', field: 'address' }

    if(referredBy && !config.REFER_METHODS.includes(referredBy)) return { isAccepted: false, message: 'Referred by value is invalid', field: 'referredBy' }



    return { isAccepted: true, message: 'data is valid', data: studentData }
}

const updateStudent = (studentData) => {

    const { groupId, name, phone, parentPhone, gender, isActive, birthDate, academicYear, address, referredBy } = studentData

    if(groupId && !utils.isObjectId(groupId)) return { isAccepted: false, message: 'Group ID format is invalid', field: 'groupId' }

    if(name && typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(phone && !utils.isPhoneValid(phone)) return { isAccepted: false, message: 'الرقم غير صحيح', field: 'phone' }

    if(parentPhone && !utils.isPhoneValid(parentPhone)) return { isAccepted: false, message: 'الرقم غير صحيح', field: 'parentPhone' }

    if(gender && !config.GENDER.includes(gender)) return { isAccepted: false, message: 'Gender value is invalid', field: 'gender' }

    if(birthDate && !utils.isDateValid(birthDate)) return { isAccepted: false, message: 'Birth date format is invalid', field: 'birthDate' }

    if(academicYear && !config.ACADEMIC_YEARS.includes(academicYear)) return { isAccepted: false, message: 'Academic year value is invalid', field: 'academicYear' }

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    if(address && typeof address != 'string') return { isAccepted: false, message: 'Address format is invalid', field: 'address' }

    if(referredBy && !config.REFER_METHODS.includes(referredBy)) return { isAccepted: false, message: 'Referred by value is invalid', field: 'referredBy' }


    return { isAccepted: true, message: 'data is valid', data: studentData }
}


module.exports = { addStudent, updateStudent }