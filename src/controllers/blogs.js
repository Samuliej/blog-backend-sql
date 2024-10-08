const express = require('express')
const router = express.Router()
const { Blog, User } = require('../models')
const tokenExtractor = require('../../utils/tokenExtractor')
const { Op } = require('sequelize')
const checkAccess = require('../../utils/checkAccess')

const blogFinder = async (req, res, next) => {
  const id = req.params.id
  req.blog = await Blog.findByPk(id, {
    include: {
      model: User,
      attributes: ['name']
    }
  })
  if (req.blog)
    next()
  else return res.status(404).json({ error: `Did not find blog with id: ${id}` })
}

/* GET ROUTES */

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  res.status(200).json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) res.status(200).json(req.blog)
})

/* POST ROUTES */

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const hasAccess = await checkAccess(req, res, user)
  if (hasAccess) {
    const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
    res.status(201).json(blog)
  }
})

/* PUT ROUTES */

router.put('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (checkAccess(req, res, user)) {
    if (req.blog) {
      let likedBlog = req.blog
      likedBlog.likes++
      await likedBlog.save()
      res.status(200).json({ likes: likedBlog.likes })
    }
  }
})

/* DELETE ROUTES */

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const id = req.params.id
  const user = await User.findByPk(req.decodedToken.id)
  if (checkAccess(req, res, user)) {
    if (req.blog && req.blog.userId === user.id) {
      await Blog.destroy({ where: { id: id } })
      res.status(200).json({ message: `Blog ${req.blog.title} deleted succesfully.` })
    } else {
      res.status(500).json({ error: 'Not authorized to delete this blog' })
    }
  }
})

module.exports = router