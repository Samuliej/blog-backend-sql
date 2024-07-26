require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const printBlogs = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT
    })
    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
  } catch (error) {
    console.log(`Something went wrong printing the blogs: ${error}`)
  }
}

printBlogs()