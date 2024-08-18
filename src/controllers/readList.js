const express = require('express')
const router = express.Router()
const { Readlist, User } = require('../models')
const tokenExtractor = require('../../utils/tokenExtractor')
const checkAccess = require('../../utils/checkAccess')

router.post('/', async (req, res) => {
  const { user_id, blog_id } = req.body

  try {
    const readlistEntry = await Readlist.create({ userId: user_id, blogId: blog_id })
    res.status(201).json(readlistEntry)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const { read } = req.body
  const readListId = req.params.id
  console.log('readList iidee', readListId)
  const userId = req.decodedToken.id
  const user = await User.findByPk(req.decodedToken.id)

  if (checkAccess(req, res, user)) {
    try {
      const readList = await Readlist.findByPk(readListId)
      if (!readList) {
        return res.status(404).json({ error: 'Readlist not found' })
      }
      if (readList.userId === userId) {
        readList.read = read
        await readList.save()
        res.status(200).json(readList)
      } else {
        res.status(401).json({ message: 'You are not authorized to modify this item.' })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: error.message })
    }
  }
})

module.exports = router