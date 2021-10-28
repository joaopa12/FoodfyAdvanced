async function post(req,res,next){
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.render("Admin/chefs/createChef",{
                error:'Por favor, coloque o nome do chef!',
                user:req.body
            })
        }
    }
    if (!req.files || req.files.length == 0) {
        return res.render("Admin/chefs/createChef",{
            error:'Por favor, coloque uma imagem!',
            user:req.body
        })
    }

    next()
}

async function put(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
            return res.send("porfavor preencha todos os campos")
        }
    }
    
    next()   
}

module.exports = {
    post,
    put
}