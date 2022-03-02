const Sequelize = require('sequelize');
const sequelize = require('./data_index');

const UserSchema = sequelize.define('User', {
  first_name: {
    type: Sequelize.STRING
  },
  last_name: {
    type: Sequelize.STRING
  },
  middle_name: {
    type: Sequelize.STRING
  },
  phone_numbers: {
    type: Sequelize.STRING
  },
  picture: {
    type: Sequelize.STRING
  },
  additionaltext: {
    type: Sequelize.TEXT
  }
});

module.exports = UserSchema;