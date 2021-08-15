const Recipe = require('../models/recipe')

function onlyUsers(req,res, next){
    if(!req.session.userId){
        return res.redirect('/admin/users/login')
    }
    next()
}

function forAdmin(req,res, next){
    if(req.session.isAdmin == false){

        return res.redirect('/admin/users/profile')
        
    }
    next()
}

async function onlyAdmin(req,res, next){
    if(!req.session.isAdmin){

        req.session.error = "Somente para administradores!"
        console.log('passou')
        
        return res.redirect('/admin/users/profile')
    }
    next()
}

function isLoggedRedirectToUsers(req, res, next){
    if(req.session.userId) {
        if(req.session.isAdmin){   
            return res.redirect('/admin/users')
        } else {
            return res.redirect('/admin/users/profile')
        }
    }

    next()
}

async function RecipeOwner(req,res, next){
     let results = await Recipe.find(req.params.id)
     const recipe = results.rows[0]
    
    if(req.session.userId !== recipe.user_id && req.session.isAdmin == false){
        return res.redirect('/admin/users/profile')
    }

    next()
}

function forAdmin(req,res, next){
    if(req.session.isAdmin == false){
        return res.redirect('/admin/users/profile')
    }
    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers,
    onlyAdmin,
    forAdmin,
    RecipeOwner
}