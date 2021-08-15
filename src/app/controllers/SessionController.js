const User = require('../models/user')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')
const crypto = require("crypto")

module.exports = {
    loginForm(req, res){
        return res.render("Admin/session/login.njk")
    },
    logout(req,res){
        req.session.destroy()

        return res.redirect("/")
    },
    login(req,res){
        req.session.userId = req.user.id
        req.session.isAdmin = req.user.is_admin

        return res.redirect("/admin/users/")
    },
    forgotForm(req,res){
        return res.render("Admin/session/forgot-password")
    },
    async forgot(req,res){
         const user = req.user

        //criação do token
        const token = crypto.randomBytes(20).toString("hex")
        
        //expiração do token
        let now = new Date()
        now = now.setHours(now.getHours() + 1)

        await User.update(user.id, {
            reset_token: token,
            reset_token_expires: now
        })
        // enviar email com link de recuperação

        await mailer.sendMail({
            to:user.email,
            from: 'no-reply@Foodfy.com',
            subject: 'Recuperação de Senha',
            html: ` <h2>Perdeu a chave?</h2>
            <p>Não se preocupe, clique no link para mudar a sua senha</p>
            <p>
               <a href="http://localhost:3000/admin/users/password-reset?token=${token}" target="_blank">
               Recuperar Senha
               </a>
            </p>
            `
        })
        
        return res.render('Admin/session/forgot-password.njk', {
            user:req.body,
            sucess:"Verifique seu Email!"
        })
    },
    resetForm(req,res){
        return res.render("Admin/session/password-reset", { token: req.query.token })
    },
    async reset(req,res){
        const user = req.user

        const { email, password, token } = req.body

        try{
            //enviar email com a nova senha!
            await mailer.sendMail({
                to:email,
                from: 'no-reply@Foodfy.com',
                subject: 'Nova Senha Foodfy',
                html: `<h2>Nova senha</h2>
                <p>Senha Atualizada!</p>
                <p>
                   A sua nova senha é ${password}
                </p>
                `
            })
    
            // criar um novo hash de senha
            const newPassword = await hash(password, 10)

            // atualizar o usuário
            await User.update(user.id,{
                password:newPassword,
                reset_token:"",
                reset_token_expires:""
            })

            // avisa o usuário que ele tem uma nova senha
            return res.render("Admin/session/login.njk",{
                user:req.body,
                token,
                sucess:"Senha atualizada enviada para o Email!"
            })

        }catch(err){
            console.error(err)
        }

    }
}