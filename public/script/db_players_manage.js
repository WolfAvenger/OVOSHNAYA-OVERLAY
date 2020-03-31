const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });
var db, collection;

var players = [{
    battletag: 'playerA-1111',
    shorttag: 'playerA',
    name: 'Jeff Caplan',
    number: '1',
    country: 'USA',
    team: 'Blizzard Development Team'
} , {
    battletag: 'КОПАТЫЧ-21284',
    shorttag: 'КОПАТЫЧ',
    name: 'Simon Gurin',
    number: '27',
    country: 'Russia',
    team: 'TOXICH'
}];

mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    db = client.db("OVLeague");
    collection = db.collection("players");

    collection.drop((err,results) => {
        if (!err) console.log('Database of players has been successfully dropped.');
        else console.log(err);
    })

    collection.insertMany(players, (err, results) => {
       //console.log(`Player ${player.battletag} has been successfully inserted.`);
    });

    // collection.deleteOne({_id: ObjectID('5da643421fd93ecbdfede477')}, (err,results) => {
    //     console.log('deleted');
    // });

    collection.find().toArray((err,results) => {
        console.log(results);
    });

    client.close();
});
