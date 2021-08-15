const User = require('../models/user')
const { compare } = require('bcryptjs')

function checkAllFields(body){
    const keys = Object.keys(body)

    for(key of keys){
        if(body[key] == ""){
            return{
                user:body,
                error:'Por favor, preencha todos os campos!'
            }
        }
    }
}

async function post(req, res, next){
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields){
        return res.render('Admin/user/register.njk', fillAllFields)
    }

    let { email, name } = req.body

    const user = await User.findOne({
        where:{ email },
        or:{ name }
    })

    if(user)  return res.render('Admin/user/register.njk',{
        user:req.body,
        error:"Usuário já cadastrado!"
    })

    next()
}

async function update(req, res, next){
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields){
        return res.render('Admin/user/show.njk', fillAllFields)
    }
    //has password 
    const { id, password } = req.body
   
    if(!password) return res.render('Admin/user/show.njk', {
        user:req.body,
        error:"Coloque sua senha para atualizar seu cadastro!"
    })

    //password match
    const user = await User.findOne({ where: {id} })

    const passed = await compare(password, user.password)

    if(!passed) return res.render('Admin/user/show.njk', {
        user:req.body,
        error:"Senha Incorreta!"
    })

    req.user = user

    next()
}

module.exports = {
    post,
    update
}