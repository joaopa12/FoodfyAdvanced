const db = require('../../config/db')
const { date } = require('../../lib/utils')

const Base = require('./base')

Base.init({ table:'recipes'})

module.exports = {
    ...Base,
    async create(data, user_id){
        const query = `
           INSERT INTO recipes(
               chef_id,
               user_id,
               title,
               ingredients,
               preparation,
               information,
               created_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id
        `
        const values = [
               data.chef_id, 
               user_id,
               data.title,
               data.ingredients,
               data.preparation,
               data.information,
               date(Date.now()).iso
        ]

        const results = await db.query(query , values)
   
        return results.rows[0].id
    },
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

            return results.rows
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
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2 
            
            `
            
            const results = await db.query(query, [limit,offset])
            
            return results.rows
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