const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all(){
        return db.query(`SELECT * FROM recipes`)
    },
    create(data, user_id){
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
               data.chef, 
               user_id,
               data.title,
               data.ingredients,
               data.preparation,
               data.textarea,
               date(Date.now()).iso,
        ]

        return db.query(query , values)
    },
    async find(id){
        return db.query(`SELECT * FROM recipes WHERE id = $1`, [id])
    },
    chefsOption(){
        return db.query(`SELECT name, id FROM chefs`)
    },
    update(data){
        const query = `
        UPDATE recipes SET 
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
            WHERE id = $6
     `
     const values = [
            data.chef, 
            data.title,
            data.ingredients,
            data.preparation,
            data.textarea,
            data.id
     ] 

     return db.query(query,values)
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
            const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
 
            return results
        } catch(err){
            console.log(err)
        }
     },
     async RecipeFiles(id){
        try {
            const results = await db.query(`SELECT * 
            FROM files
            LEFT JOIN recipe_files
            ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = $1`, [id])
            
            return results
        } catch(err){
            console.log(err)
        }
     }
}