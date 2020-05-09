const { Router } = require('express')
const { registerUser, authenticateUser, retrieveUser, retrieveAllUsers, updateUser, updateUserPassword, deleteUser } = require('./handlers')
const { jwtVerifierMidWare } = require('../midlewares')
const bodyparser = require('body-parser')

const jsonBodyParser = bodyparser.json()

const router = new Router()

router.post('/user', jsonBodyParser, registerUser)
router.post('/user/auth', jsonBodyParser, authenticateUser)
router.get('/user', jwtVerifierMidWare, retrieveUser)
router.get('/users', jwtVerifierMidWare, jsonBodyParser, retrieveAllUsers)
router.patch('/user', jwtVerifierMidWare, jsonBodyParser, updateUser)
router.patch('/user/password', jwtVerifierMidWare, jsonBodyParser, updateUserPassword)
router.delete('/user/delete', jwtVerifierMidWare, jsonBodyParser,  deleteUser)

module.exports = router