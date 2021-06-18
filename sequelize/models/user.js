const { Model, DataTypes } = require("sequelize")
const { FollowedArtist } = require("./followedArtist")
const { PinnedLocation } = require("./pinnedLocation")
const { database } = require("../connection")

class User extends Model { }

User.init(
    {
        userEmail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
            allowNull: false,
        },
        userRadius: {
            allowNull: true,
            defaultValue: 100,
            type: DataTypes.INTEGER
        },
        userPostalCode: {
            allowNull: true,
            type: DataTypes.STRING
        },
        userLatitude: {
            allowNull: true,
            type: DataTypes.DOUBLE
        },
        userLongitude: {
            allowNull: true,
            type: DataTypes.DOUBLE
        }
    },
    {
        modelName: "user",
        sequelize: database
    }
)

User.hasMany(FollowedArtist, {foreignKey: "userId"})
User.hasMany(PinnedLocation, {foreignKey: "userId"})
module.exports = { User }