const Chef = require("../models/chef")
const Recipe = require("../models/recipe")

const LoadRecipeService = require('../services/LoadRecipeService')
const { format } = require('../services/LoadRecipeService')

module.exports = {
    async home(req, res) {
        let { filter, page, limit } = req.query
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const chefsOptions = await Chef.findAll()

        const params = {
            filter,
            limit,
            offset
        }

        const recipesParams = await Recipe.paginate(params)
        const recipesParamsFormat = recipesParams.map(recipe => LoadRecipeService.format(recipe))

        const recipes = await Promise.all(recipesParamsFormat)

        return res.render("Site/home/home", { chefsOptions, recipes , filter })
    },
    about(req, res) {
        return res.render("Site/home/sobre")
    },  
    async recipes(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const chefsOptions = await Chef.findAll()

        const params = {
            filter,
            page,
            limit,
            offset
        }

        const recipes = await Recipe.paginate(params)

        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }
        
        const recipesPromise = recipes.map(format)

        const EachRecipe = await Promise.all(recipesPromise)

        return res.render("Site/recipes/receitas", { chefsOptions, recipes:EachRecipe, pagination, filter })
    },
    async results(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const chefsOptions = await Chef.findAll()

        const params = {
            filter,
            page,
            limit,
            offset,
        }

        const recipesParams = await Recipe.paginateResults(params)
        const recipesParamsFormat = recipesParams.map(recipe => LoadRecipeService.format(recipe))

        const recipes = await Promise.all(recipesParamsFormat)

        if (recipes == 0) {
            const pagination = { page }
            return res.render("Site/search/index", { chefsOptions, recipes, pagination, filter })

        } else {
            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page,
            }
            return res.render("Site/search/index", { chefsOptions, recipes, pagination, filter })
        }

    },
    async recipe(req, res) {
        const id = req.params.id;

        const chefsOptions = await Chef.findAll()

        const recipe = await Recipe.findOne(id)

        const filesRecipe = await Recipe.files(recipe.id)

        const files = filesRecipe.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("Site/recipes/receita", { chefsOptions, recipe, files })
    },
    async chefs(req, res) {
        const ChefsFinds = await Chef.findrecipes()

        const chefsPromise = ChefsFinds.map(async chef => {
            const chefsfiles = await Chef.files(chef.id)

            const files = chefsfiles.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            chef.image = files[0]
            return chef
        })
 
        const Chefs = await Promise.all(chefsPromise)
 
        return res.render("Site/chefs/index", { Chefs })
    } 
}