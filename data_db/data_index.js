const Sequelize = require('sequelize');
const mysql = require('mysql2/promise');

const DB_NAME = 'people_search';
const USER_NAME = 'root';
const PASSWORD = 'root';

const sequelize = new Sequelize(
    DB_NAME,
    process.env.RDS_USERNAME || USER_NAME,
    process.env.RDS_PASSWORD || PASSWORD,
    {
        host: process.env.RDS_HOSTNAME || 'localhost',
        port: process.env.RDS_PORT || 3306,
        dialect: 'mysql'
    }
);

(async function() {
  const connection = await mysql.createConnection({
    host: process.env.RDS_HOSTNAME || 'localhost',
    port: process.env.RDS_PORT || 3306,
    user: process.env.RDS_USERNAME || USER_NAME,
    password: process.env.RDS_PASSWORD || PASSWORD});
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await sequelize.sync();
})();

module.exports = sequelize;