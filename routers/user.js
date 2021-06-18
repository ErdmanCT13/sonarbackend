const express = require("express")
const fetch = require("node-fetch")
const { Op } = require("sequelize")
const { FollowedArtist } = require("../sequelize/models/followedArtist")
const { User } = require("../sequelize/models/user")
const { PinnedLocation } = require("../sequelize/models/pinnedLocation")

const artistsMiddleware = require("./artists")
const locationsMiddleware = require("./locations")
const showsMiddleware = require("./shows")

const user = express.Router()

user.use(artistsMiddleware)
user.use(locationsMiddleware)
user.use(showsMiddleware)

user.get("/", (req, res) => {
    console.log("GETTING USER")
    User.findOne({
        where: {
            [Op.or]: [
                {
                    userEmail: req.query.email
                },
                {
                    userId: req.query.userid
                }
            ]
        }
    })
})

user.post("/signup", async (req, res) => {
    var newUser = User.create({
        userEmail: req.query.email,
        userRadius: req.query.radius,
        userPostalCode: req.query.postalcode,
        userLatitude: req.query.lat,
        userLongitude: req.query.lng,
    })
})

module.exports = user