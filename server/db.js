var { dbConfig } = require('./utility.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.dbName, dbConfig.userName, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
    logging: false, 
});

const registrant = sequelize.define('registrant', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    birthDate: Sequelize.DATEONLY,
    gender: Sequelize.TINYINT,
    mobileNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
}, {sequelize, modelName: 'registrant'});

module.exports = {
    sequelize: sequelize,
    registrant: registrant
}
