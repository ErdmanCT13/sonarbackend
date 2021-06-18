const express = require("express")
const fetch = require("node-fetch")
const { Op } = require("sequelize")
const {FollowedArtist} = require("../sequelize/models/followedArtist")
const {User} = require("../sequelize/models/user")
const {PinnedLocation} = require("../sequelize/models/pinnedLocation")

const locations = express.Router()

locations
    .route("/locations")
    .get((req, res) => {

        console.log("GET LOCATIONS")
        PinnedLocation.findAndCountAll({
            where: {
                userId: {
                    [Op.eq]: req.query.userid
                }
            }
        })
    })
    .post((req, res) => {
        PinnedLocation.create({
            userId: req.query.userid,
            locationName: req.query.locationname,
            radius: req.query.radius,
            latitude: req.query.lat,
            longitude: req.query.lng
        })
        console.log("POST LOCATIONS")
    })


module.exports = locations