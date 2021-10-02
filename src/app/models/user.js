const db = require('../../config/db')
const { hash } = require('bcryptjs')

const Base = require('./base')

Base.init({ table:'users' })

module.exports = {
       ...Base,
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
}