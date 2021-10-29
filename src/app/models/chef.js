const db = require('../../config/db')
const { date } = require('../../lib/utils')

const Base = require('./base')

Base.init({ table: 'chefs'})

module.exports = {
    ...Base,
    async findrecipes() {
        try {
            const results = await db.query(`
            SELECT chefs.*, COUNT (recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY total_recipes DESC   
            `)

            return results.rows
            
        } catch (error) {
            console.error(error)
        }
    },
    async files(id) {
        try {
            const results = await db.query(`SELECT * 
            FROM files 
            LEFT JOIN chefs
            ON (files.id = chefs.file_id)
            WHERE chefs.id = $1`, [id])

            return results.rows
        } catch (err) {
            console.log(err)
        }
    }
}