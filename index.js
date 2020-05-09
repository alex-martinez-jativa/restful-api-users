if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const { env: { PORT = 8080, NODE_ENV: env, MONGODB_URL }, argv: [, , port = PORT] } = process

const express = require('express')
const cors = require('cors')
const { mongoose } = require('data')
const router = require('./routes')

mongoose.connect(MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {

        const app = express()
        
        app.use(cors())
        app.use('/api', router)

        app.listen(port, () => console.info(`server listen on port ${port}`))
    })
    .catch((err) => {
        console.error(err)
    })