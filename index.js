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
const { sequelize } = require('./utils/database')

app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readlistRouter)

const clearSessionsOnRestart = async () => {
  try {
    const tableExists = await sequelize.getQueryInterface().showAllSchemas()
      .then((tableList) => {
        return tableList.some((table) => table.tableName === 'Sessions')
      })

    if (tableExists) {
      await Session.destroy({
        where: {},
        truncate: true
      })
      console.log('All sessions cleared')
    } else {
      console.log('Session table does not exist, skipping session clearing')
    }
  } catch (error) {
    console.error('Error clearing sessions on server restart:', error)
  }
}

const start = async () => {
  clearSessionsOnRestart()
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()