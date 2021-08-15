const express = require('express')
const routes = express.Router()

const { RecipeOwner } = require('../app/middlewares/session')

const multer = require('../app/middlewares/multer')
const recipes = require('../app/controllers/RecipesController')

routes.get("/", recipes.index)
routes.get("/criar", recipes.create)
routes.get("/:id", recipes.recipe_admin)
routes.get("/:id/edit", RecipeOwner, recipes.recipe_admin_edit)
routes.post("/", multer.array("photos", 5),recipes.post)
routes.put("/", multer.array("photos", 5),recipes.put)
routes.delete("/", recipes.delete)

module.exports = routes