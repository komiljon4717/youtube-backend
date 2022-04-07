const express = require('express')
const fileUpload = require('express-fileupload')
const path = require('path')
const fs = require('fs')
let cors = require("cors");
const app = express()

const PORT = process.env.PORT || 5000
app.use(cors())
app.use(express.static(path.join(__dirname, 'uploads')))

require('./config.js')
require('./utils/validation.js')

const modelMiddleware = require('./middlewares/model.js')

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, token')

//     return next()
// })


app.use(fileUpload())
app.use(modelMiddleware({ databasePath: path.join(__dirname, 'database')}))
app.use(express.json())


const authRouter = require('./routes/auth.js')
const userRouter = require('./routes/user.js')
const adminRouter = require('./routes/admin.js')
const homeRouter = require('./routes/index.js')
app.use(authRouter)
app.use(userRouter)
app.use(adminRouter)
app.use(homeRouter)





app.use((error, req, res, next) => {
    
    if (error.name == 'ValidationError') {
        return res.status(error.status).json({
            status: error.status,
            message: error.message.details[0].message,
            errorName: error.name,
            error: true,
        })
    }
    
    if (error.status != 500) {
        return res.status(error.status).json({
            status: error.status,
            message: error.message,
            errorName: error.name,
            error: true,
        })
    }
    
    fs.appendFileSync('./log.txt', `${req.url}__${req.method}__${Date.now()}__${error.name}__${error.message}\n`)
    
    return res.status(error.status).json({
        status: error.status,
        message: 'Internal Server Error',
        errorName: error.name,
        error: true,
    })
})




app.listen(PORT, () => console.log('server is ready at http://localhost:' + PORT))