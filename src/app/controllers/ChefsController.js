const Chef = require("../models/chef")
const File = require("../models/file")
const Recipe = require("../models/recipe")

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
        const chef = await LoadChefService.load('chef',{
            where:{id:req.params.id}
        })
        
        const chef_recipes = await Chef.findrecipes()

        const recipes = await LoadRecipeService.load('recipes')
    
        return res.render('Admin/chefs/chef', { Chef:chef, chef_recipes, recipes })
    },
    async chefAdmin_edit(req, res) {
        const Chef = await LoadChefService.load('chef',{
            where:{id:req.params.id}
        })

        return res.render('Admin/chefs/editchef', { Chef, files:Chef.files})
    },
    chefsCreate(req, res) {
        return res.render('Admin/chefs/createChef')
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Preencha todos os campos!")
            }
        }

        if (req.files.length == 0) {
            return res.send('Porfavor enfie uma imagem')
        }

        const filePromise = req.files.map(file => File.create({ ...file }))
        let results = await filePromise[0]
        let file_id = results.rows[0].id

        let { name } = req.body

        const chefId = await Chef.create({
            name,
            file_id
        })

        return res.redirect(`/admin/Chefs/${chefId}`)
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {

            if (req.body[key] == "" && key != "removed_files") {
                return res.send("Preencha todos os campos!")
            }
        }

        let file_id  = await Chef.find(req.body.id)

        if (req.files.length != 0) {
            const oldFiles = await Chef.Getfiles(chef_id.file_id)

            const totalFiles = oldFiles.rows.length + req.files.length

            if (totalFiles < 2) {
                const newFilesPromise = req.files.map(file => File.create({ ...file }))

                const results = await newFilesPromise[0]
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

            await Chef.update(req.body, file_id)

            await removedFiles.map(id => File.chefDelete(id))
        }

        await Chef.update(req.body, file_id)

        return res.redirect(`/admin/Chefs/${chef_id}`)
    },
    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect("/admin/Chefs")
    }
}