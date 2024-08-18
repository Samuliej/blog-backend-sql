const express = require('express')
const router = express.Router()
const { User, Blog, Readlist } = require('../models')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')

/* GET ROUTES */

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      include: [
        {
          model: Blog,
          attributes: { exclude: ['userId'] }
        },
        {
          model: Readlist,
          include: [
            {
              model: Blog,
              attributes: ['title', 'author']
            }
          ]
        }
      ]
    })
    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  let where = {}
  if (req.query.read) {
    where = {
      read: {
        [Op.eq]: req.query.read,
      }
    }
  }

  const user = await User.findByPk(id, {
    attributes: { exclude: ['passwordHash'] },
    include:
    {
      model: Readlist,
      where,
      required: false,
      attributes: ['id', 'read'],
      include: [
        {
          model: Blog,
          attributes: ['id', 'author', 'url', 'title', 'likes', 'year']
        }
      ]
    }
  })

  res.status(200).json(user)
})

/* POST ROUTES */

router.post('/', async (req, res) => {
  try {
  const { username, name, password } = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    username,
    passwordHash,
    name
  })

  const userWithoutHash = user.toJSON()
  delete userWithoutHash.passwordHash

  res.status(201).json(userWithoutHash)
} catch (error) {
  console.log(error)
}
})

/* PUT ROUTES */

router.put('/:username', async (req, res) => {
  let userToModify = await User.findOne({
    where: { username: req.params.username },
    attributes: { exclude: ['passwordHash'] }
  })
  userToModify.username = req.body.username
  await userToModify.save()

  res.status(200).json(userToModify)
})

module.exports = router