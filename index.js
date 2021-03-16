const Discord = require("discord.js");
var bot = new Discord.Client();
var cardlist = require("./cardlist.json");
var tocken = require("./creds.json").token;

bot.on("ready", function(){
    console.log("Ready!");
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

bot.login(token);
