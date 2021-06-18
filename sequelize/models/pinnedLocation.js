const { Model, DataTypes } = require("sequelize")
const { database } = require("../connection")

class PinnedLocation extends Model { }

PinnedLocation.init(
    {
        userId:{
            primaryKey: true,
            allowNull: false,
            type: DataTypes.INTEGER
        },
        locationId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        locationName: {
            allowNull: false,
            type: DataTypes.STRING
        },
        radius: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        latitude: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        longitude: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    },
    {
        modelName: "pinnedLocation",
        sequelize: database
    })

module.exports = { PinnedLocation }
