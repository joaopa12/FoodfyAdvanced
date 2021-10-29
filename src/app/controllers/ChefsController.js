const Chef = require("../models/chef")
const File = require("../models/file")

const LoadChefService = require('../services/LoadChefService')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async chefsAdmin(req, res) {
        try {
            const Chefs = await LoadChefService.load('chefs')

            return res.render("Admin/chefs/chefs", { Chefs })
        } catch (error) {
            console.error(error)
        }

    },
    async chefAdmin(req, res) {
        const chef = await LoadChefService.load('chef', {
            where: { id: req.params.id }
        })

        const chef_recipes = await Chef.findrecipes()

        const recipes = await LoadRecipeService.load('recipes')

        return res.render('Admin/chefs/chef', { Chef: chef, chef_recipes, recipes })
    },
    async chefAdmin_edit(req, res) {
        const Chef = await LoadChefService.load('chef', {
            where: { id: req.params.id }
        })

        return res.render('Admin/chefs/editchef', { Chef, files: Chef.files })
    },
    chefsCreate(req, res) {
        return res.render('Admin/chefs/createChef')
    },
    async post(req, res) {
        let { name } = req.body

        const filePromise = req.files.map(file => File.create({ ...file }))
        let results = await filePromise[0]
        let file_id = results.rows[0].id

        const chefId = await Chef.create({
            name,
            file_id
        })

        return res.redirect(`/admin/Chefs/${chefId}`)
    },
    async put(req, res) {
        let file = await Chef.files(req.body.id)
        let file_id = file[0].file_id

        if (req.files.length != 0) {
            const oldFiles = await Chef.files(req.body.id)
            const totalFiles = oldFiles.length + req.files.length

            if (totalFiles < 3) {
                const newFilesPromise = req.files.map(file => File.create({ ...file }))

                let results = await newFilesPromise[0]
                file_id = results.rows[0].id
            }
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")

            const lastIndex = removedFiles.length - 1

            removedFiles.splice(lastIndex, 1)

            if (req.files.length == 0) {
                return res.send('Envie pelo menos uma imagem!')
            }

            await Chef.update(req.body.id, {
                name: req.body.name,
                file_id: file_id
            })

            await removedFiles.map(id => File.chefDelete(id))
            await Promise.all(removedFiles)
        }

        await Chef.update(req.body.id, {
            name: req.body.name,
            file_id: file_id
        })

        return res.redirect(`/admin/Chefs/${req.body.id}`)
    },
    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect("/admin/Chefs")
    }
}