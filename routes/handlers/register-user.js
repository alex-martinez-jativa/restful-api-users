const { registerUser } = require('../../logic')
const { NotAllowedError, ContentError} = require('errors')

module.exports = (req, res) => {
    const { body: {name, surname, username, email, password} } = req

    return (async() => {

        try{
            await registerUser(name, surname, username, email, password)
            return res.status(201).end()
    
        }catch(error){
            let status = 400

            switch(error){
                case error instanceof NotAllowedError:
                    status = 409 //conflict
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