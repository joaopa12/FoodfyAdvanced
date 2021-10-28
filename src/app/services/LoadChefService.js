const Recipe = require('../models/recipe')
const Chef = require('../models/chef')

async function getImages(chefId){
    let files = await Chef.files(chefId)
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
    }))

    return files
}

async function format(chef){
    const files = await getImages(chef.id)
    chef.files = files
    chef.image = files[0]

    return chef
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
   async chefs(){
       try {
           const chefs = await Chef.findAll(this.filter)

           const chefsPromise = chefs.map(format)

           return Promise.all(chefsPromise)   
       } catch (error) {
           console.error(error)
       }
   }
}

module.exports = LoadService