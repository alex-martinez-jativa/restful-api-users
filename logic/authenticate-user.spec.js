require('dotenv').config()
const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User } } = require('data')
const { ContentError } = require('errors')
const bcrypt = require('bcrypt')
const { authenticateUser } = require('.')

const {env: {TEST_MONGODB_URL} } = process

describe('authenticate user', () => {
    let name, surname, username, email, password

    before(() => 
        mongoose.connect(TEST_MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => User.deleteMany())
    )
    
    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        email = `mail-${random()}@mail.com`
        password = `password-${random()}`
    })

    describe('when user already exist', () => {
        beforeEach(async() => {
            const pass = await bcrypt.hash(password, 10)
            await User.create({name, surname, username, email, password: pass})
        })

        it('should succeed on right credentials', async()=>{
            const token = await authenticateUser(email, password)
            expect(token).to.exist
            expect(token).to.be.an('string')
        })
        it('should fail on wrong credentials', () => {
            authenticateUser(email, '1234')
            .catch(({message}) => {
                expect(message).to.equal('wrong credentials')
            })
        })
    })
    
    describe('unhappy paths', () => {
        it('should fail on non-string email', () => {
            let email = true
            expect(() => authenticateUser(email, password)).to.throw(TypeError, `email ${email} is not a string`)
        })
        it('should fail on non-valid email', () => {
            let email = 'email.com'
            expect(() => authenticateUser(email, password)).to.throw(ContentError, `${email} is not an e-mail`)
        })
        it('should fail on non-string password', () => {
            let password = 1234
            expect(() => authenticateUser(email, password)).to.throw(TypeError, `password ${password} is not a string`)
        })
    })

    after(async() => {
        await User.deleteMany()
        await mongoose.disconnect()
    })
})