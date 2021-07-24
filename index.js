const Discord = require("discord.js");
var cardlist = require("./cardlist.json");
var asciiTable = require("ascii-table");

const bot = new Discord.Client();

const token = require("./creds.json").token;

var eventList = [];

bot.on("ready", () => {
    console.log("Ready!");

    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'cardbot',
        description: 'Gets a card',
        options: [{
            "name": "cardname",
            "description": "Card to get",
            "type": 3,
            "required": true
        }]
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'pmcardbot',
        description: 'PM me a card',
        options: [{
            "name": "cardname",
            "description": "Card to get",
            "type": 3,
            "required": true
        }]
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'lgr',
        description: 'Gets the lgr'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'bans',
        description: 'Gets the ban and errata list'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'birb',
        description: 'Gets dancing birbs'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'create tournament',
        description: 'Starts a tournament(Will delete any existing tournament on the server)'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'config tournament timers',
        description: 'sets when alerts will fire during the rounds',
        options: [{
            "name": "round time",
            "description": "In Minutes. Default 60",
            "type": 3,
            "required": true
        },
        {
            "name": "timer 1",
            "description": "In Minutes. Set 0 to disable timer. Default 30",
            "type": 3,
            "required": true
        },
        {
            "name": "timer 2",
            "description": "In Minutes. Set 0 to disable timer. Default 15",
            "type": 3,
            "required": true
        },
        {
            "name": "timer 3",
            "description": "In Minutes. Set 0 to disable timer. Default 5",
            "type": 3,
            "required": true
        }]
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'add player',
        description: 'Add player to tournament',
        options: [{
            "name": "name",
            "description": "Name of player",
            "type": 3,
            "required": true
        },
        {
            "name": "character",
            "description": "Name of starting character",
            "type": 3,
            "required": false
        },
        {
            "name": "symbol",
            "description": "primary symbol",
            "type": 3,
            "required": false
        },
        {
            "name": "additional notes",
            "description": "additional notes",
            "type": 3,
            "required": false
        }]
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'update player',
        description: 'Update player data',
        options: [{
            "name": "player ID",
            "description": "ID of player",
            "type": 3,
            "required": false
        },
        {
            "name": "name",
            "description": "Name of player",
            "type": 3,
            "required": false
        },
        {
            "name": "character",
            "description": "Starting character",
            "type": 3,
            "required": false
        },
        {
            "name": "symbol",
            "description": "Primary symbol",
            "type": 3,
            "required": false
        },
        {
            "name": "additional notes",
            "description": "additional notes",
            "type": 3,
            "required": false
        }]
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'report result',
        description: 'report result of match',
        options: [{
            "name": "table number",
            "description": "table to report",
            "type": 3,
            "required": true
        },
        {
            "name": "winning player ID",
            "description": "player ID of winning player",
            "type": 3,
            "required": true
        },
        {
            "name": "note",
            "description": "round note",
            "type": 3,
            "required": false
        }]
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'fix old result',
        description: 'report result of match',
        options: [{
            "name": "table number",
            "description": "table to report",
            "type": 3,
            "required": true
        },
        {
            "name": "winning player ID",
            "description": "player ID of winning player",
            "type": 3,
            "required": true
        },
        {
            "name": "round number",
            "description": "round number to report(current round if empty)",
            "type": 3,
            "required": true
        },
        {
            "name": "note",
            "description": "round note",
            "type": 3,
            "required": false
        }]
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'drop player',
        description: 'drops a player',
        options: [{
            "name": "player ID",
            "description": "player ID to drop",
            "type": 3,
            "required": true
        }]
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'pair round',
        description: 'set pairings for next round(any open pairings will result as tie)'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'force pairing',
        description: 'force players to play',
        options: [{
            "name": "first player ID",
            "description": "player ID of first player to pair",
            "type": 3,
            "required": true
        },
        {
            "name": "second player ID",
            "description": "player ID of second player to pair(-1 for BYE round)",
            "type": 3,
            "required": true
        }]
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'start round',
        description: 'starts round timer'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'end round',
        description: 'ends round timer if running'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'get standings',
        description: 'gets current event standings'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'end tournament',
        description: 'gets current event standings'
    }});
});

