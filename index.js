const express = require('express')
const app = express()
require('express-async-errors')

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/database')

const blogRouter = require('./src/controllers/blogs')
const userRouter = require('./src/controllers/users')
const { loginRouter } = require('./src/controllers/login')
const logoutRouter = require('./src/controllers/logout')
const authorRouter = require('./src/controllers/authors')
const readlistRouter = require('./src/controllers/readList')
const { Session } = require('./src/models')

app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readlistRouter)

const start = async () => {
  await Session.destroy({
    where: {},
    truncate: true
  })
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()