const { Model, DataTypes } = require("sequelize")
const { database } = require("../connection")

class FollowedArtist extends Model { }

FollowedArtist.init(
    {
        followedArtistId: {
            autoIncrement: true,
            allowNull: false,
            unique: true,
            type: DataTypes.INTEGER
        },
        artistName: {
            primaryKey: true,
            allowNull: false,
            type: DataTypes.STRING
        },
        userId: {
            primaryKey: true,
            allowNull: false,
            type: DataTypes.STRING
        },  
        spotifyId: {
            allowNull: false,
            type: DataTypes.STRING
        }
    },
    {
        modelName: "followedArtist",
        sequelize: database
    })

module.exports = { FollowedArtist }
