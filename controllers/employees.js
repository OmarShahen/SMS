const UserModel = require('../models/UserModel')
const SpecialityModel = require('../models/SpecialityModel')
const employeeValidation = require('../validations/employees')
const CounterModel = require('../models/CounterModel')
const OrderModel = require('../models/OrderModel')
const bcrypt = require('bcrypt')
const config = require('../config/config')


const updateEmployee = async (request, response) => {

    try {

        const { userId } = request.params

        const dataValidation = employeeValidation.updateEmployee(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email } = request.body

        const employee = await UserModel.findById(userId)

        if(employee.email != email) {
            const emailList = await UserModel.find({ email, isVerified: true })
            if(emailList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'البريد مسجل مسبقا',
                    field: 'email'
                })
            }
        }

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, request.body, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث المستخدم بنجاح',
            user: updatedUser
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const addEmployee = async (request, response) => {

    try {

        const dataValidation = employeeValidation.addEmployee(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, password } = request.body

        const emailList = await UserModel.find({ email, isVerified: true })
        if(emailList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'البريد مسجل مسبقا',
                field: 'email'
            })
        }

        const employeeData = {
            ...request.body,
            type: 'EMPLOYEE',
            isVerified: true,
            isEmployee: true
        }

        const hashedPassword = bcrypt.hashSync(password, config.SALT_ROUNDS)

        employeeData.password = hashedPassword   

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'user' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        employeeData.userId = counter.value

        const userObj = new UserModel(employeeData)
        const newUser = await userObj.save()

        newUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة المستخدم بنجاح',
            user: newUser
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getEmployees = async (request, response) => {

    try {

        const matchQuery = { type: 'EMPLOYEE', isVerified: true }

        const employees = await UserModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    password: 0
                }
            }
        ])

        const totalEmployees = await UserModel.countDocuments(matchQuery)

        return response.status(200).json({
            accepted: true,
            totalEmployees,
            employees
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const searchEmployeesByName = async (request, response) => {

    try {

        let { name } = request.query

        name = name ? name : ''

        const matchQuery = {
            isVerified: true,
            type: 'EMPLOYEE',
            firstName: { $regex: name, $options: 'i' }
        }

        const employees = await UserModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 25
            },
            {
                $project: {
                    password: 0
                }
            }
        ])

        return response.status(200).json({
            accepted: true,
            employees
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteEmployee = async (request, response) => {

    try {

        const { userId } = request.params
        
        const totalOrders = await OrderModel.countDocuments({ cashierId: userId })

        if(totalOrders != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'هناك طلبات مسجلة مع هذا المستخدم',
                field: 'userId'
            })
        }

        const deletedUser = await UserModel.findByIdAndDelete(userId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح المستخدم بنجاح',
            user: deletedUser
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateEmployeeBlock = async (request, response) => {

    try {

        const dataValidation = employeeValidation.updateEmployeeBlock(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId } = request.params
        const { isBlocked } = request.body

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, { isBlocked }, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث حالة منع الحساب بنجاح',
            user: updatedUser
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}


module.exports = { 
    updateEmployee,
    searchEmployeesByName,
    addEmployee, 
    getEmployees,
    deleteEmployee,
    updateEmployeeBlock
}