const { AuthorizationError, InternalServerError } = require('../utils/error.js')
const { sign } = require('../utils/jwt.js')
const sha256 = require('sha256')
const path = require('path')


const REGISTER = (req, res, next) => {
    try {
        
        let { username, password } = req.body
		const { file } = req.files


        if(!file) {
			return next(
                new AuthorizationError(400, 'file is required!')
            )
		}

		if(!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
			return next(
                new AuthorizationError(400, 'Wrong file mimetype')
            )
		}

        if(file.size > 5 * 1024 * 1024) {
			return next(
                new AuthorizationError(400, 'File is too large!')
            )
		}
        
        const users = req.readFile('users') || []
        
        req.body.userId = users.length ? users.at(-1).userId + 1 : 1
        req.body.password = sha256(req.body.password)
        
        if (users.find(user => user.username == req.body.username)) {
            return next(
                new AuthorizationError(400, 'The user already exists')
            )
        }
        const fileName = Date.now() + file.name.replace(/\s/g, "")
        const filePath = path.join(__dirname, '../', 'uploads', "picture", fileName)
        file.mv(filePath)
        req.body.img = fileName
        
        users.push(req.body)
        req.writeFile('users', users)

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']
    
        return res.status(201).json({
            status: 201,
            message: 'The user successfully registered!',
            token: sign({ agent, ip, userId: req.body.userId })
        })
        
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const LOGIN = (req, res, next) => {
    try {
        const users = req.readFile('users') || []

        req.body.password = sha256(req.body.password)
        const user = users.find(user => user.username == req.body.username && user.password == req.body.password)

        if (!user) {
            return next(
                new AuthorizationError(400, 'Wrong username or password!')
            )
        }

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']

        return res.status(200).json({
            status: 200,
            message: 'The user successfully logged in!',
            token: sign({ agent, ip, userId: user.userId })
        })
        
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

module.exports = {
    LOGIN, REGISTER
}