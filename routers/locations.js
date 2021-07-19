const express = require("express")
const fetch = require("node-fetch")
const { Op } = require("sequelize")
const {FollowedArtist} = require("../sequelize/models/followedArtist")
const {User} = require("../sequelize/models/user")
const {PinnedLocation} = require("../sequelize/models/pinnedLocation")
const cors = require("cors")

const locations = express.Router()

//http://localhost:4000/user/locations?userid=1&locationname=Milwaukee&radius=50&lat=43.100982876188546&lng=-89.36279296875

locations
    .route("/locations")
    .get(async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*")
        try{
            var locations = await PinnedLocation.findAll({
                where: {
                    userId: {
                        [Op.eq]: req.query.userid
                    }
                }
            })
            console.log(locations)
            res.json(locations)
        }
        catch(err){
            console.log(err)
            res.sendStatus(400)
        }
    })
    .post(async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*")
        try{
            var locationCreated = await PinnedLocation.create({
                userId: req.query.userid,
                locationName: req.query.locationname,
                radius: req.query.radius,
                latitude: req.query.lat,
                longitude: req.query.lng
            })
            console.log(locationCreated)
            res.json(locationCreated)
        }
        catch(err){
            console.log(err)
            res.sendStatus(400)
        }
    })
    .delete(cors(), async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*")
        try{
            var locationDeleted = await PinnedLocation.delete({
                where: {
                    userId: req.query.userid,
                    locationId: req.query.locationid
                }
            })
            // var locationCreated = await PinnedLocation.create({
            //     userId: req.query.userid,
            //     locationName: req.query.locationname,
            //     radius: req.query.radius,
            //     latitude: req.query.lat,
            //     longitude: req.query.lng
            // })
            // console.log(locationCreated)
            // res.json(locationCreated)
            res.json(locationDeleted)
        }
        catch(err){
            console.log(err)
            res.sendStatus(400)
        }
    })


module.exports = locations