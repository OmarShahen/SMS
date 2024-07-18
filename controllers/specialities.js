const SpecialityModel = require('../models/SpecialityModel')
const CounterModel = require('../models/CounterModel')
const specialityValidation = require('../validations/specialities')
const ItemModel = require('../models/ItemModel')
const mongoose = require('mongoose')


const getSpecialities = async (request, response) => {

    try {

        const { show } = request.query

        let matchQuery = { type: 'MAIN' }

        if(show == 'TRUE') {
            matchQuery.isShow = true
        } else if(show == 'FALSE') {
            matchQuery.isShow = false
        }

        const specialities = await SpecialityModel.find(matchQuery)

        return response.status(200).json({
            accepted: true,
            specialities
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

const getSpeciality = async (request, response) => {

    try {

        const { specialityId } = request.params

        const speciality = await SpecialityModel.findById(specialityId)

        return response.status(200).json({
            accepted: true,
            speciality
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

const getSubSpecialitiesOfMainSpeciality = async (request, response) => {

    try {

        const { specialityId } = request.params

        const specialities = await SpecialityModel.find({ mainSpecialityId: specialityId, type: 'SUB' })

        return response.status(200).json({
            accepted: true,
            specialities
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

const addSpeciality = async (request, response) => {

    try {

        const dataValidation = specialityValidation.addSpeciality(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, type, mainSpecialityId } = request.body

        const nameList = await SpecialityModel.find({ name })
        if(nameList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'اسم الفئة مسجل مسبقا',
                field: 'name'
            })
        }

        if(type == 'SUB') {
            const mainSpecialityList = await SpecialityModel.findById(mainSpecialityId)
            if(mainSpecialityList.length == 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Main speciality ID is not registered',
                    field: 'mainSpecialityId'
                })
            }
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'speciality' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const specialityData = { specialityId: counter.value, ...request.body }
        const specialityObj = new SpecialityModel(specialityData)
        const newSpeciality = await specialityObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'تم اضافة الفئة بنجاح',
            speciality: newSpeciality
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

const deleteSpeciality = async (request, response) => {

    try {

        const { specialityId } = request.params

        const totalItems = await ItemModel.countDocuments({ categoryId: specialityId })
        if(totalItems != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'هناك اصناف مسجلة مع هذه الفئة',
                field: 'specialityId'
            })
        }

        const deletedSpeciality = await SpecialityModel.findByIdAndDelete(specialityId)

        return response.status(200).json({
            accepted: true,
            message: 'تم مسح الفئة بنجاح',
            speciality: deletedSpeciality
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

const deleteSpecialities = async (request, response) => {

    try {

        const deletedSpecialities = await SpecialityModel.deleteMany({})

        return response.status(200).json({
            accepted: true,
            message: 'deleted all records successfully!',
            noOfDeletedRecords: deletedSpecialities.deletedCount
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

const updateSpeciality = async (request, response) => {

    try {

        const dataValidation = specialityValidation.updateSpeciality(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { specialityId } = request.params
        const { name } = request.body

        const speciality = await SpecialityModel.findById(specialityId)

        if(name != speciality.name) {

            const nameList = await SpecialityModel.find({ name })
            if(nameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'اسم الفئة مسجل مسبقا',
                    field: 'name'
                })
            }
        }

        const updatedspeciality = await SpecialityModel
        .findByIdAndUpdate(specialityId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث الفئة بنجاح',
            speciality: updatedspeciality
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

const updateSpecialityShowStatus = async (request, response) => {

    try {

        const dataValidation = specialityValidation.updateSpecialityShowStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { specialityId } = request.params
        const { isShow } = request.body

        const updatedspeciality = await SpecialityModel
        .findByIdAndUpdate(specialityId, { isShow }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'تم تحديث رؤية الفئة بنجاح',
            speciality: updatedspeciality
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
    getSpecialities, 
    getSpeciality,
    getSubSpecialitiesOfMainSpeciality,
    addSpeciality,
    deleteSpeciality, 
    deleteSpecialities, 
    updateSpeciality,
    updateSpecialityShowStatus
}