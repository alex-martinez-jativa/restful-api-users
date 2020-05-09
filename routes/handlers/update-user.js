const { updateUser } = require('../../logic')
const { NotAllowedError, ContentError } = require('errors')

module.exports = (req,res) => {
    const {payload: {sub: id}, body} = req

    return (async() => {
        try{
            await updateUser(id, body)
            return res.status(201).end()

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
            
            const {message} = error
            return res.status(status).json({error: message})
        }
    })()

}