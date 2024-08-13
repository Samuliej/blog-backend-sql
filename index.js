const express = require('express')
const app = express()
require('express-async-errors')

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/database')

const blogRouter = require('./src/controllers/blogs')

app.use(express.json())
app.use('/api/blogs', blogRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()