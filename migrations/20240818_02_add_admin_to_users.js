const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'admin', {
      type: DataTypes.BOOLEAN,
      default: false
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'admin')
  }
}