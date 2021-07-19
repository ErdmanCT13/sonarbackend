const { Model, DataTypes } = require("sequelize")
const { database } = require("../connection")

class PinnedLocation extends Model { }

PinnedLocation.init(
    {
        userId:{
            allowNull: false,
            type: DataTypes.STRING
        },
        locationId: {
            primaryKey: true,
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
            type: DataTypes.DOUBLE
        },
        longitude: {
            allowNull: false,
            type: DataTypes.DOUBLE
        }
    },
    {
        modelName: "pinnedLocation",
        sequelize: database
    })

module.exports = { PinnedLocation }
