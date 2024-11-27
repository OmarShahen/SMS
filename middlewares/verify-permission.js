const config = require('../config/config')
const jwt = require('jsonwebtoken')
const utils = require('../utils/utils')


const verifyToken = (request, response, next) => {

    try {

        if(!request.headers['x-access-token']) {
            
            return response.status(401).json({
                accepted: false,
                message: 'unauthorized to access resources',
                field: 'x-access-token'
            })
        }

        const token = request.headers['x-access-token']

        jwt.verify(token, config.SECRET_KEY, (error, data) => {

            if(error) {
                return response.status(401).json({
                    accepted: false,
                    message: 'invalid token',
                    field: 'token'
                })
            }
            
            request.user = data
            
            next()
            return
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}


const allPermission = (request, response, next) => {

    try {

        const types = ['EMPLOYEE', 'ADMIN', 'OWNER']

        verifyToken(request, response, () => {

            const { type } = request.user

            if(types.includes(type)) {

                next()

            } else {

                return response.status(403).json({
                    accepted: false,
                    message: 'unauthorized user type to access this resources',
                    field: 'token'
                })
            }
            
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}



module.exports = { verifyToken, allPermission }