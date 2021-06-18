const { Model, DataTypes } = require("sequelize")
const { database } = require("../connection")

class FollowedArtist extends Model { }

FollowedArtist.init(
    {
        artistId: {
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            type: DataTypes.INTEGER
        },
        artistName: {
            allowNull: false,
            type: DataTypes.STRING
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    },
    {
        modelName: "followedArtist",
        sequelize: database
    })

module.exports = { FollowedArtist }
