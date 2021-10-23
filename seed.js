const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/user')
const Recipe = require('./src/app/models/recipe')
const File = require('./src/app/models/file')
const user = require('./src/app/models/user')

let usersIds = []
let totalProducts = 10
let totalUsers = 3

async function createUsers(){
    const users = []
    const password = await hash('123', 5)

    while(users.length < totalUsers){
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

async function init(){
    await createUsers()
}

init()