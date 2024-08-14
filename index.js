const express = require('express')
const app = express()
require('express-async-errors')

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/database')

const blogRouter = require('./src/controllers/blogs')
const userRouter = require('./src/controllers/users')
const loginRouter = require('./src/controllers/login')

app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()