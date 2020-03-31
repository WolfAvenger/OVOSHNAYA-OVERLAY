var db;

//TODO: NEED TO REWRITE OTHER METHODS WITH ADDITION OF CALLBACKS!!!

var getPlayerByTag = function (db, tag) {
    var player;

    db.collection('players').find({battletag: tag}).toArray((err, results) => {
        player = results[0];
    });

    return player;
}

var getTeamByName = function(mongoClient, teamName) {

    mongoClient.connect(function(err, client){
        if(err) return console.log(err);
        db = client.db("OVLeague");

        collection = db.collection('teams');
        let team = null;

        collection.find({name: teamName}).toArray((err,results) => {
            team = results[0];
        });

        collection = undefined;

        client.close();
    });

    return team;
}

var getLiveMatch = function(mongoClient){

    mongoClient.connect(function(err, client){
        if(err) return console.log(err);
        db = client.db("OVLeague");

        collection = db.collection('schedule');
        let match = {got: false};

        collection.find({broadcastable: true}).toArray((err, results) => {
            if (err) { }
            else {
                let now = new Date();
                let min_dif = 1000000000000;
                for (let elem of results){
                    if (now - new Date(elem.startTime) > 0 && now - new Date(elem.startTime) < min_dif){
                        min_dif = new Date(elem.startTime);
                        match.info = elem;
                    }
                }
                if (match.info) match.got = true;
            }
        });

        collection = undefined;

        client.close();
    });

    return match;
}

var getFullSchedule = function(mongoClient) {

    mongoClient.connect(function(err, client){
        if(err) return console.log(err);
        db = client.db("OVLeague");

        collection = db.collection('schedule');
        let schedule = {results: []};

        collection.find().toArray((err,results) => {
            if (!err) {
                schedule.results = results;
            }
        });

        collection = undefined;
        client.close();
    });

    return schedule;
};

module.exports = {
    getPlayerByTag: getPlayerByTag,
    getTeamByName: getTeamByName,
    getLiveMatch: getLiveMatch,
    getFullSchedule: getFullSchedule,
};
