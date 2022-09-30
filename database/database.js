const Sequelize = require("sequelize")

const connection = new Sequelize('guiaperguntas', 'root', '270101',{
    host: "localhost",
    dialect: "mysql"
})



module.exports = connection