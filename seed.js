const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/user')
const Recipe = require('./src/app/models/recipe')
const File = require('./src/app/models/file')
const Chef = require('./src/app/models/chef')

let usersIds = []
let totalRecipes = 10
let totalUsers = 3
let totalChefs = 4

async function createUsers() {
    const users = []
    const password = await hash('123', 5)

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.title(),
            email: faker.name.email(),
            is_admin: Faker.random.array_element([true, false]),
            password
        })
    }

    const usersPromise = users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromise)
}

async function createChefs() {
    let chefs = []

    while (recipes.length < totalRecipes) {
        recipes.push({
            chef_id:  Math.ceil(Math.random() * 3),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            title:faker.name.title(),
            ingredients:faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            preparation:faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            information:faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
        })
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))

    recipesIds = await Promise.all(recipesPromise)

    let files = []

    while(files.length < 8){
       files.push({
           name:faker.image.image(),
           path:`public/images/placeholder.png`,
           product_id: productsIds[Math.floor(Math.random() * totalProducts)]
       })
    }

    const filesPromise = files.map(file => File.create(file))

    await Promise.all(filesPromise)
}

async function createRecipes() {
    let recipes = []

    while (recipes.length < totalRecipes) {
        recipes.push({
            chef_id:  Math.ceil(Math.random() * 3),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            title:faker.name.title(),
            ingredients:faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            preparation:faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            information:faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
        })
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))

    recipesIds = await Promise.all(recipesPromise)

    let files = []

    while(files.length < 8){
       files.push({
           name:faker.image.image(),
           path:`public/images/placeholder.png`,
           product_id: productsIds[Math.floor(Math.random() * totalProducts)]
       })
    }

    const filesPromise = files.map(file => File.create(file))

    await Promise.all(filesPromise)
}

async function init() {
    await createUsers()
}

init()