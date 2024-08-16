const Blog = require('./blog')
const User = require('./user')
const Readlist = require('./readList')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readlist })
Blog.belongsToMany(User, { through: Readlist })

module.exports = {
  Blog, User, Readlist
}