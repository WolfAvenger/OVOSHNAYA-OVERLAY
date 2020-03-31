const ow = require('overwatch-stats-api');
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const api = require('./db_api.js');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

const views = path.join(__dirname, '../views');
const icons = {
    tank: 'https://static.playoverwatch.com/img/pages/career/icon-tank-8a52daaf01.png',
    damage: 'https://static.playoverwatch.com/img/pages/career/icon-offense-6267addd52.png',
    support: 'https://static.playoverwatch.com/img/pages/career/icon-support-46311a4210.png'
};
let dbClient;

//app.listen(8080, '26.39.123.131');
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use('/',express.static(path.join(__dirname, '../../')+ 'public'));
app.set('view engine', 'ejs');
app.enable('trust proxy');

mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.players = client.db("OVLeague").collection('players');
    app.listen(8080, '26.39.123.131');
});

app.get('/', (req,res) => {
    res.status(200).sendFile(path.join(__dirname, "../") + 'html/home.html');
});

app.get('/player/json/:tag', (req,res) => {
    // const player = (async() => await api.getPlayerByTag(app.locals.database, req.params.tag))()
    //     .then(ok => console.log(ok))
    //     .then(ok => res.send(ok));
    // console.log(player);
    // res.send(player);

    var player;

    app.locals.players.find({shorttag: req.params.tag}).toArray((err, results) => {
        (async() => await ow.getBasicInfo(results[0].battletag, 'pc'))()
            .then(player => {
                res.send({onError: false, err: null, stats: player, info: results[0]});
            })
            .catch(err => {
                res.send({onError: true, err: err.message, stats: null, info: null});
            });
    });
});
