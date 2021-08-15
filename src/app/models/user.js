const db = require('../../config/db')
const { hash } = require('bcryptjs')

module.exports = {
       async findOne(filters){
             let query = `SELECT * FROM users`

             Object.keys(filters).map(key => {
                 query = `${query} ${key}`

                 Object.keys(filters[key]).map(field => {
                     query = `${query} ${field} = '${filters[key][field]}'`
                 })
             })

             const results = await db.query(query)
             return results.rows[0]
       },
       async all(){
           return db.query(`SELECT * FROM users`)
       },
       async create(data, password){
           try{
              const query = `
              INSERT INTO users(
                   name,
                   email,
                   is_admin,
                   password
              ) VALUES ($1, $2, $3, $4)
              RETURNING id
              ` 

              const passwordHash = await hash(password, 10)

              const values = [
                  data.name,
                  data.email,
                  data.is_admin,
                  passwordHash
              ]

              const results = await db.query(query, values)

              return results.rows[0].id
           }catch(err){
              console.error(err)
           }
       },
       async find(id){
           return db.query(`SELECT users.* FROM users WHERE id = $1`, [id])
       },
       async update(id , fields){
        try{
            let query = "UPDATE users SET"

            Object.keys(fields).map((key, index, array) => {
                if((index + 1) < array.length){
                    query = `${query} ${key} = '${fields[key]}',`
                } else {
                    query = `${query} ${key} = '${fields[key]}'
                    WHERE id = ${id}
                    `
                }
            })

            await db.query(query)
            return
         }catch(err){
            console.error(err)
         }
       },
       async delete(id){
           return db.query(`DELETE FROM users WHERE id = $1`,[id])
       }
}