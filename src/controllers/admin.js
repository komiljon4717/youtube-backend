const { AuthorizationError, InternalServerError } = require('../utils/error.js')
const { verify } = require('../utils/jwt.js')
const path = require('path')
const fs = require('fs')
let d = new Date

const POST = (req, res, next) => {
    try {
        
        let { name } = req.body
		const { video } = req.files
        if(!video) {
			return next(
                new AuthorizationError(400, 'video is required!')
            )
		}
        if(!name) {
			return next(
                new AuthorizationError(400, 'Name is required!')
            )
		}

		if(!['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/flv'].includes(video.mimetype)) {
			return next(
                new AuthorizationError(400, 'Wrong file mimetype')
            )
		}

        if(video.size > 50 * 1024 * 1024) {
			return next(
                new AuthorizationError(400, 'File is too large!')
            )
		}
        
        const videos = req.readFile('videos') || []
        
        req.body.videoId = videos.length ? videos.at(-1).videoId + 1 : 1
        

        const videoName = Date.now() + video.name.replace(/\s/g, "")
        const filePath = path.join(__dirname, '../', 'uploads', "videos", videoName)
        video.mv(filePath)

        
        dformat = [d.getFullYear(), d.getMonth()+1, d.getDate()].join('/')+' | '+[d.getHours(), d.getMinutes()].join(':');
        

        req.body.userId = verify(req.headers.token).userId
        req.body.videoSize = Math.ceil(video.size / 1024 / 1024)
        req.body.video = videoName
        req.body.time = dformat
        
        videos.push(req.body)
        req.writeFile('videos', videos)

    
        return res.status(201).json({
            status: 201,
            message: 'The video successfully upload!',
            result: null
        })
        
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const GET = (req, res) => {
    try {
        let { token } = req.headers
        let userId = verify(token).userId

        const videos = req.readFile('videos') || []

        let one = videos.filter(el => el.userId == userId)
        console.log(one);
        
        one.map(el => {
            el.video =  "/videos/" + el.video
            return el
        })

        return res.status(201).json({
            status: 201,
            message: 'successfully',
            result: one
        })

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}


const DELETE = (req, res) => {
    try {
        let { videoId } = req.body
        
        const videos = req.readFile('videos') || []
        
        let one = videos.find(el => el.videoId == videoId)
        console.log(one);

        let newVideos = videos.filter(el => el.videoId != videoId)
        const filePath = path.join(__dirname, '../', 'uploads', "videos", one.video)

        fs.unlink(filePath, (err) => {
            // if (err) {
            //    throw new Error(err);
            // }
        })  
        req.writeFile("videos", newVideos)

        return res.status(201).json({
            status: 201,
            message: 'successfully deleted',
            result: newVideos
        })

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const PUT = (req, res) => {
    try {
        let { videoId, caption } = req.body

        const videos = req.readFile('videos') || []

        videos.forEach(el =>{
            if (el.videoId == videoId) {
                el.name = caption
            }
        })
 
        req.writeFile("videos", videos)

        return res.status(201).json({
            status: 201,
            message: 'successfully edited',
            result: videos
        })

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

module.exports = {
    POST, GET, DELETE, PUT
}