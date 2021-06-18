const express = require("express")
const fetch = require("node-fetch")
const {Sequelize, Model, DataTypes, Op} = require("sequelize")
const {FollowedArtist} = require("./sequelize/models/followedArtist")
const {User} = require("./sequelize/models/user")
const {PinnedLocation} = require("./sequelize/models/pinnedLocation")
const {database} = require("./sequelize/connection")
const user = require("./sequelize/models/user")
const passport = require("passport")


const userMiddleware = require("./routers/user")


//database.sync({force: true})

const app = express()

// app.get("/shows", async (req, res) => {
//     const {lat, long, email, radius, postalCode} = req.query
//     console.log(lat, long, email, radius, postalCode)
//     console.log(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=mrbBwUA2fLRuRtL77Gt9LpOEWWyB1r7N&latlong=${lat},${long}&radius=${radius}&segmentName=music&size=199`)
//     var events = []
//     var initialResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=mrbBwUA2fLRuRtL77Gt9LpOEWWyB1r7N&latlong=${lat},${long}&radius=${radius}&segmentName=music&size=199&page=0`).then((response) => {
//         return response.json()
//     })
//     console.log(initialResponse)
//     if(initialResponse._embedded?.events) events = [...events, ...initialResponse._embedded.events] // add the events the the list
//     for(var i = 1; i < initialResponse.page.totalPages; i++){
//         console.log(i)
//         events = [...events, ...(await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=mrbBwUA2fLRuRtL77Gt9LpOEWWyB1r7N&latlong=${lat},${long}&radius=${radius}&segmentName=music&size=199&page=${i}`).then(response => response.json().then(response => response._embedded.events)))] 
//     }

//     res.setHeader("Access-Control-Allow-Origin", "*") 
//     console.log(events.length)
//     res.json({events})
// })





app.use("/user", userMiddleware)

app.get("/ping", (req, res) => {
    res.sendStatus(200)
})

app.listen(process.env.PORT || 4000, async () => {
    console.log("listening on 80")
})