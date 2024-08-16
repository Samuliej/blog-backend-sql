const express = require('express')
const router = express.Router()
const { Readlist } = require('../models')

router.post('/', async (req, res) => {
  const { user_id, blog_id } = req.body

  try {
    const readlistEntry = await Readlist.create({ userId: user_id, blogId: blog_id })
    res.status(201).json(readlistEntry)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router