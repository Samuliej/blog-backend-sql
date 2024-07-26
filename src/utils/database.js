require('dotenv').config()
const { Sequelize } = require('sequelize')

const dbUrl = process.env.DATABASE_URL
const sequelize = new Sequelize(dbUrl)

module.exports = sequelize