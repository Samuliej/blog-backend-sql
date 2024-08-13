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
  try {
    const blogs = await Blog.findAll()
    res.status(200).json(blogs)
  } catch (error) {
    res.status(404).json({ error: `Blogs not found: ${error}` })
  }
})

router.get('/:id', blogFinder, async (req, res) =>
  req.blog
    ? res.status(200).json(req.blog)
    : res.status(404).json({ error: `Something went wrong finding the blog` }))

/* POST ROUTES */

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json(blog)
  } catch (error) {
    res.status(500).json({ error: `Something went wrong creating the blog: ${error}` })
  }
})

/* PUT ROUTES */

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    try {
      let likedBlog = req.blog
      likedBlog.likes++
      await likedBlog.save()
      res.status(200).json({ likes: likedBlog.likes })
    } catch (error) {
      res.status(500).json({ error: `Something went wrong updating the blog: ${error}` })
    }
  }
})

/* DELETE ROUTES */

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
      await Blog.destroy({ where: { id: id } })
      res.status(200).json({ message: `Blog ${blogToDelete.title} deleted succesfully.` })
  } else {
    res.status(500).json({ error: `Something went wrong deleting the blog: ${error}` })
  }
})

module.exports = router