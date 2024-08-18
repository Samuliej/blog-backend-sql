const { SECRET } = require('../utils/config')
const jwt = require('jsonwebtoken')
const { Session } = require('../src/models')

const checkActiveSession = async (token) => {
  const activeSession = await Session.findOne({
    where: { token: token },
  })
  return activeSession
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)

      const activeSession = await checkActiveSession(token)
      if (!activeSession) {
        return res.status(401).json({ error: 'No active session. Please login again' })
      }

      req.decodedToken = jwt.verify(token, SECRET)
      req.token = token
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = tokenExtractor