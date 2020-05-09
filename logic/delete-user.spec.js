require('dotenv').config()
const { mongoose, models: { User } } = require('data')
const {env: {TEST_MONGODB_URL} } = process
const { random } = Math
const { expect } = require('chai')
const bcrypt = require('bcrypt')
const { deleteUser } = require('.')

describe('delete user', () => {
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
        it('should succeed on correct data', async()=> {
            const res = await deleteUser(id, password)
            expect(res).to.be.undefined
        })
        it('should fail on find delete user', () => {
            deleteUser(id, password)
            .catch(({message}) => {
                expect(message).to.be.equal(`user with id: ${id} does not exist`)
            })
        })
        describe('unhappy paths', () => {
            it('should fail on-non string id', () => {
                let id = 1234
                expect(() => deleteUser(id, password)).to.throw(`id ${id} is not a string`)
            })
            it('should fail on-non string id', () => {
                let id = true
                expect(() => deleteUser(id, password)).to.throw(`id ${id} is not a string`)
            })
            it('should fail on-non string id', () => {
                let id
                expect(() => deleteUser(id, password)).to.throw(`id ${id} is not a string`)
            })
            it('should fail on-non string id', () => {
                let id = ''
                expect(() => deleteUser(id, password)).to.throw(`${id} is empty`)
            })
            it('should fail on-non string password', () => {
                let password = 1234
                expect(() => deleteUser(id, password)).to.throw(`password ${password} is not a string`)
            })
            it('should fail on-non string password', () => {
                let password = true
                expect(() => deleteUser(id, password)).to.throw(`password ${password} is not a string`)
            })
            it('should fail on-non string password', () => {
                let password = undefined
                expect(() => deleteUser(id, password)).to.throw(`password ${password} is not a string`)
            })
            it('should fail on-non string password', () => {
                let password = ''
                expect(() => deleteUser(id, password)).to.throw(`${password} is empty`)
            })
        })
    })
    after(async() => {
        await User.deleteMany()
        await mongoose.disconnect()
    })
})