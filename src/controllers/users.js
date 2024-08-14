const express = require('express')
const router = express.Router()
const { User } = require('../models')
const bcrypt = require('bcrypt')

/* GET ROUTES */

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
  })
  res.status(200).json(users)
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

  res.status(201).json(user)
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