const express = require("express")
const fetch = require("node-fetch")
const { Op } = require("sequelize")
const {FollowedArtist} = require("../sequelize/models/followedArtist")
const {User} = require("../sequelize/models/user")
const {PinnedLocation} = require("../sequelize/models/pinnedLocation")

const artists = express.Router()

artists
    .route("/artists")
    .get(async (req, res) => {
        await FollowedArtist.findAndCountAll({
            where: {
                userId: {
                    [Op.eq]: req.query.userid
                }
            }
        })
    })
    .post(async (req, res) => {
        console.log("POST LOCATIONS")
        var itemsInserted = await FollowedArtist.create({
            userId: req.query.userid,
            artistName: req.query.artistname
        })
        console.log("inserted", itemsInserted)
    })

module.exports = artists