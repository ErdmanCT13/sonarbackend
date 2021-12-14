const express = require("express")
const fetch = require("node-fetch")
const { Op } = require("sequelize")
const { FollowedArtist } = require("../sequelize/models/followedArtist")
const { User } = require("../sequelize/models/user")
const { PinnedLocation } = require("../sequelize/models/pinnedLocation")
const SpotifyWebApi = require("spotify-web-api-node")


const shows = express.Router()

shows
    .route("/shows")
    .get(async (req, res) => {
        // res.setHeader("Access-Control-Allow-Origin", "*");
        // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        // res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        try {
            var locations = await PinnedLocation.findAll({
                where: {
                    userId: {
                        [Op.eq]: req.query.userid
                    }
                }
            })
            console.log('LOCATIONS', locations)
            var allShowsNearPins = (await Promise.all(locations.map(location => getAllResponsePages(location.latitude, location.longitude, location.radius)))).flat() // stick all the requests into an array and WAIT
            var followedArtists = await fetch(`http://localhost:${process.env.PORT}/user/artists?userid=${req.query.userid}`).then(response => response.json())
            let filteredShows = allShowsNearPins.filter(show => followedArtists.find(artist => {
                let findShowRegex = new RegExp(artist.artistName) // case insensitive regex
                return findShowRegex.test(show.name)
            })) // if there are any shows being played by a followed artist return it
            res.json({filteredShows})
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err.message)
        }
    })

async function getAllResponsePages(lat, lng, radius) {
    console.log(lat, lng, radius)
    var events = []
    var initialResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY || "mrbBwUA2fLRuRtL77Gt9LpOEWWyB1r7N"}&latlong=${lat},${lng}&radius=${radius}&segmentName=music&size=199`).then((response) => {
        return response.json()
    })
    console.log(initialResponse)
    if (initialResponse._embedded?.events) events = [...events, ...initialResponse._embedded.events] // add the events the the list
    for (var i = 1; i < initialResponse.page.totalPages; i++) {
        events = [...events, ...(await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY || "mrbBwUA2fLRuRtL77Gt9LpOEWWyB1r7N"}&latlong=${lat},${lng}&radius=${radius}&segmentName=music&size=199&page=${i}`).then(response => response.json().then(response => response._embedded.events)))]
    }
    return events
}


module.exports = shows