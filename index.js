const Discord = require("discord.js");
var character_cardlist = require("./character_cardlist.json");
var attack_cardlist = require("./attack_cardlist.json");
var foundation_cardlist = require("./foundation_cardlist.json");
var action_cardlist = require("./action_cardlist.json");
var asset_cardlist = require("./asset_cardlist.json");
var cardlist_by_symbol = require("./cardlist_by_symbol.json");
var cardlist = {};
Object.assign(cardlist, character_cardlist, attack_cardlist, foundation_cardlist, action_cardlist, asset_cardlist);

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
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'random_character',
        description: 'Gets a random Character Card'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'random_attack',
        description: 'Gets a random Attack Card'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'random_foudation',
        description: 'Gets a random Foundation Card'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'random_asset',
        description: 'Gets a random Asset Card'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'random_action',
        description: 'Gets a random Action Card'
    }});
    bot.api.applications(bot.user.id).commands.post({data: {
        name: 'random_deck',
        description: 'Gets a random Deck',
        options: [{
            "name": "symbol",
            "description": "Symbol to Build",
            "type": 3,
            "required": false,
            "choices": [{"name": "Air", "value": "Air"}, {"name": "All", "value": "All"}, {"name": "Chaos", "value": "Chaos"}, {"name": "Death", "value": "Death"}, {"name": "Earth", "value": "Earth"}, {"name": "Evil", "value": "Evil"}, {"name": "Fire", "value": "Fire"}, {"name": "Good", "value": "Good"}, {"name": "Life", "value": "Life"}, {"name": "Order", "value": "Order"}, {"name": "Void", "value": "Void"}, {"name": "Water", "value": "Water"}]
        },
        {
            "name": "charaterCount",
            "description": "How many characters(defaults 1)",
            "type": 4,
            "required": false
        },
        {
            "name": "actionCount",
            "description": "How many characters(defaults 2)",
            "type": 4,
            "required": false
        },
        {
            "name": "assetCount",
            "description": "How many characters(defaults 2)",
            "type": 4,
            "required": false
        },
        {
            "name": "attackCount",
            "description": "How many characters(defaults 17)",
            "type": 4,
            "required": false
        },
        {
            "name": "foundationCount",
            "description": "How many characters(defaults 29)",
            "type": 4,
            "required": false
        },
        {
            "name": "anyCount",
            "description": "How many of any card(defaults 0)",
            "type": 4,
            "required": false
        }]
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
                content: "https://www.jascogames.net/wp-content/uploads/2021/01/UniVersus-Living-Game-Rules-v0.13.pdf"
            }
        }});
    }
    else if(interaction.data.name === "rulebook"){
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
                content: "http://mhacardgame.com/wp-content/uploads/2022/10/MHA-CCG-Official-Rules-Reference-10-14-22-v1.11.pdf"
            }
        }});
    }
    else if(interaction.data.name === "bans"){
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
                content: "https://www.jascogames.net/wp-content/uploads/2021/01/LEGALITY-AND-ERRATAS-Jan-21.pdf"
            }
        }});
    }
    else if(interaction.data.name === "birb"){
        var image = "https://cdn.discordapp.com/attachments/821077984563560532/844351005818355762/unknown.gif";
        var chance = Math.floor(Math.random() * 5)
        if(chance === 3){
            image = "https://imgur.com/IuSIajD";
        }
        if(chance === 4){
            image = "https://imgur.com/sR6HDeQ";
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
    else if(interaction.data.name === "random_character"){
        var keys = Object.keys(character_cardlist);
        var cardlink = character_cardlist[keys[Math.floor(Math.random() * keys.length)]];
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
          type: 4,
          data: {
            content: cardlink
          }
        }});
    }
    else if(interaction.data.name === "random_attack"){
        var keys = Object.keys(attack_cardlist);
        var cardlink = attack_cardlist[keys[Math.floor(Math.random() * keys.length)]];
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
          type: 4,
          data: {
            content: cardlink
          }
        }});
    }
    else if(interaction.data.name === "random_foudation"){
        var keys = Object.keys(foundation_cardlist);
        var cardlink = foundation_cardlist[keys[Math.floor(Math.random() * keys.length)]];
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
          type: 4,
          data: {
            content: cardlink
          }
        }});
    }
    else if(interaction.data.name === "random_asset"){
        var keys = Object.keys(asset_cardlist);
        var cardlink = asset_cardlist[keys[Math.floor(Math.random() * keys.length)]];
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
          type: 4,
          data: {
            content: cardlink
          }
        }});
    }
    else if(interaction.data.name === "random_action"){
        var keys = Object.keys(action_cardlist);
        var cardlink = action_cardlist[keys[Math.floor(Math.random() * keys.length)]];
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
          type: 4,
          data: {
            content: cardlink
          }
        }});
    }
    else if(interaction.data.name === "random_deck"){
        var symbol_list = ["Air", "All", "Chaos", "Death", "Earth", "Evil", "Fire", "Good", "Life", "Order", "Void", "Water"];
        var character_count = 1;
        var attack_count = 17;
        var foundation_count = 29;
        var asset_count = 2;
        var action_count = 2;
        var variance = 0;
        var deck = {};
        var symbol = symbol_list[Math.floor(Math.random()*symbol_list.length)]; 
        
        if(interaction.data.options[0].value !== ""){
            symbol = interaction.data.options[0].value;
        }
        if(interaction.data.options[1].value !== ""){
            character_count = interaction.data.options[1].value;
        }
        if(interaction.data.options[2].value !== ""){
            action_count = interaction.data.options[2].value;
        }
        if(interaction.data.options[3].value !== ""){
            asset_count = interaction.data.options[3].value;
        }
        if(interaction.data.options[4].value !== ""){
            attack_count = interaction.data.options[4].value;
        }
        if(interaction.data.options[5].value !== ""){
            foundation_count = interaction.data.options[5].value;
        }
        if(interaction.data.options[6].value !== ""){
            variance = interaction.data.options[6].value;
        }

        if(character_count > 20 || attack_count > 100 || foundation_count > 100 || asset_count > 15 || action_count > 15){
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
              type: 4,
              data: {
                content: "Out of range card count"
              }
            }});
            return;
        }

        function getRandCharacter(){
            var card = cardlist_by_symbol.Character[symbol][Math.floor(Math.random()*cardlist_by_symbol.Character[symbol].length)];
            if(deck[card] >= 4){
                card = getRandCharacter();
            }
            return card;
        }

        function getRandAttack(){
            var card = cardlist_by_symbol.Attack[symbol][Math.floor(Math.random()*cardlist_by_symbol.Attack[symbol].length)];
            if(deck[card] >= 4){
                card = getRandAttack();
            }
            return card;
        }

        function getRandFoundation(){
            var card = cardlist_by_symbol.Foundation[symbol][Math.floor(Math.random()*cardlist_by_symbol.Foundation[symbol].length)];
            if(deck[card] >= 4){
                card = getRandFoundation();
            }
            return card;
        }

        function getRandAsset(){
            var card = cardlist_by_symbol.Asset[symbol][Math.floor(Math.random()*cardlist_by_symbol.Asset[symbol].length)];
            if(deck[card] >= 4){
                card = getRandAsset();
            }
            return card;
        }

        function getRandAction(){
            var card = cardlist_by_symbol.Action[symbol][Math.floor(Math.random()*cardlist_by_symbol.Action[symbol].length)];
            if(deck[card] >= 4){
                card = getRandAction();
            }
            return card;
        }

        function getRandCard(){
            var list = [].concat(cardlist_by_symbol.Character[symbol]).concat(cardlist_by_symbol.Attack[symbol]).concat(cardlist_by_symbol.Foundation[symbol]).concat(cardlist_by_symbol.Asset[symbol]).concat(cardlist_by_symbol.Action[symbol])
            var card = list[Math.floor(Math.random()*cardlist_by_symbol.Action[symbol].length)];
            if(deck[card] >= 4){
                card = getRandCard();
            }
            return card;
        }

        for(var i = 0; i < character_count; i++){
            var card = getRandCharacter();
            if(deck[card] !== undefined){
                deck[card]++;
            }
            else{
               deck[card] = 1; 
            }
        }
        for(var i = 0; i < attack_count; i++){
            var card = getRandAttack();
            if(deck[card] !== undefined){
                deck[card]++;
            }
            else{
               deck[card] = 1; 
            }
        }
        for(var i = 0; i < foundation_count; i++){
            var card = getRandFoundation();
            if(deck[card] !== undefined){
                deck[card]++;
            }
            else{
               deck[card] = 1; 
            }
        }
        for(var i = 0; i < asset_count; i++){
            var card = getRandAsset();
            if(deck[card] !== undefined){
                deck[card]++;
            }
            else{
               deck[card] = 1; 
            }
        }
        for(var i = 0; i < action_count; i++){
            var card = getRandAction();
            if(deck[card] !== undefined){
                deck[card]++;
            }
            else{
               deck[card] = 1; 
            }
        }
        for(var i = 0; i < variance; i++){
            var card = getRandCard();
            if(deck[card] !== undefined){
                deck[card]++;
            }
            else{
               deck[card] = 1; 
            }
        }

        var output = "";
        var keys = Object.keys(deck);
        for(var i = 0; i < keys.length; i++){
            output += deck[keys[i]] + "x " + keys[i] + "\n";
        }
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
          type: 4,
          data: {
            content: output
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
    }
    catch(e){
        console.log(e);
        message.reply("Sorry something went wrong please contact owner");
    }
    
});

bot.login(token);
