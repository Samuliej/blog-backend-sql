const router = require('express').Router()
const { User, Session } = require('../models')
const tokenExtractor = require('../../utils/tokenExtractor')

router.post('/', tokenExtractor, async (req, res) => {
  const token = req.token
  const activeSession = await Session.findOne({ where: { token: token } })

  if (!activeSession) {
    return res.status(500).json({ error: 'User not currently logged in' })
  }

  const user = await User.findByPk(activeSession.userId)

  await Session.destroy({
    where: {
      user_id: user.id
    }
  })

  user.tokenDisabled = true
  await user.save()

  res.status(200).json({ message: 'Logged out succesfully' })
})

module.exports = router