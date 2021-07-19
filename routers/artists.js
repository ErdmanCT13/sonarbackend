const express = require("express")
const fetch = require("node-fetch")
const { Op } = require("sequelize")
const { FollowedArtist } = require("../sequelize/models/followedArtist")
const { User } = require("../sequelize/models/user")
const { PinnedLocation } = require("../sequelize/models/pinnedLocation")

const artists = express.Router()

artists
    .route("/artists")
    .get(async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*")
        try {
            var artists = await FollowedArtist.findAll({
                where: {
                    userId: {
                        [Op.eq]: req.query.userid
                    }
                }
            })
            console.log(artists)
            res.json(artists)
        }
        catch (err) {
            console.log(err)
            res.sendStatus(400)
        }
    })
    .post(async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*")
        try {
            var artistInserted = await FollowedArtist.upsert({
                userId: req.query.userid,
                artistName: req.query.artistname,
                spotifyId: req.query.spotifyid
            },
            {
                where: {
                    spotifyId: req.query.spotifyId
                }
            })
            console.log(artistInserted)
            res.json(artistInserted)
        }
        catch (err) {
            console.log(err)
            res.sendStatus(400)
        }
    })
    .delete(async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*")
        try {
            artistDeleted = await FollowedArtist.destroy({
                where: {
                    spotifyId: req.query.spotifyid
                }
            })
            console.log(artistDeleted)
            res.json(artistDeleted)
        }
        catch (err) {
            console.log(err)
            res.sendStatus(400)
        }
    })

module.exports = artists