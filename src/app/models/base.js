const db = require('../../config/db')

function find(filters, table){
     let query = `SELECT * FROM ${table}`
     
     if(filters){
         Object.keys(filters).map(key => {

            query += ` ${key}`

            Object.keys(filters[key]).map(field => {
               query += ` ${field} = '${filters[key][field]}'`
            })
         })
     }

     return db.query(query)
}

const Base = {
     init({ table }){
        if(!table) throw new Error('Invalid Params')

        this.table = table

        return this
     },

}

module.exports = Base