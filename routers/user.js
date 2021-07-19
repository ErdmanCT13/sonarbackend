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



//http://localhost:4000/?email=erdman_carl@hotmail.com

user.get("/", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    try{
        var user = await User.findOne({
            where: {
                [Op.or]: [
                    {
                        userEmail: req.query.email || "nobody@nobody.com"
                    },
                    {
                        userId: req.query.userid || 123456
                    }
                ]
            }
        })
        console.log(user)
        res.json(user)
    }
    catch(err){
        console.log(err)
        res.sendStatus(400)
    }

})


//http://localhost:4000/user/signup?email=erdman_carl@hotmail.com&radius=50&postalcode=53704&lat=43.100982876188546&lng=-89.36279296875


user.post("/signup", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    try{
        var newUser = await User.create({
            userEmail: req.query.email,
            userRadius: req.query.radius,
            userPostalCode: req.query.postalcode,
            userLatitude: req.query.lat,
            userLongitude: req.query.lng,
        })
        console.log(newUser)
        res.json(newUser)
    }
    catch(err){
        console.log(err)
        res.sendStatus(400)
    }
})

module.exports = user