const express = require('express')
const routes = express.Router()

const { onlyUsers, isLoggedRedirectToUsers, onlyAdmin, forAdmin } = require('../app/middlewares/session')


const chef = require('../app/controllers/ChefsController')
const multer = require('../app/middlewares/multer')

routes.get("/", chef.chefsAdmin)
routes.get("/criar", chef.chefsCreate)
routes.get("/:id", chef.chefAdmin)
routes.get("/:id/edit",onlyUsers,forAdmin, chef.chefAdmin_edit)
routes.post("/", multer.array("photos", 1),chef.post)
routes.put("/", multer.array("photos", 1),chef.put)
routes.delete("/", chef.delete)

module.exports = routes
