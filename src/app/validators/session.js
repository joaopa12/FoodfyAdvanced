const User = require('../models/user')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("Admin/session/login.njk", {
        user: req.body,
        error: "Usuário não cadastrado"
    })

    const passed = await compare(password, user.password)

    if (!passed) return res.render("Admin/session/login.njk", {
        user: req.body,
        error: "Senha Incorreta!"
    })

    req.user = user

    next()
}

async function forgot(req, res, next){
    const { email } = req.body
    
    try{
        const user = await User.findOne({ where: { email } })

        if (!user) return res.render("Admin/session/forgot-password.njk", {
            user: req.body,
            error: "Email não cadastrado"
        })

        req.user = user

        next()
    }catch(err){
        console.error(err)
    }
}

async function reset(req, res, next){
    // procurar o usuario
    const { email, password, passwordRepeat, token } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("Admin/session/password-reset.njk", {
        user: req.body,
        token,
        error: "Usuário não cadastrado"
    })
    // ve se a senha bate
    if(password != passwordRepeat) return res.render("Admin/session/password-reset.njk", {
        user: req.body,
        token,
        error: "Senhas não são iguais!"
    })
    // verificar se o token bate
    if(token != user.reset_token) return res.render("Admin/session/password-reset.njk", {
        user: req.body,
        token,
        error: "Token inválido! Solicite uma nova recuperação de Senha."
    })
    // verificar se o token não expirou
    let now = new Date()
    now = now.setHours(now.getHours())

    if(now > user.reset_token_expires) return res.render("Admin/session/password-reset.njk", {
        user: req.body,
        token,
        error: "Token expirado! Por favor, solicite uma nova recuperação de senha."
    })

    req.user = user

    next()
}
module.exports = {
    login,
    forgot,
    reset
}