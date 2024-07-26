const express = require('express')
const router = express.Router()
const Blog = require('../models/blog')

/* GET ROUTES */

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    res.status(200).json(blogs)
  } catch (error) {
    res.status(404).json({ error: `Blogs not found: ${error}` })
  }
})



/* POST ROUTES */

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json(blog)
  } catch (error) {
    res.status(500).json({ error: `Something went wrong creating the blog: ${error}` })
  }
})

/* DELETE ROUTES */

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const blogToDelete = await Blog.findByPk(id)
    if (blogToDelete)
      await Blog.destroy({ where: { id: id } })
    else return res.status(404).json({ error: `Did not find blog with id: ${id}` })
    res.status(200).json({ message: `Blog ${blogToDelete.title} deleted succesfully.` })
  } catch (error) {
    res.status(500).json({ error: `Something went wrong deleting the blog: ${error}` })
  }
})

module.exports = router