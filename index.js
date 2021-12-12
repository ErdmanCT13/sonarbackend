const express = require("express")
const fetch = require("node-fetch")
const {Sequelize, Model, DataTypes, Op} = require("sequelize")
const {FollowedArtist} = require("./sequelize/models/followedArtist")
const {User} = require("./sequelize/models/user")
const {PinnedLocation} = require("./sequelize/models/pinnedLocation")
const {database} = require("./sequelize/connection")
const user = require("./sequelize/models/user")
const passport = require("passport")
const spotifyMiddleware = require("./routers/spotify")
const cors = require("cors")

require("dotenv").config()

const userMiddleware = require("./routers/user")


database.sync({force: true})

const app = express()

app.use(cors(
    process.env.WHITELISTED_CORS_ORIGINS.split(",")
))



app.use("/user", userMiddleware)
app.use("/spotify", spotifyMiddleware)

app.get("/ping", (req, res) => {
    res.sendStatus(200)
})

app.listen(process.env.PORT || 4000, async () => {
    console.log("listening on", process.env.PORT || 4000)
})