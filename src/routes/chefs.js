const express = require('express')
const routes = express.Router()

const { onlyUsers, isLoggedRedirectToUsers, onlyAdmin, forAdmin } = require('../app/middlewares/session')

const ChefController = require('../app/controllers/ChefsController')
const multer = require('../app/middlewares/multer')

const Validator = require('../app/validators/keyOrFiles')

routes.get("/", ChefController.chefsAdmin)
routes.get("/criar", ChefController.chefsCreate)
routes.get("/:id", ChefController.chefAdmin)
routes.get("/:id/edit",onlyUsers,forAdmin, ChefController.chefAdmin_edit)
routes.post("/", multer.array("photos", 1), Validator.post, ChefController.post)
routes.put("/", multer.array("photos", 1),Validator.put,ChefController.put)
routes.delete("/", ChefController.delete)

module.exports = routes
