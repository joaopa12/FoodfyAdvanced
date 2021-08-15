const Chef = require("../models/chef")
const File = require("../models/file")
const Recipe = require("../models/recipe")

module.exports = {
    async home(req, res) {
        let { filter, page, limit } = req.query
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        const params = {
            filter,
            limit,
            offset
        }

        results = await Recipe.paginate(params)
        const recipes = results.rows

        const recipesPromise = recipes.map(async recipe => {
            results = await Recipe.RecipeFiles(recipe.id)

            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            recipe.image = files[0]

            return recipe
        })

        const EachRecipe = await Promise.all(recipesPromise)

        return res.render("Site/home/home", { chefsOptions, recipes:EachRecipe , filter })
    },
    about(req, res) {
        return res.render("Site/home/sobre")
    },  
    async recipes(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        const params = {
            filter,
            page,
            limit,
            offset
        }

        results = await Recipe.paginate(params)
        const recipes = results.rows

        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }
        
        const recipesPromise = recipes.map(async recipe => {
            results = await Recipe.RecipeFiles(recipe.id)

            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            recipe.image = files[0]

            return recipe
        })

        const EachRecipe = await Promise.all(recipesPromise)

        return res.render("Site/recipes/receitas", { chefsOptions, recipes:EachRecipe, pagination, filter })
    },
    async results(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        const params = {
            filter,
            page,
            limit,
            offset,
        }

        results = await Recipe.paginateResults(params)
        const recipes = results.rows

        const recipesPromise = recipes.map(async recipe => {
            results = await Recipe.RecipeFiles(recipe.id)

            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            recipe.image = files[0]

            return recipe
        })

        const EachRecipe = await Promise.all(recipesPromise)

        if (recipes == 0) {
            const pagination = { page }
            return res.render("Site/search/index", { chefsOptions, recipes, pagination, filter })

        } else {
            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page,
            }
            return res.render("Site/search/index", { chefsOptions, recipes:EachRecipe, pagination, filter })
        }

    },
    async recipe(req, res) {
        const id = req.params.id;

        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows

        results = await Recipe.find(id)
        const recipe = results.rows[0]

        results = await Recipe.RecipeFiles(recipe.id)

        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("Site/recipes/receita", { chefsOptions, recipe, files })
    },
    async chefs(req, res) {
        let results = await Chef.all()
        const Chefs = results.rows

        const chefsPromise = Chefs.map(async chef => {
            results = await Chef.Getfiles(chef.id)

            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            chef.image = files[0]
            return chef
        })
 
        const EachChef = await Promise.all(chefsPromise)
 
        return res.render("Site/chefs/index", { Chefs: EachChef })
    } 
}