require('dotenv').config()
const { mongoose ,models: { User } } = require('data')
const { expect } = require('chai')
const { random } = Math
const bcrypt = require('bcrypt')
const { ContentError } = require('errors')
const { retrieveUser } = require('.')
const {env: {TEST_MONGODB_URL} } = process

describe('retrieve user', () => {
    before(() => 
        mongoose.connect(TEST_MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => User.deleteMany())
    )
    let name, surname, username, email, password, id

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        email = `mail-${random()}@mail.com`
        password = `password-${random()}`
    })

    describe('when user already exist', () => {
        beforeEach( async() => {
            const pass = await bcrypt.hash(password, 10)
            await User.create({name, surname, username, email, password: pass})
            const userId = await User.findOne({username})
            id = userId._id.toString()
        })

        it('should succeed on correct id', async() => {
            const retrieve = await retrieveUser(id)
            expect(retrieve.id).to.be.equal(id)
        })
        it('should fail on unexist user with the id', () => {
            let _id = '5eb51ba6741190244e49becc'
            retrieveUser(_id)
            .catch(({message}) => {
                expect(message).to.be.equal(`user with id: ${_id} not found`)
            }) 
        })
        describe('unhappy paths', () => {
            it('should fail on non-string id', () => {
                let id
                expect(() => retrieveUser(id)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non-string id', () => {
                let id = 1234
                expect(() => retrieveUser(id)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non-string id', () => {
                let id = true
                expect(() => retrieveUser(id)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non-string id', () => {
                let id = ''
                expect(() => retrieveUser(id)).to.throw(ContentError, `id is empty`)
            })
        })
    })
    after(async() => {
        await User.deleteMany()
        await mongoose.disconnect()
    })
})