const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')

const { SECRET } = require('../../utils/config')
const { User, Session } = require('../models')

router.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  if (!user) {
    return res.status(404).json({ error: 'username or password incorrect' })
  }

  if (user.userDisabled) {
    return res.status(401).json({ error: 'Your account is disabled, please contact a moderator' })
  }

  const passwordCorrect = await bcrypt.compare(req.body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  try {
    const oldSession = await Session.findOne({
      where: { userId: user.id },
      attributes: ['id']
    })
    if (oldSession) {
      // Invalidate old sessions
      await Session.destroy({
        where: {
          userId: user.id
        }
      })
    }
  } catch (error) {
    console.error('Error finding or destroying session:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }

  try {
  const token = jwt.sign(userForToken, SECRET)

  user.token = token
  if (user.tokenDisabled)
    user.tokenDisabled = false
  await user.save()

  await Session.create({
    userId: user.id,
    token: token
  })

  res.status(200).send({ token, username: user.username, name: user.name })
  } catch (error) {
    console.log('vituiks meni', error)
  }
})

module.exports = { loginRouter: router }