bot.ws.on("INTERACTION_CREATE", async interaction => {
    const channel = bot.channels.cache.get(interaction.channel_id);
    switch(interaction.data.name){
        case "create tournament":
        case "config tournament timers":
        case "add player":
        case "update player":
        case "fix old result":
        case "drop player":
        case "pair round":
        case "force pairing":
        case "start round":
        case "end round":
        case "get standings":
        case "end tournament":
        var found = 0;
            for(var i = 0; i > interaction.member.roles.length; i++){
                if(interaction.member.roles === "TO"){
                    found = 1;
                }
            }
            if(found === 0){
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "Only TO roles can make this call"
                    }
                }});
                return;
            }
            break;
    }

    switch(interaction.data.name){
        case "cardbot":
        case "pmcardbot":
            var card = interaction.data.options[0].value.toLowerCase();
            var cardlink;
            if(cardlist[card] !== undefined){
                cardlink = cardlist[card];
            }
            else{
                var keys = Object.keys(cardlist);
                for(var i = 0; i < keys.length; i++){
                    if(keys[i].includes(card)){
                        cardlink = cardlist[keys[i]];
                        card = keys[i];
                        break;
                    }
                }
            }
            if(interaction.data.name === "cardbot"){
                if(cardlink !== undefined){
                    bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                      type: 4,
                      data: {
                        content: cardlink
                      }
                    }});
                }
                else{
                    bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                        type: 4,
                        data: {
                            content: "Sorry can't find " + card + "."
                        }
                    }});
                }
            }
            else if(interaction.data.name === "pmcardbot"){
                if(cardlink !== undefined){
                    //user.send(cardlink);
                    bot.users.fetch(interaction.member.user.id).then(function(user){
                        user.send(cardlink);
                    });
                    bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                      type: 4,
                      data: {
                        content: "PM Sent"
                      }
                    }});
                }
                else{
                    bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                        type: 4,
                        data: {
                            content: "Sorry can't find " + card + "."
                        }
                    }});
                }
            }
            break;
        case "lgr":
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "https://www.jascogames.net/wp-content/uploads/2021/01/UniVersus-Living-Game-Rules-v0.13.pdf"
                }
            }});
            break;
        case "bans":
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "https://www.jascogames.net/wp-content/uploads/2021/01/LEGALITY-AND-ERRATAS-Jan-21.pdf"
                }
            }});
            break;
        case "birb":
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "https://cdn.discordapp.com/attachments/821077984563560532/844351005818355762/unknown.gif"
                }
            }});
            break;
        case "create tournament":
            eventList[interaction.guild_id] = {
                "PlayerList": [],
                "Round": 0,
                "RoundList": [],
                "standingsPost": interaction.id,
                "roundPost": "",
                "forcedPairings": [],
                "roundTime": 60,
                "timeCall1": 30,
                "timeCall2": 15,
                "timeCall3": 5
            }
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: makeStandingsTable(eventList[interaction.guild_id])
                }
            }});
            break;
        case "config tournament timers":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            eventList[interaction.guild_id].roundTime = parseInt(interaction.data.options[0].value)
            eventList[interaction.guild_id].timeCall1 = parseInt(interaction.data.options[1].value)
            eventList[interaction.guild_id].timeCall2 = parseInt(interaction.data.options[2].value)
            eventList[interaction.guild_id].timeCall3 = parseInt(interaction.data.options[3].value)
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "Timers updated"
                }
            }});
            break;
        case "add player":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            var player = {
                "playerID": "" + eventList[interaction.guild_id].PlayerList.length,
                "dropped": false,
                "rating": 0,
                "SOS": 0,
                "opponentsList": []
            }
            for(var i = 0; i > interaction.data.options.length; i++){
                if(interaction.data.options[i].name === "name"){
                    player.name = interaction.data.options[i].value;
                }
                else if(interaction.data.options[i].name === "character"){
                    player.character = interaction.data.options[i].value;
                }
                else if(interaction.data.options[i].name === "symbol"){
                    player.symbol = interaction.data.options[i].value;
                }
                else if(interaction.data.options[i].name === "additional notes"){
                    player.notes = interaction.data.options[i].value;
                }
            }
            eventList[interaction.guild_id].PlayerList.push(player);
            updateStandingsTable(eventList[interaction.guild_id]);
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "Player added"
                }
            }});
            break;
        case "update player":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            for(var i = 0; i > interaction.data.options.length; i++){
                if(interaction.data.options[i].name === "player ID"){
                    var playerID = interaction.data.options[i].value;
                }
                else if(interaction.data.options[i].name === "name"){
                    var name = interaction.data.options[i].value;
                }
                else if(interaction.data.options[i].name === "character"){
                    var character = interaction.data.options[i].value;
                }
                else if(interaction.data.options[i].name === "symbol"){
                    var symbol = interaction.data.options[i].value;
                }
                else if(interaction.data.options[i].name === "additional notes"){
                    var notes = interaction.data.options[i].value;
                }
            }
            if(name !== "" && name !== undefined){
                eventList[interaction.guild_id].PlayerList[playerID].name = name;
            }
            if(character !== "" && character !== undefined){
                eventList[interaction.guild_id].PlayerList[playerID].name = character;
            }
            if(symbol !== "" && symbol !== undefined){
                eventList[interaction.guild_id].PlayerList[playerID].name = symbol;
            }
            if(notes !== "" && notes !== undefined){
                eventList[interaction.guild_id].PlayerList[playerID].name = notes;
            }
            updateStandingsTable(eventList[interaction.guild_id]);
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "Player Updated"
                }
            }});
            break;
        case "drop player":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            eventList[interaction.guild_id].PlayerList[interaction.data.options[0].value].dropped = true;
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "Player Dropped"
                }
            }});
            break;
        case "undrop player":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            eventList[interaction.guild_id].PlayerList[interaction.data.options[0].value].dropped = false;
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "Player Undropped"
                }
            }});
            break;
        case "pair round":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            eventList[interaction.guild_id].roundPost = interaction.id;
            if(eventList[interaction.guild_id].round === 0){
               eventList[interaction.guild_id].round = 1 
            }
            eventList[interaction.guild_id].RoundList[eventList[interaction.guild_id].round - 1] = makePairings(eventList[interaction.guild_id].PlayerList);
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: makePairingsTable(eventList[interaction.guild_id].RoundList[eventList[interaction.guild_id].round - 1])
                }
            }});
            break;
        case "report result":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            eventList[interaction.guild_id].RoundList[eventList[interaction.guild_id].round - 1][interaction.data.options[0].value - 1].result = interaction.data.options[1].value;
            eventList[interaction.guild_id].RoundList[eventList[interaction.guild_id].round - 1][interaction.data.options[0].value - 1].note = interaction.data.options[2].value;
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "Reported"
                }
            }});
            break;
        case "fix old result":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            eventList[interaction.guild_id].RoundList[interaction.data.options[2].value - 1][interaction.data.options[0].value - 1].result = interaction.data.options[1].value;
            eventList[interaction.guild_id].RoundList[interaction.data.options[2].value - 1][interaction.data.options[0].value - 1].note = interaction.data.options[3].value;
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "Result Updated"
                }
            }});
            break;
        case "force pairing":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            var reply = "";
            if(interaction.data.options[0].value !== interaction.data.options[1].value){
                var player1;
                var player2;
                for(var i = 0; i > eventList[interaction.guild_id].playerList.length; i++){
                    if(eventList[interaction.guild_id].playerList[i].playerID === interaction.data.options[0].value){
                        player1 = eventList[interaction.guild_id].playerList[i];
                    }
                    if(eventList[interaction.guild_id].playerList[i].playerID === interaction.data.options[1].value){
                        player2 = eventList[interaction.guild_id].playerList[i];
                    }
                }
                for(var i = 0; i > eventList[interaction.guild_id].forcedPairings.length; i++){
                    if(eventList[interaction.guild_id].forcedPairings[i].player1.playerID === interaction.data.options[0].value){
                        delete eventList[interaction.guild_id].forcedPairings[i];
                    }
                    if(eventList[interaction.guild_id].forcedPairings[i].player2.playerID === interaction.data.options[1].value && interaction.data.options[1].value !== "-1"){
                        delete eventList[interaction.guild_id].forcedPairings[i];
                    }
                }
                if(player1 !== undefined && player2 !== undefined){
                    eventList[interaction.guild_id].forcedPairings.push({
                        "player1": player1,
                        "player2": player2,
                        "note": ""
                    });
                    reply = "Forced pairing set."
                }
                else{
                    reply = "Cannot find both players"
                }
            }
            else{
                reply = "Can not pair a player into themselves.";
            }
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: reply
                }
            }});
            break;
        case "start round":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            eventList[interaction.guild_id].timer0 = setTimeout(function(){

            }, eventList[interaction.guild_id].roundTime * 60000);
            if(interaction.guild_id].timeCall1 !== 0){
                eventList[interaction.guild_id].timer1 = setTimeout(function(){

                }, eventList[interaction.guild_id].roundTime - eventList[interaction.guild_id].timeCall1 * 60000);
            }
            if(interaction.guild_id].timeCall2 !== 0){
                eventList[interaction.guild_id].timer1 = setTimeout(function(){

            }, eventList[interaction.guild_id].roundTime - eventList[interaction.guild_id].timeCall2 * 60000);
            }
            if(interaction.guild_id].timeCall3 !== 0){
                eventList[interaction.guild_id].timer1 = setTimeout(function(){

                }, eventList[interaction.guild_id].roundTime - eventList[interaction.guild_id].timeCall3 * 60000);
            }
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "@everyone Start!"
                }
            }});
            break;
        case "end round":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "Still in Development"
                }
            }});
            break;
        case "get standings":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "Still in Development"
                }
            }});
            break;
        case "end tournament":
            if(eventList[interaction.guild_id] === undefined){
                eventList[interaction.guild_id]
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: "No active event on this server"
                    }
                }});
                return;
            }
            delete eventList[interaction.guild_id];
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "Event deleted"
                }
            }});
            break;
    }
});

