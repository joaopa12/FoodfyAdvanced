const express = require('express')
const routes = express.Router()
const { onlyUsers, isLoggedRedirectToUsers, onlyAdmin, forAdmin } = require('../app/middlewares/session')

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')


// login/logout
routes.get("/login",isLoggedRedirectToUsers, SessionController.loginForm)
routes.post("/login", SessionValidator.login, SessionController.login)
routes.post("/logout", SessionController.logout)

// forgot/reset password
routes.get('/forgot-password', SessionController.forgotForm)
routes.post('/forgot-password',SessionValidator.forgot, SessionController.forgot)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset) 

// Usuário logado
routes.get("/profile",onlyUsers,UserController.show)
routes.put("/profile", UserController.update)

//User Register
routes.get('/register',onlyAdmin, UserController.registerForm)
routes.post('/register', onlyAdmin,UserValidator.post, UserController.post)

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/' , onlyUsers, forAdmin, UserController.list)
routes.get("/:id/edit", onlyAdmin ,onlyUsers, UserController.edit)
routes.put('/', onlyUsers, UserValidator.update,UserController.update)
routes.delete("/", onlyUsers, onlyAdmin, UserController.delete)
  
module.exports = routes 