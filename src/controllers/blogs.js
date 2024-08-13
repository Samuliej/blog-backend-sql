const express = require('express')
const router = express.Router()
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  const id = req.params.id
  req.blog = await Blog.findByPk(id)
  if (req.blog)
    next()
  else return res.status(404).json({ error: `Did not find blog with id: ${id}` })
}

/* GET ROUTES */

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.status(200).json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog)
    res.status(200).json(req.blog)
})

/* POST ROUTES */

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  res.status(201).json(blog)
})

/* PUT ROUTES */

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    let likedBlog = req.blog
    likedBlog.likes++
    await likedBlog.save()
    res.status(200).json({ likes: likedBlog.likes })
  }
})

/* DELETE ROUTES */

router.delete('/:id', blogFinder, async (req, res) => {
  const id = req.params.id
  if (req.blog) {
    await Blog.destroy({ where: { id: id } })
    res.status(200).json({ message: `Blog ${req.blog.title} deleted succesfully.` })
  }
})

module.exports = router