const db = require('../../config/db')

const Base = require('./base')

Base.init({ table:'recipes'})

module.exports = {
    ...Base,
    async paginate(params){
        try{
            const { filter , limit, offset } = params
            
            let query = "",
                filterQuery = "",
                totalQuery = `(
                    SELECT count(*) FROM recipes
                ) AS total`

            if(filter){
                filterQuery = `${query}
                WHERE recipes.title ILIKE '%${filter}%'
                
                `
                totalQuery = `(
                    SELECT count(*) FROM recipes
                    ${filterQuery}
                ) as total`
            }
            
            query = `
            SELECT recipes.*,${totalQuery}
            FROM recipes
            
            ${filterQuery}
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2 
            
            `
            
            const results = await db.query(query, [limit,offset])

            return results
        }
        catch(err){
            console.error(err)
        }
            
    },
    async paginateResults(params){
        try{
            const { filter , limit, offset } = params
            
            let query = "",
                filterQuery = "",
                totalQuery = `(
                    SELECT count(*) FROM recipes
                ) AS total`

            if(filter){
                filterQuery = `${query}
                WHERE recipes.title ILIKE '%${filter}%'
                
                `
                totalQuery = `(
                    SELECT count(*) FROM recipes
                    ${filterQuery}
                ) as total`
            }
            
            query = `
            SELECT recipes.*,${totalQuery}
            FROM recipes
            
            ${filterQuery}
            ORDER BY updated_at DESC
            LIMIT $1 OFFSET $2 
            
            `
            
            const results = await db.query(query, [limit,offset])

            return results
        }
        catch(err){
            console.error(err)
        }
            
    },
     async files(id){
        try {
            const results = await db.query(`SELECT * 
            FROM files
            LEFT JOIN recipe_files
            ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = $1`, [id])
            
            return results.rows
        } catch(err){
            console.log(err)
        }
     }
}