const UserModel = require('../models/UserModel')
const SpecializationModel = require('../models/SpecializationModel')
const specializationValidation = require('../validations/specializations')
const utils = require('../utils/utils')
const config = require('../config/config')


const getUserSpecializations = async (request, response) => {

    try {

        const { userId } = request.params
        let { name, limit, page } = request.query

        let { searchQuery } = utils.statsQueryGenerator('userId', userId, request.query)

        limit = limit ? Number.parseInt(limit) : config.PAGINATION_LIMIT
        page = page ? Number.parseInt(page) : 1

        const skip = (page - 1) * limit

        if(name) {
            searchQuery.name = { $regex: name, $options: 'i' }
        }

        const specializations = await SpecializationModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ])

        const totalSpecializations = await SpecializationModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalSpecializations,
            specializations
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

const addSpecialization = async (request, response) => {

    try {

        const dataValidation = specializationValidation.addSpecialization(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { userId, name } = request.body

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'User ID is not registered',
                field: 'userId'
            })
        }

        const totalNames = await SpecializationModel.countDocuments({ userId, name })
        if(totalNames != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'اسم التخصص مسجل مسبقا',
                field: 'name'
            })
        }

        const specializationData = { ...request.body }
        const specializationObj = new SpecializationModel(specializationData)
        const newSpecialization = await specializationObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة تخصص بنجاح',
            specialization: newSpecialization,
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


const updateSpecialization = async (request, response) => {

    try {

        const dataValidation = specializationValidation.updateSpecialization(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { specializationId } = request.params
        let { name } = request.body

        const specialization = await SpecializationModel.findById(specializationId)

        if(specialization.name != name) {
            const totalNames = await SpecializationModel.countDocuments({ userId: specialization.userId, name })
            if(totalNames != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'اسم التخصص مسجل مسبقا',
                    field: 'name'
                })
            }
        }

        const updatedSpecialization = await SpecializationModel.findByIdAndUpdate(specializationId, { name }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث التخصص بنجاح',
            specialization: updatedSpecialization,
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


const deleteSpecialization = async (request, response) => {

    try {

        const { specializationId } = request.params

        const deletedSpecialization = await SpecializationModel.findByIdAndDelete(specializationId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح التخصص بنجاح',
            specialization: deletedSpecialization
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
    getUserSpecializations,
    addSpecialization,
    updateSpecialization,
    deleteSpecialization
}