 const { unlinkSync } = require('fs')

const User = require('../models/user')
const Recipe = require('../models/recipe')
const mailer = require('../../lib/mailer')
const user = require('../models/user')

function createPassword() {
    const password = Math.random().toString(36).substr(2)
    return password
}

module.exports = {
    async list(req, res) {
        try {
            const users = await User.findAll()

            const user = req.session.userId.id

            const error = req.session.error

            return res.render("Admin/user/index.njk", { users, user, error })
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            const { id } = req.params

            const user = await User.find(id)

            const error = req.session.error

            return res.render('Admin/user/edit.njk', { user, error })
        } catch (error) {
            console.error(error)
        }
    },
    registerForm(req, res) {
        return res.render("Admin/user/register.njk")
    },
    async show(req, res) {
        try {
            const userId = await User.find(req.session.userId)

            const error = req.session.error
            req.session.error = "";

            return res.render('Admin/user/show.njk', { user: userId, error })
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            let { name, email, is_admin } = req.body

            const password = createPassword()

            const userId = await User.create({
                name,
                email,
                is_admin,
                password
            })

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@Foodfy.com',
                subject: 'Cadastrado Foodfy',
                html: `<h2>Cadastrado Foodfy</h2>
                <p>Cadastrado Concluido!</p>
                <p>
                   A senha da sua conta é ${password}
                </p>
                `
            })

            req.session.userId = userId

            return res.redirect(`/admin/users/${userId}`)
        } catch (error) {
            console.error(error)
        }
    },
    async update(req, res) {
        try {
            const { user } = req

            let { name, email, is_admin } = req.body

            await User.update(user.id, {
                name,
                email,
                is_admin
            })

            return res.redirect('/admin/users')
        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        try {
            const recipes = await Recipe.findAll({where:{user_id:req.body.id}})

            const allFilesPromise = recipes.map(recipe => Recipe.files(recipe.id))
    
            let promiseResults = await Promise.all(allFilesPromise)
    
            User.delete(req.body.id)
            req.session.destroy()
    
            promiseResults.map(files => {
                files.map(file =>{
                    try{
                        unlinkSync(file.path)
                    } catch(err){
                        console.error(err)
                    }
                })
            })
    
            return res.render("Admin/session/login.njk", {
                sucess:"Conta Deletada com sucesso"
            })
        } catch (error) {
            return res.render("/admin/users/",{
                user: req.body,
                error:"Erro ao tentar deletar sua conta!"
            })
        }
    }
}