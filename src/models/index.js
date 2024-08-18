const Blog = require('./blog')
const User = require('./user')
const Readlist = require('./readList')
const Session = require('./session')

User.hasMany(Session)
Session.belongsTo(User)

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readlist, as: 'userReadlist' })
Blog.belongsToMany(User, { through: Readlist, as: 'blogReaders' })

User.hasMany(Readlist)
Readlist.belongsTo(User)

Blog.hasMany(Readlist)
Readlist.belongsTo(Blog)

module.exports = {
  Blog, User, Readlist, Session
}