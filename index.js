require('dotenv').config()
const blogRouter = require('./src/routes/blogs')
const express = require('express')
const app = express()

app.use(express.json())
app.use('/api/blogs', blogRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})