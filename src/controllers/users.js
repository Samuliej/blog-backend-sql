const express = require('express')
const router = express.Router()
const { User, Blog } = require('../models')
const bcrypt = require('bcrypt')

/* GET ROUTES */

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.status(200).json(users)
})

router.get('/:username', async (req, res) => {
  console.log('username', req.params.username)
  const user = await User.findOne({
    where: { username: req.params.username },
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })

  res.status(200).json(user)
})

/* POST ROUTES */

router.post('/', async (req, res) => {
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