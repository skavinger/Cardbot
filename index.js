const Discord = require("discord.js");
var bot = new Discord.Client();
var cardlist = require("./cardlist.json");

bot.on("ready", function(){
    console.log("Ready!");
});

bot.on("message", function(message){
    if(message.content.match(/^\?cardbot .*/)){
        var card = message.content.match(/^\?cardbot (.*)/)[1];
        if(cardlist.standard[card] !== undefined){
            message.reply(cardlist.standard[card]);
        }
        else{
            message.reply("Sorry, can't find " + card + ".");
        }
    }
});

bot.login("ODIxMDYzMTcxMDg2NzQ1Njcy.YE-Qqg.B8npAORkrTqPsVJr1L6X9ZoRht4");