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
})

user.post("/signup", (req, res) => {
    User.create({
        
    })
})

module.exports = user