const db = require('../../config/db')
const { hash } = require('bcryptjs')

const Base = require('./base')

Base.init({ table:'users' })

module.exports = {
       ...Base
}