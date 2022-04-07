const { AuthorizationError, InternalServerError } = require('../utils/error.js')
const { verify } = require('../utils/jwt.js')
const path = require('path')


const GET = (req, res) => {
    try {
        let { token } = req.headers
        let userId = verify(token).userId

        const users = req.readFile('users') || []
        const videos = req.readFile('videos') || []

        users.map(el => {
            delete el.password
            el.img =  "/picture/" + el.img
            return el
        })

        videos.map(el => {
            el.video =  "/videos/" + el.video
            return el
        })
        
        let adminImage = {}
        for (const user of users) {
            if (user.userId == userId) {
                adminImage ={img: user.img}
            }   

        }
        return res.status(201).json({
            status: 201,
            message: 'successfully get',
            result: {users, videos, adminImage}
        })

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}


const POST = (req, res) => {
    try {
        let { userId } = req.body

        const videos = req.readFile('videos') || []

        let one = videos.filter(el => el.userId == userId)

        return res.status(201).json({
            status: 201,
            message: 'successfully',
            result: one
        })
        
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}


module.exports = {
    GET, POST
}