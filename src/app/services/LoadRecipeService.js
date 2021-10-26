const Recipe = require('../models/recipe')
const Chef = require('../models/chef')

async function getImages(recipeId){
    let files = await Recipe.files(recipeId)
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
    }))

    return files
}

async function format(recipe){
    const files = await getImages(recipe.id)
    recipe.files = files
    recipe.image = files[0]

    return recipe
}

const LoadService = {
   load(service, filter){
       this.filter = filter

       return this[service]()
   },
   async chef(){
       try {
           const chef = await Chef.findOne(this.filter)

           return format(chef)
       } catch (error) {
           console.error(error)
       }
   },
   async recipes(){
       try {
           const recipes = await Recipe.findAll(this.filter)

           const recipesPromise = recipes.map(format)

           return Promise.all(recipesPromise)   
       } catch (error) {
           console.error(error)
       }
   }
}

module.exports = LoadService