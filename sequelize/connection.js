const { Sequelize } = require("sequelize");

exports.database = new Sequelize("bandtrackerDB", "admin", "UWpassword2", {
    host: "bandtrackertestdb.ceu97s112aac.us-east-2.rds.amazonaws.com",
    dialect: "mysql"
})

