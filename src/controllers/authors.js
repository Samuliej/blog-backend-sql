const express = require('express')
const router = express.Router()
const { Blog } = require('../models')
const { Op, fn, col } = require('sequelize')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where.author = { [Op.iLike]: `%${req.query.search}%` }
  }

  const authors = await Blog.findAll({
    attributes: [
      'author',
      [fn('SUM', col('likes')), 'likes'],
      [fn('COUNT', col('id')), 'blogs']
    ],
    where,
    group: ['author'],
    order: [
      ['likes', 'DESC']
    ]
  })

  res.status(200).json(authors)
})

module.exports = router