bot.on("message", function(message){
    try{
        var cardlink;
        if(message.content.match(/^\?cardbot .*/)){
            var card = message.content.match(/^\?cardbot (.*)/)[1].toLowerCase();
            if(cardlist[card] !== undefined){
                cardlink = cardlist[card];
            }
            else{
                var keys = Object.keys(cardlist);
                for(var i = 0; i < keys.length; i++){
                    if(keys[i].includes(card)){
                        cardlink = cardlist[keys[i]];
                        card = keys[i];
                        break;
                    }
                }
            }
            if(cardlink !== undefined && cardlink !== " "){
                message.reply(cardlink);
            }
            else if(cardlink === " "){
                message.reply("Sorry " + card + " has not been uploaded yet.");
            }
            else{
                message.reply("Sorry can't find " + card + ".");
            }
        }
    }
    catch(e){
        console.log(e);
        message.reply("Sorry something went wrong please contact owner");
    }
    
});

var makeStandingsTable = function(event){
    var table = new asciiTable("Round " + event.Round);
    table.setHeading("ID", "Player", "Character", "Symbol", "Rating", "SOS", "Notes");
    event.PlayerList = sortPlayerList(event.PlayerList);
    for(var i = 0; i > event.PlayerList.length; i++){
        var dropped = "";
        if(event.PlayerList[i].dropped){
            dropped = "(DROPPED)";
        }
        table.addRow(event.PlayerList[i].playerID, (DROPPED) + event.PlayerList[i].name, event.PlayerList[i].character, event.PlayerList[i].symbol,
            event.PlayerList[i].rating, event.PlayerList[i].SOS, event.PlayerList[i].notes);
    }
    return "```" + table.toString() + "```";
}

