const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/user')
const Recipe = require('./src/app/models/recipe')
const File = require('./src/app/models/file')
const Chef = require('./src/app/models/chef')


let chefsIds = []
let usersIds = []
let filesIds = []
let recipesIds = []
let totalRecipes = 10
let totalUsers = 5
let totalChefs = 5

async function createChefs() {
    let files = []

    while (files.length < 5) {
        files.push({
            name: faker.name.title(),
            path: `public/images/placeholder.png`,
        })
    }

    const filesPromise = files.map(file => File.create(file))

    filesIds = await Promise.all(filesPromise)

    const chefs = []

    while (chefs.length < totalChefs) {
        chefs.push({
            name: faker.name.title(),
            file_id: filesIds[Math.floor(Math.random() * totalChefs)],
        })
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef))

    chefsIds = await Promise.all(chefsPromise)
}

function randomadmin(){
    const number = Math.random() * 10
    if(number > 5){
        return true
    } else {
        return false
    }
}
async function createUsers() {
    const users = []

    const password = await hash('123', 5)

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.title(),
            email: faker.internet.email(),
            is_admin: randomadmin(),
            password
        })
    }

    console.log(users)

    const usersPromise = users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromise)
}

async function createRecipes() {
    let recipes = []

    while (recipes.length < totalRecipes) {
        recipes.push({
            chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            title: faker.name.title(),
            ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            preparation: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
        })
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))

    recipesIds = await Promise.all(recipesPromise)

    let files = []

    while (files.length < totalRecipes) {
        files.push({
            name: faker.name.title(),
            path: `public/images/placeholder.png`,
        })
    }

    const filesPromise = files.map(file => File.create(file))

    filesIds = await Promise.all(filesPromise)

    while (recipe_file.length < totalRecipes) {
        recipe_file.push({
            recipe_id: recipesIds[Math.floor(Math.random() * totalRecipes)],
            file_id: filesIds[Math.floor(Math.random() * totalRecipes)]
        })
    }
}



async function init() {
    await createUsers()
    await createRecipes()
    await createChefs()
}

init()