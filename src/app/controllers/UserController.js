const User = require('../models/user')
const mailer = require('../../lib/mailer')

function createPassword() {
    const password = Math.random().toString(36).substr(2)
    return password
}

module.exports = {
    async list(req, res) {
        let results = await User.all()
        const users = results.rows

        const user = req.session.userId.id
        
        const error = req.session.error

        return res.render("Admin/user/index.njk", { users, user, error })
    },
    async edit(req, res) {
        const { id } = req.params

        let results = await User.find(id)
        const user = results.rows[0]

        const error = req.session.error

        return res.render('Admin/user/edit.njk', { user, error })
    },
    registerForm(req, res) {
        return res.render("Admin/user/register.njk")
    },
    async show(req, res) {
        let results = await User.find(req.session.userId)
        const userId = results.rows[0]

        req.session.userId = userId.id

        const error = req.session.error
        req.session.error = "";
    
        return res.render('Admin/user/show.njk', { user: userId, error })
    },
    async post(req, res) {
        const password = createPassword()

        const userId = await User.create(req.body, password)

        await mailer.sendMail({
            to:req.body.email,
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
    },
    async update(req, res) {
        const { user } = req

        let { name, email, is_admin } = req.body

        await User.update(user.id, {
            name,
            email,
            is_admin
        })

        return res.redirect('/admin/users')
    },
    async delete(req, res) {
        const { id } = req.body

        User.delete(id)

        return res.redirect('/admin/users')
    }
}