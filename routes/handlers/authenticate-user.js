const { authenticateUser } = require('../../logic')
const { NotAllowedError, ContentError } = require('errors')
const jwt = require('jsonwebtoken')
const { env: { JWT_EXP, JWT_SECRET } } = process 

module.exports = (req, res) => {
    const {body: {email, password} } = req

    return (async() => {

        try{

            const id = await authenticateUser(email, password)
            const token = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: JWT_EXP })
            
            return res.status(200).json({token})
        
        }catch(error){
            let status = 400

            switch(error){
                case error instanceof NotAllowedError:
                    status = 401 //not authorized
                    break
                case error instanceof TypeError || error instanceof ContentError:
                    status = 406 //not acceptable
                    break
            }

            const { message } = error

            return res.status(status).json({error: message})
        }
    })()
}