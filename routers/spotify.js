const express = require("express");
const fetch = require("node-fetch");
const { Op, json } = require("sequelize");
const { FollowedArtist } = require("../sequelize/models/followedArtist");
const { User } = require("../sequelize/models/user");
const { PinnedLocation } = require("../sequelize/models/pinnedLocation");
const SpotifyWebApi = require("spotify-web-api-node");

// BASIC API FLOW GOES SOMETHING LIKE

// GET CODE -> EXCHANGE CODE FOR

const spotify = express.Router();

var spotifyApiClient = new SpotifyWebApi();

var callCounter = 0;

spotify.route("/authorize/user").get(async (req, res) => {
  console.log(++callCounter);
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log(req.query.refresh_token, "REFRESH TOKEN");
  var clientId = process.env.SPOTIFY_CLIENT_ID;
  var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (req.query.refresh_token) {
    // USER WANTS TO REFRESH TOKEN
    console.log(req.query.refresh_token, "HERES THE REFRESH TOKEN ");
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body:
        "grant_type=refresh_token" +
        "&refresh_token=" +
        req.query.refresh_token,
    }).then((response) => response.json());
    console.log("this is the access token", result.access_token, result);
    res.json(result);
    return;
  }
  if (req.query.code) {
      console.log(req.query.code)
    // USER WANTS TO EXCHANGE AUTH CODE FOR TOKENS
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
      },
      body:
        "grant_type=authorization_code" +
        "&code=" +
        req.query.code +
        "&redirect_uri=" +
        encodeURIComponent(
          `http://${process.env.INTERNAL_REDIRECT_HOST}/spotify/authorize/user`
        ) +
        "&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    }).then((response) => response.json());
    console.log(result)
    // REDIRECT BACK TO THE ARTISTS PAGE OF THE FRONT END ONCE WE HAVE THE TOKEN, OR RETURN INTERNAL SERVEER ERROR IF TOKENS AREN'T RETURNED
    if(result.access_token && result.refresh_token){
        res.redirect(
            `https://${process.env.CLIENT_REDIRECT_HOST}/artists?access_token=${result.access_token}&refresh_token=${result.refresh_token}&expires_in=${result.expires_in}`
          );
    }
    else{
        res.status(500).send("An issue was encountered while retrieving Spotify credentials")
    }
  } else {
    // USER IS REQUESTING AUTH CODE
    var scopes = "user-read-private user-read-email user-top-read";
    res.redirect(
      "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        "bc453c61d93d4492b22bb580cf33db9f" +
        (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
        "&redirect_uri=" +
        encodeURIComponent(`http://${process.env.INTERNAL_REDIRECT_HOST}/spotify/authorize/user`)
    );
  }
});

spotify.route("/authorize/client").get(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log(
    "client id",
    process.env.SPOTIFY_CLIENT_ID,
    process.env.SPOTIFY_CLIENT_SECRET
  );
  var clientCredentials = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        )}`,
      },
    }
  ).then((response) => response.json());
  console.log(clientCredentials);
  res.json(clientCredentials);
});

spotify.route("/search").get(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const searchValue = req.query.search;
  const accessToken = (
    await fetch("http://localhost:4000/spotify/authorize/client").then(
      (response) => response.json()
    )
  ).access_token;
  console.log("heres the token!!!!!!!!!!!!!!!!", accessToken);
  spotifyApiClient.setAccessToken(accessToken);
  const artists = await spotifyApiClient.searchArtists(searchValue, {
    limit: 50,
  });
  res.json(artists.body);
});

spotify.route("/topartists").get(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const searchValue = req.query.search;
  const accessToken = req.query.access_token;
  console.log("heres the token!!!!!!!!!!!!!!!!", accessToken);
  spotifyApiClient.setAccessToken(accessToken);
  try {
    var artists = await spotifyApiClient.getMyTopArtists();
    res.json(artists.body);
  } catch (err) {
    console.log(err.statusCode);
    res.sendStatus(err.statusCode);
  }

});

spotify.route("/followedartists").get(async (req, res) => {
  console.log("GRABBING FOLLOWED ARTISTS FROM DB AND SPOTIFY");
  res.setHeader("Access-Control-Allow-Origin", "*");
  // const searchValue = req.query.search
  const accessToken = req.query.access_token;
  //const artistsToGet = JSON.parse(req.body).artistIdList // body should have stringified json with list of artists
  console.log("heres the token!!!!!!!!!!!!!!!!", accessToken);
  spotifyApiClient.setAccessToken(accessToken);
  try {
    var databaseArtists = await FollowedArtist.findAll({
      where: {
        userId: req.query.userid,
      },
    });
    // console.log("WHAT THE FUCKKKKK", databaseArtists, databaseArtists.map(databaseArtist => databaseArtist.spotifyId))
    if (databaseArtists.length == 0) {
      res.json({ artists: [] });
      return;
    } // if there aren't any artists in the DB then we send back an empty array and end the endpoint execution
    var artists = await spotifyApiClient.getArtists(
      databaseArtists.map((databaseArtist) => databaseArtist.spotifyId)
    );
    console.log(artists.body, "HERES THE BODY");
    res.json(artists.body);
  } catch (err) {
    console.log("ERROR WHILE GETTING FOLLOWED ARTISTS", err);
    res.sendStatus(400);
  }

  //res.send("hello")
});

module.exports = spotify;