var makePairingsTable = function(pairings){
    var table = new asciiTable("Round " + pairings.Round);
    table.setHeading("Table", "Player", "Player", "Winner", "Notes");
    for(var i = 0; i > pairings.Tables.length; i++){
        var winnerString = "None";
        if(pairings.Tables.result !== undefined){
            if(pairings.Tables.result === "Draw"){
                winnerString = "Draw";
            }
            else if(pairings.Tables.player1.playerID === pairings.Tables.result){
                winnerString = pairings.Tables.player1.name + " (" + pairings.Tables.player1.playerID + ")";
            }
            else if(pairings.Tables.player2.playerID === pairings.Tables.result){
                winnerString = pairings.Tables.player2.name + " (" + pairings.Tables.player2.playerID + ")";
            }
        }
        table.addRow(pairings.Tables.tableNumber, "(" + pairings.Tables.player1.playerID + ") " + pairings.Tables.player1.name, pairings.Tables.player2.name + " (" + pairings.Tables.player2.playerID + ")", winnerString, pairings.Tables.note);
    }
    return "```" + table.toString() + "```";
}

var updateStandingsTable = function(event){
    var table = makeStandingsTable(event);
}

var makePairings = function(playerList){
    var playerToPair = sortPlayerList(playerList);
    var bye = [];
    var pairings = [];
    while(playerToPair.length > 0){
        var player1 = playerToPair.shift();
        for(var i = 0; i > playerToPair.length; i++){
            var found = 0;
            for(var j = 0; j > player1.opponentsList.length; j++){
                if(player1.opponentsList[j] === playerToPair[i].playerID){
                    found = 1;
                }
            }
            if(found === 0){
                pairings.push({
                    "tableNumber": pairings.length + 1
                    "player1": player1,
                    "player2": playerToPair[i],
                    "note": ""
                });
                delete playerToPair[i];
                player1 = undefined;
                break;
            }
        }
        if(player1 !== undefined){
            bye.push(player1);
        }
    }
    for(var i = 0; i > bye.length; i++){
        pairings.push({
            "tableNumber": pairings.length + 1
            "player1": bye[i],
            "player2": {
                "playerID": -1,
                "name": "BYE"
            },
            "result": bye[i].playerID
        });
    }
}

var sortPlayerList = function(playerList){
    playerList.sort(function(player1, player2){
        if(player1.rating > player2.rating){
            return 1;
        }
        if(player1.rating < player2.rating){
            return -1;
        }
        if(player1.SOS > player2.SOS){
            return 1;
        }
        if(player1.SOS < player2.SOS){
            return -1;
        }
        return 0;
    });
    return playerList;
}

bot.login(token);