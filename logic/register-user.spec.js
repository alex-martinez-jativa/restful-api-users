require('dotenv').config()
const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User } } = require('data')
const { ContentError } = require('errors')
const bcrypt = require('bcrypt')
const { registerUser } = require('.')

const { env: { TEST_MONGODB_URL } } = process

describe('register user', () => {
    
    before(() => 
    mongoose.connect(TEST_MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => User.deleteMany())
    )
    
    let name, surname, username, email, password
    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        email = `mail-${random()}@mail.com`
        password = `password-${random()}`
    })

    it('should succeed on correct user data', async() => {
        const response = await registerUser(name, surname, username, email, password)
        expect(response).to.be.undefined

        const retrieve = await User.findOne({email})
        expect(retrieve).to.exist
        expect(retrieve.name).to.be.equal(name)
        expect(retrieve.surname).to.be.equal(surname)
        expect(retrieve.username).to.be.equal(username)
        expect(retrieve.email).to.be.equal(email)

        const pass = await bcrypt.compare(password, retrieve.password)
        expect(pass).to.be.true
    })

    it('should fail on register user if the user email already exist',() => {
        registerUser(name, surname, username, email, password)
            .catch(({ message }) => {
                expect(message).not.to.be.undefined
                expect(message).to.equal(`user with email ${email} already exists`)
            })
    })
    it('should fail on register user if the user username already exist',() => {
        
        registerUser(name, surname, username, 'test@email.com', password)
            .catch(({ message }) => {
                expect(message).not.to.be.undefined
                expect(message).to.equal(`user with username ${username} already exists`)
            })
    })
    
    describe('unhappy paths', () => {
        it('should fail on non-string name',() => {
            let name = 123
            expect(() => registerUser(name, surname, username, email, password)).to.throw(TypeError, `name ${name} is not a string`)
        })
        it('should fail on non-string surname',() => {
            let surname = true
            expect(() => registerUser(name, surname, username, email, password)).to.throw(TypeError, `surname ${surname} is not a string`)
        })
        it('should fail on non-string username',() => {
            let username = false
            expect(() => registerUser(name, surname, username, email, password)).to.throw(TypeError, `user name ${username} is not a string`)
        })
        it('should fail on non-string email',() => {
            let email = undefined
            expect(() => registerUser(name, surname, username, email, password)).to.throw(TypeError, `email ${email} is not a string`)
        })
        it('should fail on non-valid email',() => {
            let email = 'email'
            expect(() => registerUser(name, surname, username, email, password)).to.throw(ContentError, `${email} is not an e-mail`)
        })
        it('should fail on non-string password',() => {
            let password = 5465
            expect(() => registerUser(name, surname, username, email, password)).to.throw(TypeError, `password ${password} is not a string`)
        })
    })

    after(async() => {
        await User.deleteMany()
        await mongoose.disconnect()
    })
})