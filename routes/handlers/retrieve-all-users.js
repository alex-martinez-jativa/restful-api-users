const { retrieveAllUsers } = require('../../logic')
const { NotAllowedError, ContentError } = require('errors')

module.exports = (req, res) => {
    const {payload: {sub:id} } = req

    return (async() => {

        try{
            const users = await retrieveAllUsers(id)
            return res.status(200).json(users)
        
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