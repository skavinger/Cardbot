const Discord = require("discord.js");
var cardlist = require("./cardList.json");
const { exec } = require('node:child_process');
var fs = require("fs");

const bot = new Discord.Client();

const token = require("./creds.json").token;

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
        name: 'rulebook',
        description: 'Gets the MHA rulebook'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'bans',
        description: 'Gets the ban and errata list'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'birb',
        description: 'Gets dancing birbs'
    }});

    //random card calls
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'random_card',
        description: 'Gets a random Card'
    }});
});

bot.ws.on("INTERACTION_CREATE", async interaction => {
    const channel = bot.channels.cache.get(interaction.channel_id);
    if(interaction.data.name === "cardbot" || interaction.data.name === "pmcardbot"){
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
    }
    else if(interaction.data.name === "lgr"){
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
                content: "https://cdn.discordapp.com/attachments/1133137225257848883/1145739344435490846/UniVersus-Living-Game-Rules-v0.13_4.pdf"
            }
        }});
    }
    else if(interaction.data.name === "rulebook"){
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
                content: "https://uvsgames.com/universus/organized-play/rules-and-documents"
            }
        }});
    }
    else if(interaction.data.name === "bans"){
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
                content: "https://uvsgames.com/all-news/formats-and-ban-lists"
            }
        }});
    }
    else if(interaction.data.name === "birb"){
        var image = "https://cdn.discordapp.com/attachments/821077984563560532/844351005818355762/unknown.gif";
        var chance = Math.floor(Math.random() * 10)
        if(chance === 3){
            image = "https://imgur.com/IuSIajD";
        }
        if(chance === 4){
            image = "https://imgur.com/sR6HDeQ";
        }
        if(chance === 5){
            image = "https://imgur.com/zWp0Hht";
        }
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
                content: image
            }
        }});
    }
    else if(interaction.data.name === "random_card"){
        var keys = Object.keys(cardlist);
        var cardlink = cardlist[keys[Math.floor(Math.random() * keys.length)]];
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
          type: 4,
          data: {
            content: cardlink
          }
        }});
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
        else if(message.content.match(/^\?cardbotUpdate/)){
            exec("git pull", function(err, stdout, stderr){
                if(err){
                    message.reply("Git Update Failed: " + stderr);
                }
                else{
                    cardlist = JSON.parse(fs.readFileSync("./cardList.json"));
                    message.reply("Git Updated: " + stdout);
                }
            }.bind(this));
        }
    }
    catch(e){
        console.log(e);
        message.reply("Sorry something went wrong please contact owner");
    }
    
});

bot.login(token);
