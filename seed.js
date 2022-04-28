const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/user')
const Recipe = require('./src/app/models/recipe')
const File = require('./src/app/models/file')
const Chef = require('./src/app/models/chef')
const { files } = require('./src/app/models/recipe')


let chefsIds = []
let usersIds = []
let filesIds = []
let recipeFiles = []
let totalRecipes = 10
let totalUsers = 5
let totalChefs = 5
let totalFiles = totalRecipes + totalChefs

async function createFiles() {
    const files = []

    while (files.length < totalFiles) {
        files.push({
            filename: faker.image.image(),
            path: `public/images/placeholder.png`,
        })
    }

    const filesPromise = files.map(file => File.create(file))
    
    filesIds = await Promise.all(filesPromise)
}

async function createChefs() {
    const chefs = []
     
    for (let i = 1; chefs.length < totalChefs; i++) {
        chefs.push({
            name: faker.name.findName(),
            file_id: i,
        })
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef))

    chefsIds = await Promise.all(chefsPromise)
}

async function createUsers() {
    const users = []

    const password = await hash('123', 5)

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.findName(),
            email: faker.internet.email(),
            is_admin: Math.round(Math.random()),
            password
        })
    }

    const usersPromise = users.map(user => User.create(user))
    usersIds = await Promise.all(usersPromise)
}

async function createRecipes() {
    let recipes = []

    while (recipes.length < totalRecipes) {
        recipes.push({
            chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            title: faker.commerce.productName(),
            ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 1)).split(" "),
            preparation: faker.lorem.paragraph(Math.ceil(Math.random() * 1)).split(" "),
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 5)),
        })
    }
    
    const recipesPromise = recipes.map(recipe => Recipe.create(recipe, recipe.user_id))
    recipesIds = await Promise.all(recipesPromise)
}

async function createrecipesFiles() {
    const recipesFiles = []
    
    for (let i = 1; recipesFiles.length < 10; i++) {
        recipesFiles.push({
            recipe_id: i,
            file_id: i + 5,
        })
    }

    const recipeFilesPromise = recipesFiles.map(file => File.RecipeFiles(file))
    recipeFiles = await Promise.all(recipeFilesPromise)  
}

async function init() {
    await createFiles(),
    await createChefs(),
    await createUsers(),
    await createRecipes(),
    await createrecipesFiles()
}
    
init()