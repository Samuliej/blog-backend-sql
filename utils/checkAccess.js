const { Session } = require('../src/models')

const checkAccess = async (req, res, user) => {
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return false
  }
  if (user.disabled) {
    res.status(401).json({ error: 'Your account is disabled, please contact a moderator' })
    return false
  }
  if (user.tokenDisabled) {
    res.status(401).json({ error: 'Token expired, please login again' })
    return false
  }

  const activeSession = await Session.findOne({
    where: { userId: user.id, token: user.token },
  })

  if (!activeSession) {
    res.status(401).json({ error: 'No active session. Please login again' })
    return false
  }
  // Return true if all pass
  return true
}

module.exports = checkAccess