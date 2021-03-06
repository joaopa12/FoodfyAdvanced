const Chef = require("../models/chef")
const Recipe = require("../models/recipe")
const File = require("../models/file")

const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {
        try {
            const chefsOptions = await Chef.findAll()

            const recipes = await LoadRecipeService.load('recipes')
    
            return res.render("Admin/recipes/index", { chefsOptions, recipes })
            
        } catch (error) {
            console.error(error)
        }
       
    },
    async create(req, res) {
        const chefsOptions = await Chef.findAll()

        return res.render("Admin/recipes/create", { chefsOptions })
    },
    async recipe_admin(req, res) {
        const chefsOptions = await Chef.findAll()

        const recipe = await LoadRecipeService.load('recipe',{
            where:{id:req.params.id}
        })

        return res.render("Admin/recipes/recipe", { chefsOptions, recipe, files:recipe.files })
    },
    async recipe_admin_edit(req, res) {
        const chefsOptions = await Chef.findAll()

        const recipe = await LoadRecipeService.load('recipe',{
            where:{id:req.params.id}
        })

        if (!recipe) return res.send("Receita não encontrada")

        return res.render("Admin/recipes/edit", { chefsOptions, recipe, files:recipe.files })
    },
    async post(req, res) {
        let userRecipe = req.session.userId

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "")
                return res.send("Porfavor preencha todos os campos!")
        }

        if (req.files.length == 0) {
            return res.send('Porfavor pelo menos uma imagem!')
        }
        
        const recipe_id = await Recipe.create(req.body, userRecipe)
        console.log(recipe_id)

        const filesPromise = req.files.map(file => File.create({ ...file }))

        const filesResults = await Promise.all(filesPromise)
        const recipeFiles = filesResults.map(file => {
            const file_id = file.rows[0].id
            File.RecipeFiles({ recipe_id, file_id })
        })

        await Promise.all(recipeFiles)
        return res.redirect(`/admin/Receitas/${recipe_id}`)
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files" && key != "photos") {
                return res.send("porfavor preencha todos os campos")
            }
        }

        if (req.files.length != 0) {
            const oldFiles = await Recipe.files(req.body.id)

            const totalFiles = oldFiles.length + req.files.length

            if (totalFiles <= 6) {
                const recipe_id = req.body.id
                const newFilesPromise = req.files.map(file => File.create({ ...file }))

                const filesResults = await Promise.all(newFilesPromise)
                const recipeFiles = filesResults.map(file => {
                    const file_id = file.rows[0].id
                    File.RecipeFiles({ recipe_id, file_id })
                })

                await Promise.all(recipeFiles)
            }
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")

            const lastIndex = removedFiles.length - 1

            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(file => File.delete(file))

            await Promise.all(removedFilesPromise)
        }

        await Recipe.update(req.body)

        return res.redirect(`/admin/Receitas/${req.body.id}`)
    },
    delete(req, res) {
        const { id } = req.body

        return res.render("/admin/Receitas")
    }
}