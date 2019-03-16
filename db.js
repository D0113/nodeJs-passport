const sequelize = require('sequelize');

const db = new sequelize({
    database: 'myDB',
    username: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
        ssl: false,

    },
    // name table not add s in the end
    define: {
        frezzeTableName: true
    },
    logging: false
});

db.authenticate()
.then(() => console.log('ket noi thanh cong'))
.catch(err => console.log(err.message));

module.exports = db;