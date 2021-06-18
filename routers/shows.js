const express = require("express")
const fetch = require("node-fetch")
const { Op } = require("sequelize")
const {FollowedArtist} = require("../sequelize/models/followedArtist")
const {User} = require("../sequelize/models/user")
const {PinnedLocation} = require("../sequelize/models/pinnedLocation")

const shows = express.Router()

shows
    .route("/shows")
    .get((req, res) => {
        console.log("GET SHOWS")
    })


module.exports = shows