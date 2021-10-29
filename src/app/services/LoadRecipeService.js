const Recipe = require('../models/recipe')

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
   async recipe(){
       try {
           const recipe = await Recipe.findOne(this.filter)
           return format(recipe)
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
   },
   format
}

module.exports = LoadService