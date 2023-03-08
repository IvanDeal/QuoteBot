/*Created by Ivan Deal: 2020-2022
Vendi is written in Javascript. Specifically node.js

Quotes are currenly loaded from csv files. Each file is a seperate year
Facts are loaded from an Amazon Web Services database
Some smaller functions have arrays that are hard coded since they were small enough that it wasn't worth doing it a different way. Not vary scalable though.

This is a copy of the live version

*/

const Discord = require('discord.js');
const bot = new Discord.Client();
const csv = require('csv-parser');
const fs = require('fs');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const token = '#########################';

//AWS bits
const AWS = require('aws-sdk');

AWS.config.update({region: "ca-central-1"});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
var params = {
    TableName : "Table #1",   
}
var params2 = {
    TableName : "Table #2",   
}
var params3 = {
    TableName : "Table #3",   
}
var params4 = {
    TableName : "Table #4",   
}
var params5 = {
    TableName : "Table #5",   
}

const breadImage = new Discord.MessageAttachment('./images/image.png')
const toastImage = new Discord.MessageAttachment('./images/image.jpg')
const burntToastImage = new Discord.MessageAttachment('./images/image.jpg')
const pileOfAshImage = new Discord.MessageAttachment('./images/image.png')

const PersonImage = new Discord.MessageAttachment('./images/facePic.jpg')
const Person2Image = new Discord.MessageAttachment('./images/facePic.jpg')
const Person3Image = new Discord.MessageAttachment('./images/facePic.jpg')
const Person4Image = new Discord.MessageAttachment('./images/facePic.jpg')
const Person5Image = new Discord.MessageAttachment('./images/facePic.jpg')
const Person6Image = new Discord.MessageAttachment('./images/facePic.jpg')


//Quote files. Should replace these with a DB table too
const filePath2020 = './exampleFile.csv';
const filePath2021 = './exampleFile2.csv';
const filePath2022 = './exampleFile3.csv';

//World Cup Resources
const worldCupDrawFile = './worldCupDraw.csv';
const availableWorldCupTeams = './availableTeamList.csv';
var worldCupPlayers = [];

var worldCupPlayersIn = ['PlayerNameOne', 'PlayerNameTwo', 'PlayerNameThree', 'PlayerNameFour'];
var worldCupPlayersInRoundTwo = ['PlayerNameOne', 'PlayerNameTwo', 'PlayerNameThree', 'PlayerNameFour'];

const catFacts = require('cat-facts');

const PREFIX = '!';

const vendingMachine = {
    a1: "Coke",
    a2: "Chaos Emerald",
    a3: "Potato",
    a4: "Cake",
    b1: "Tea! Earl Grey! Hot!",
    b2: "Among Us imposter",
    b3: "Among Us crewmate",
    b4: "Coke Zero",
    c1: "Beer",
    c2: "Rum",
    c3: "Sheep",
    c4: "Magic Mushroom",
    d1: "T Virus",
    d2: "Snickers",
    d3: "Huel",
    d4: "Steak"
}

var quoteCountFor2020 = 0;
var quotesFrom2020 = [];

var quoteCountFor2021 = 0;
var quotesFrom2021 = [];

var quoteCountFor2022 = 0;
var quotesFrom2022 = [];

var personOneFactTotal = 0;
var personOneFactArray = [];

var personTwoFactTotal = 0;
var personTwoFactArray = [];

var personThreeFactTotal = 0;
var personThreeFactArray = [];

var vendiFactTotal = 0;
var vendiFactArray = [];

var vendiJokeTotal = 0;
var vendiJokeArray = [];

var vendiWisdomTotal = 0;
var vendiWisdomArray = [];

var ftlShipArray = ["Kestrel", "Engi", "Federation", "Zoltan", "Lanius", "Stealth", "Rock", "Slug", "Mantis", "Crystal"];
var ftlShipArrayFoxVersion = ["Sneaky Boy", "Boring Boy", "Green Sparky Shield Boy", "Rocky Boy", "Crystal Boy"];

var beefWordArray = ["Array Entry #1", "Array Entry #2", "Array Entry #3"];

var bakeArray = ["Vanilla Sponge Cake", "Shortbread", "Chocolate Cake", "Coffee Cake", "Chocolate Chip Cookies", "Tiffin", "Flapjacks", "Flapjacks with raisins", "Choclate Chip Flapjack", "Millionaire Shortbread", "Rocky Road", "Scones", "Scones with raisins", "Chocolate Chip Shortbread", "Ginger Cookies", "Ginger Molasses Cookies", "Sugar Cookies", "Croissants", "Cinnamon Rolls", "Hot Cross Buns", "Iced Bun", "Danish Pastry"];

var worldCupTeams = [];
var worldCupArrayTotal = worldCupTeams.length;
console.log(worldCupArrayTotal);
console.log(worldCupTeams);

var selfDestructActivated = false;

bot.on('ready', () =>{
    docClient.scan(params, onScan);
    docClient.scan(params2, onScanJokes);
    docClient.scan(params3, onScanRandom);
    docClient.scan(params4, onScanWisdom);

})

bot.on('ready', () =>{
    fs.access(filePath2020, fs.F_OK, err =>{
        if(err){
            let csvHeaderArray = ["Quote", "Name", "Year"];
            let csvHeader = csvHeaderArray.join(",") + '\n';
            fs.appendFile('quoteList2020.csv', csvHeader, function (err)
                {
                    console.log('Saved!');
                })
            }
            console.log('2020 File already exists. Skipping creation.');
        });

    fs.access(filePath2021, fs.F_OK, err =>{
        if(err){
            let csvHeaderArray = ["Quote", "Name", "Year"];
            let csvHeader = csvHeaderArray.join(",") + '\n';
            fs.appendFile('quoteList2021.csv', csvHeader, function (err)
                {
                    console.log('Saved!');
                })
            }    
            console.log('2021 File already exists. Skipping creation.');
        });

    fs.access(filePath2022, fs.F_OK, err =>{
            if(err){
            let csvHeaderArray = ["Quote", "Name", "Year"];
            let csvHeader = csvHeaderArray.join(",") + '\n';
            fs.appendFile('quoteList2022.csv', csvHeader, function (err)
                {
                    console.log('Saved!');
                })
            }    
            console.log('2022 File already exists. Skipping creation.');
        });

    fs.access(worldCupDrawFile, fs.F_OK, err =>{
            if(err){
                let csvHeaderArray = ["Team", "Name", "ID"];
                let csvHeader = csvHeaderArray.join(",") + '\n';
                fs.appendFile('worldCupDraw.csv', csvHeader, function (err)
                {
    
                })
            }
            console.log('World cup draw file already exists. Skipping creation.');
        })
    
    fs.access(availableWorldCupTeams, fs.F_OK, err =>{
            if(err){
                let csvHeaderArray = ["Team"];
                let csvHeader = csvHeaderArray.join(",") + '\n';
                fs.appendFile('availableWorldCupTeams.csv', csvHeader, function (err)
                {
    
                })
            }
            console.log('List of available world cup teams exists. Skipping creation');
        })
    
    fs.createReadStream(worldCupDrawFile)
            .pipe(csv())
            .on('data', (row) =>{
                worldCupPlayers.push(row);
            })
            .on('end', () => {
                console.log(worldCupPlayers);
                console.log("File contained this many players: " + worldCupPlayers.length)
            })
            
    fs.createReadStream(availableWorldCupTeams)
            .pipe(csv())
            .on('data', (row) =>{
                worldCupTeams.push(row);     
            })
            .on('end', () =>{
                console.log(worldCupTeams);
                console.log("File contains this many available teams: " + worldCupTeams.length)
            })
    

    fs.createReadStream('quoteList2020.csv')
        .pipe(csv())
        .on('data', (row) =>{        
            quotesFrom2020.push(row);
            quoteCountFor2020 = quoteCountFor2020 + 1;
            })
        .on('end', () => {
            console.log('2020 Facts Loaded');
            });
    
    fs.createReadStream('quoteList2021.csv')
        .pipe(csv())
        .on('data', (row) =>{
            quotesFrom2021.push(row);
            quoteCountFor2021 = quoteCountFor2021 + 1;
            })
        .on('end', () => {
            console.log('2021 Facts Loaded');
            
        })

    fs.createReadStream('quoteList2022.csv')
        .pipe(csv())
        .on('data', (row) =>{
            quotesFrom2022.push(row);
            quoteCountFor2022 = quoteCountFor2022 + 1;
            })
        .on('end', () => {
            console.log('2022 Facts Loaded');
        })    
})

bot.on('message', message =>{
    if (message.author.bot)
    return;
    if (message.content.toLowerCase().startsWith("<:moomooloox:915898246872846357>"))
    message.channel.send("<:moomooloox:915898246872846357>");

})

bot.on('message', message => {
    let args = message.content.substring(PREFIX.length).toLowerCase().split(" ");
    if(!message.content.startsWith(PREFIX)){
        return;
    }
    switch(args[0]){
        case 'catfact':
            message.channel.send(catFact());
        break;
        case 'personOneFact':
            const daveFactEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Person Fact: ' + personFact())
            .setImage('attachment://PersonMugshot.jpg')
            .setFooter('This intersting factoid was brought to you by Vendi. Vendi - Anything you say can and will be used against you.')
            message.channel.send({embed: PersonFactEmbed, files: [PersonMugshotImage]});
        break;
        case 'personTwoFact':
            const leighFactEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Person Fact: ' + personFact())
            .setImage('attachment://PersonMugshot.jpeg')
            .setFooter('This intersting factoid was brought to you by Vendi. Vendi - Anything you say can and will be used against you.')
            message.channel.send({embed: PersonFactEmbed, files: [PersonMugshotImage]});
        break;
        case 'personThreefact':
            const PersonFactEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Person Fact: ' + personFact())
            .setImage('attachment://PersonMugshot.jpg')
            .setFooter('This intersting factoid was brought to you by Vendi. Vendi - Anything you say can and will be used against you.')
            message.channel.send({embed: PersonFactEmbed, files: [PersonMugshotImage]});
        break;
        case 'help':
            message.channel.send(help());
        break;
        case 'quote':
            switch(args[1]){
                case '2020':
                    message.channel.send(quote2020())
                break;
                case '2021':
                    message.channel.send(quote2021())
                break;
                case '2022':
                    message.channel.send(quote2022())
                break;
            }
        break;
        case 'roll':
                message.channel.send(roll(args[1]));
        break;
        case 'ftl':
            switch(args[1]){
                case 'pickship':
                    if(message.author.id == 645900563166396417){
                        message.channel.send(pickFTLshipSpecificUser())
                    } else {
                        message.channel.send(pickFTLshipAllUsers())
                    }
                break;
            }
        break;
        case 'activateselfdestruct':
            message.channel.send(activateSelfDestruct());
        break;
        case 'abortselfdestruct':
            message.channel.send(abortSelfDestruct());
        break;
        case 'joke':
            message.channel.send(vendiJoke());
        break;
        case 'wisdom':
            message.channel.send(vendiWisdom())
        break;
        case 'stock':
            message.channel.send(vendiStock())
        break;
        case 'beef':
            message.channel.send(beefRoll(args[1], args[2]));
        break;
        case 'feeb':
            message.channel.send(feebRoll(args[1]));
        break;
        case 'bake':
            message.channel.send(bakeRoll());
        break;
        case 'toast':
            toastRequester = message.author.username;
            var toastDelay = Math.random() * (300000 - 60000) + 60000;

            if(toastDelay <= 120000){
                const toastEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(toastRequester + ' your toast is ready')
                .setImage('attachment://bread.png')
                .setFooter('Sorry, it is a little undercooked')
            setTimeout(function(){message.channel.send({embed: toastEmbed, files: [breadImage]})}, toastDelay);
            
            } else if((toastDelay > 120000) && (toastDelay <= 180000)){
                const toastEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(toastRequester + ' your toast is ready')
                .setImage('attachment://toast.jpg')
                .setFooter('perfection :D')
            setTimeout(function(){message.channel.send({embed: toastEmbed, files: [toastImage]})}, toastDelay);
            
            } else if((toastDelay > 180000) && (toastDelay <= 240000)){
                const toastEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(toastRequester + ' your toast is ready')
                .setImage('attachment://burnetToast.jpg')
                .setFooter('uhoh, I think I left it in a little too long')
            setTimeout(function(){message.channel.send({embed: toastEmbed, files: [burntToastImage]})}, toastDelay);
            
            } else if ((toastDelay > 240000) && (toastDelay <=300000)){
                const toastEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(toastRequester + ' your toast is ready')
                .setImage('attachment://pileOfAsh.png')
                .setFooter('...I....am not sure what to say...')
            setTimeout(function(){message.channel.send({embed: toastEmbed, files: [pileOfAshImage]})}, toastDelay);
            
            }
        break;
        case 'drawteam':
            message.channel.send(drawTeam(message.author.id, message.member.user.tag));
        break;
        }
})

bot.on('message', message =>{
    
    var validMessage = false;
    var nameAndYear;
    var result = [];
    
    if(message.content.includes('" -')){
        validMessage = true;
    }
    if(message.content.includes('" ~')){
        validMessage = true;
    }
    
    if (message.author.bot)
        return;
    if(validMessage){

        let quoteToAddTest = message.content.split(" - ");
        if(quoteToAddTest.length === 1) {
            quoteToAddTest = message.content.split(" ~ ");
        }

        if(quoteToAddTest.length > 1) {
            nameAndYear = quoteToAddTest[1].split(" ");

            if(nameAndYear.length > 1) {
                result.push(quoteToAddTest[0]);
                result.push(nameAndYear[0]);
                result.push(nameAndYear[1]);
            } 
        }
        result += '\n';

        quotesFrom2022.push(result);
        console.log('Quote array is now: ' + quotesFrom2022.length)
        fs.appendFile('quoteList2022.csv', result, function(err){
            if (err) 
            {
                throw err;
            }
            console.log('Quote added to file');  
        })
        
    }
})

function catFact(){
    
    let randomFact = catFacts.random();
    return randomFact;
}

function personFact(){

    var luckyWinner = Math.floor(Math.random()* personFactTotal);
    var winningFact = personFactArray[luckyWinner];
    return winningFact;

}

function vendiJoke(){
    var luckyWinner = Math.floor(Math.random()* vendiJokeTotal);
    var winningJoke = vendiJokeArray[luckyWinner];
    return winningJoke;
}

function vendiWisdom(){
    var luckyWinner = Math.floor(Math.random()* vendiWisdomTotal);
    var winningQuote = vendiWisdomArray[luckyWinner];
    return winningQuote;
}

function help(){

    helpMessage = ('VendiChan can currently respond to the following commands');
    helpMessage += (' \!quote followed by a year, eg !quote 2020, to get a random quote from that year');
    helpMessage += '\n';
    helpMessage += (' \!catfact to receive a random fact about cats');
    helpMessage += '\n';
    helpMessage += (' \!<name>fact to receive a random fact about the person chosen. e.g !davefact to get a fact about Dave');
    helpMessage += '\n';
    helpMessage += ('\!joke to receive a random joke.');
    helpMessage += '\n';
    helpMessage += ('\!wisdom to receive a helpful bit of philosophical motivation.');
    helpMessage += '\n';
    helpMessage += ('\!fact to learn some not widely known truths about certain events.');
    helpMessage += '\n';
    helpMessage += ('\!roll followed by a number to roll a dice of that many sides.');
    helpMessage += '\n';
    helpMessage += ('\!activateselfdestruct to activate the self destruct function....We\'re not sure what exactly it is connected to...');
    helpMessage += '\n';
    helpMessage += ('\!abortselfdestruct to deactivate the self destruct');
    helpMessage += '\n';
    helpMessage += ('!ftl pickship to choose a random FTL ship for your run.');
    helpMessage += '\n';
    helpMessage += ('!patchnotes to see the latest updates made to Vendi. If dev hasn\'t been too lazy to maintain it.');
    helpMessage += ('\n');
    helpMessage += ('!beef to receive a random equation. You can also define what words to use. e.g <!beef cat dog> ');
    helpMessage += ('\n');
    helpMessage += ('!toast to toast some delicious bread')

    return helpMessage;

}

function roll(diceRoll){
    
    let firstString = diceRoll;
    var seperators = ['d','D','\\\+','-'];
    var splitString = firstString.split(new RegExp(seperators.join('|')));
    splitString.forEach(entry => {

        console.log(entry);
    });

    arrayLength = splitString.length;
    console.log("array length " + arrayLength);
    firstNumber = parseInt(splitString[0]);
    secondNumber = parseInt(splitString[1]);
    thirdNumber = 0;

    rollResult = 0;
    operatorIsPlus = 0;
    result = 0;

    if(arrayLength === 1 && !isNaN(firstNumber)){
        randomRoll = Math.floor(Math.random() * firstNumber) + 1;
        result = ("You rolled: " + randomRoll);
        return result;
    }

    if(arrayLength >= 3){
        
        thirdNumber = parseInt(splitString[2]);
        
    }

    console.log("parse int log " + parseInt(splitString[2]));
    if(isNaN(parseFloat(firstNumber)) || isNaN(parseFloat(secondNumber)) || isNaN(parseFloat(thirdNumber))){
        result = ("Something seems to have been incorrectly entered. Please enter your roll like this: 1d20 or 2d6+2 or 3d8-5 ");
        return result;
    }

    console.log("\n" + firstNumber + " " + secondNumber + " " + thirdNumber + " ");

    if(firstNumber > 100 || secondNumber > 100 || thirdNumber > 100){
        result = ("Please use a number 100 or less. It's for my sanity.");
        return result;
    }

    if(secondNumber === 0){
        result = ("A d0? Are you shitting me?");
        return result;
    }

    if(secondNumber < 0){
        result = ("I feel like you are trying to break me...");
        return result;
    }

    if(firstString.includes('+') && (firstString.includes('-'))){ 
        operatorIsPlus = 2;
    }else if(!firstString.includes('+') && (!firstString.includes('-'))){
        operatorIsPlus = 0;
    }
    else if(firstString.includes('+') && (!firstString.includes('-'))){
        operatorIsPlus = 1;
    } 
    else if(!firstString.includes('+') && (firstString.includes('-'))){
        operatorIsPlus = 2;
    }

    console.log("Operator is: " + operatorIsPlus);

    if(operatorIsPlus === 0){
        console.log("We have no modifier")
        for(i = 0; i <  firstNumber; i++){
            randomResult = Math.floor(Math.random()* secondNumber) +1;
            console.log("Random number rolled is: " + randomResult);
            rollResult += randomResult;
        }

        result = ("You rolled: " + rollResult);
        console.log("Total is: " + result);
    }
    else if(operatorIsPlus === 1){
        console.log("We have a positive modifer");
        for(i = 0; i <  firstNumber; i++){
            randomResult = Math.floor(Math.random() * secondNumber) +1;
            console.log("Random number rolled is: " + randomResult);
            rollResult += randomResult;
        }

        result = rollResult;
        console.log("Total is: " + result);
        result = ("You rolled " + rollResult + ". With your modifier that's: " + (result + thirdNumber));
        console.log("With your modifier that is: " + result);

    } 
    else if(operatorIsPlus === 2){
        console.log("We have a negative modifer");
        for(i = 0; i <  firstNumber; i++){
            randomResult = Math.floor(Math.random() * secondNumber) +1;
            console.log("Random number rolled is: " + randomResult);
            rollResult += randomResult;
        }

        result = rollResult;
        console.log("Total is: " + result);
        result = ("You rolled " + rollResult + ". With your modifier that's: " + (result - thirdNumber));
        console.log("With your modifier that is: " + result);
    }

    return result;
}

function quote2020(){

    let luckyWinner2020 = Math.floor(Math.random()* quoteCountFor2020);
    var winningQuote2020 = quotesFrom2020[luckyWinner2020];
    var quoteMessage2020 = ("\"" + winningQuote2020.Quote + "\" - " + winningQuote2020.Name + " " + winningQuote2020.Year);

    return quoteMessage2020;
}

function quote2021(){

    let luckyWinner2021 = Math.floor(Math.random()* quoteCountFor2021);
    var winningQuote2021 = quotesFrom2021[luckyWinner2021];
    var quoteMessage2021 = ("\"" + winningQuote2021.Quote + "\" - " + winningQuote2021.Name + " " + winningQuote2021.Year);

    return quoteMessage2021;
}

function quote2022(){

    let luckyWinner2022 = Math.floor(Math.random() * quoteCountFor2022);
    var winningQuote2022 = quotesFrom2022[luckyWinner2022];
    var quoteMessage2022 = ("\"" + winningQuote2022.Quote + "\" - " + winningQuote2022.Name + " " + winningQuote2022.Year);

    return quoteMessage2022;
}

function activateSelfDestruct(){
    var selfDestructMessage;

    if(!selfDestructActivated){
        selfDestructActivated = true;
        selfDestructMessage = 'Self destruct has been activated. Good luck team ^_^';
    } else {
        selfDestructMessage = 'Do not worry, the end is coming ^_^';
    }
    return selfDestructMessage;
}

function abortSelfDestruct(){
    var abortMessage;

    if(selfDestructActivated){
        selfDestructActivated = false;
        abortMessage = 'Self destruct deactivated.';
    } else {
        abortMessage = 'Self destruct is not currently active';
    }
    return abortMessage;
}

function pickFTLshipSpecificUser(){
    
    var luckyWinner = Math.floor(Math.random()* ftlShipArraySpecificUserVersion.length);    
    var returnMessage = ftlShipArraySpecificUserVersion[luckyWinner];

    return returnMessage;
}

function pickFTLshipAllUsers(){
    
    var luckyWinner = Math.floor(Math.random()* ftlShipArray.length);
    var returnMessage = "Take the " + ftlShipArray[luckyWinner] + " cruiser. Good luck!";

    return returnMessage;
}

function onScan(err, data){

    if(err) {
        console.log("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Scan Succeeded.");
        data.Items.forEach(function(FriendFact) {
            
            //switch statement to apply facts to arrays. Can probably be done in a better way. Look to mprove this
            switch(FriendFact.FriendName){
                case "FriendOne":
                    friendOneFactArray.push(FriendFact.Fact)
                    friendOneFactTotal = friendOneFactTotal+1;
                break;
                case "FriendTwo":
                    friendTwoFactArray.push(FriendFact.Fact)
                    friendTwoFactTotal = friendTwoFactTotal+1;
                break;
                case "FriendThree":
                    friendThreeFactArray.push(FriendFact.Fact)
                    friendThreeFactTotal = friendThreeFactTotal+1;
                break;
                case "FriendFour":
                    friendFourFactArray.push(FriendFact.Fact)
                    friendFourFactTotal = friendFourFactTotal+1;
                break;
                case "FriendFive":
                    friendFiveFactArray.push(FriendFact.Fact)
                    friendFiveFactTotal = friendFiveFactTotal+1;
                break;
                case "FriendSix":
                    friendSixFactArray.push(FriendFact.Fact)
                    friendSixFactTotal = friendSixFactTotal+1;
                break;
                case "FriendSeven":
                    friendSevenFactArray.push(FriendFact.Fact)
                    friendSevenFactTotal = friendSevenFactTotal+1;
                break;
                case "FriendEight":
                    friendEightFactArray.push(FriendFact.Fact)
                    friendEightFactTotal = friendEightFactTotal+1;
                break;
                case "FriendNine":
                    friendNineFactArray.push(FriendFact.Fact)
                    friendNineFactTotal = friendNineFactTotal+1;
                break;
                case "FriendTen":
                    friendTenFactArray.push(FriendFact.Fact)
                    friendTenFactTotal = friendTenFactTotal+1;
                break;
                case "FriendEleven":
                    friendElevenFactArray.push(FriendFact.Fact)
                    friendElevenFactTotal = friendElevenFactTotal+1;
                break;
                case "FriendTwelve":
                    friendTwelveFactArray.push(FriendFact.Fact)
                    friendTwelveFactTotal = friendTwelveFactTotal+1;
                break;
                case "FriendThirteen":
                    friendThirteenFactArray.push(FriendFact.Fact)
                    friendThirteenFactTotal = friendThirteenFactTotal+1;
                break;
            }
            
        });
    }
}

function onScanJokes(err, data){
    if(err){
        console.log("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Jokes loaded")
        data.Items.forEach(function(VendiJokes){
            vendiJokeArray.push(VendiJokes.joke)
            vendiJokeTotal = vendiJokeTotal+1;
        });
    }
    //console.log(vendiJokeArray);
}

function onScanWisdom(err, data){
    if(err){
        console.log("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Wisdom loaded")
        data.Items.forEach(function(VendiWisdom){
            vendiWisdomArray.push(VendiWisdom.wisdomQuote)
            vendiWisdomTotal = vendiWisdomTotal+1;
        });
    }
    //console.log(vendiWisdomArray);
}

function beefRoll(wordOne, wordTwo){
    
    var firstWord = wordOne;
    var secondWord = wordTwo;
    var finalMessage;

    if(firstWord == null){
        var resultOne = Math.floor(Math.random()* beefWordArray.length);
        var firstWinningWord = beefWordArray[resultOne];
        firstWord = firstWinningWord;
    }
    
    if(secondWord == null){
        var resultTwo = Math.floor(Math.random()* beefWordArray.length);
        var secondWinningWord = beefWordArray[resultTwo];
        secondWord = secondWinningWord;
    }

    finalMessage = "The thing about " + firstWord + ", is that you get " + secondWord + " at the end of it.";

    return finalMessage;
}

function feebRoll(wordOne){
    
    var endingWord = wordOne;

    if(endingWord == null){
        endingWord = "-redacted-";

    }

    var beginningWord;
    var finalMessage;

    var result = Math.floor(Math.random()* beefWordArray.length);
    var winningWord = beefWordArray[result];

    beginningWord = winningWord;

    finalMessage = "The thing about " + beginningWord + ", is that you get " + endingWord + " at the end of it.";

    return finalMessage;
}

function cookToast(user){
    var toastAsker = user
    var toastReadyMessage = toastAsker + " your toast is ready.";
    return toastReadyMessage;
}

function bakeRoll(){
    var luckyWinner = Math.floor(Math.random()* bakeArray.length);    
    var returnMessage = bakeArray[luckyWinner];

    return returnMessage;
}

function drawTeam(messageAuthorID, messageAuthorName){
    var drawUserID = "";
    var drawUserName = "";

    drawUserID = messageAuthorID;
    console.log("User ID: " + drawUserID + " ID as gotten from the method call: " + messageAuthorID);
    drawUserName = messageAuthorName;
    var filteredResult = [];
    console.log("Filtered ID result at start of function: " + filteredResult);
    var filteredResultCount = 0;
    console.log("Filtered result count at start of function: " + filteredResultCount);

    //Test for each row in worldCupPlayers to see what's inside these variables:
    worldCupPlayers.forEach(function(IDcheck){
        //console.log(IDcheck)
        console.log(IDcheck.ID)
        console.log(":")
        console.log(drawUserID)
        //console.log(drawUserID.ID)
    })

    //IDcheck.id returns undefined because the property is called ID (upper case).
    //drawUserID.ID returns undefined because it doesn't exist. You need just drawUserID which is a string not an object.

    filteredResult = worldCupPlayers.filter(function (IDcheck) {
        return IDcheck.ID === drawUserID;
    });

    for (i = 0; i < filteredResult.length; i++) {
        console.log(filteredResult[i]);
    }

    filteredResultCount = filteredResult.length;
    console.log("Filtered ID result after function has run: " + filteredResult);
    console.log("Filtered content array count after function has run: " + filteredResultCount);

    if (filteredResultCount > 1){
        console.log("This person has already selected 2 teams");

        teamMessage = "You have already selected 2 teams";
        return teamMessage;

    } 
    else 
    {

    var luckyWinner = Math.floor(Math.random()* worldCupTeams.length);
    var selectedWorldCupTeam = (worldCupTeams[luckyWinner]);
    worldCupTeams.splice(luckyWinner, 1);

    var teamMessage = ("You selected: " + selectedWorldCupTeam.Team);
    worldCupArrayTotal = worldCupArrayTotal-1;

    console.log(worldCupArrayTotal);
    console.log(worldCupTeams);
    console.log(selectedWorldCupTeam.Team + " was selected by user: " + drawUserName + " " + drawUserID);

    writeWorldCupJSON(selectedWorldCupTeam.Team, drawUserName, drawUserID);
    worldCupPlayers.push({Team: selectedWorldCupTeam, Name: drawUserName, ID: drawUserID});

    //worldCupTeamsAfter = worldCupTeams.toString();

    /*fs.access('availableTeamList.csv', worldCupTeamsAfter, function(err){
        let csvHeaderArray = ["Team"];
        let csvHeader = csvHeaderArray.join(",") + '\n';

        fs.writeFile('availableTeamList.csv', csvHeader, function(err)){

        }

        if(err)
        {
            throw err;
        }
    })*/

    return teamMessage;

    }
    
}

function writeWorldCupJSON(drawTeam, drawUsername, drawUserID){

    var worldCupTeam = drawTeam;
    var worldCupUsername = drawUsername;
    var worldCupUserID = drawUserID;
    var worldCupDrawEntry = [];

    worldCupDrawEntry.push(worldCupTeam);
    worldCupDrawEntry.push(worldCupUsername);
    worldCupDrawEntry.push(worldCupUserID);

    worldCupDrawEntry += '\n';

    fs.appendFile('worldCupDraw.csv',worldCupDrawEntry,function(err){
        if(err)
        {
            throw err;
        }
    })

}

/*function assignRemainingTeams(channel) {
    const teamsToDraw = worldCupTeams.length;
    let selectedTeam;
    let selectedPlayer;

    for (var i = 0; i < teamsToDraw; i++) {
        var luckyWinnerTeam = Math.floor(Math.random()* worldCupTeams.length);
        selectedTeam = worldCupTeams[luckyWinnerTeam];
        console.log(`Lucky Winner: ${selectedTeam.Team}`);
        worldCupTeams.splice(luckyWinnerTeam, 1);
        console.log(worldCupTeams);

        if (worldCupPlayersIn.length > 0) {
            var luckyWinnerPlayer = Math.floor(Math.random()* worldCupPlayersIn.length);
            selectedPlayer = worldCupPlayersIn[luckyWinnerPlayer];
            console.log(`Lucky Winner: ${selectedPlayer}`);
            worldCupPlayersIn.splice(luckyWinnerPlayer, 1);
            console.log(worldCupPlayersIn);
        } else {
            //WorldCupPlayers now all empty (everyone got a team, assigning the next round)
            var luckyWinnerPlayer = Math.floor(Math.random()* worldCupPlayersInRoundTwo.length);
            selectedPlayer = worldCupPlayersInRoundTwo[luckyWinnerPlayer];
            console.log(`Lucky Winner: ${selectedPlayer}`);
            worldCupPlayersInRoundTwo.splice(luckyWinnerPlayer, 1);
            console.log(worldCupPlayersInRoundTwo);
        }

        writeWorldCupJSON(selectedTeam.Team, selectedPlayer, 'Automated Draw');
        channel.send(`${selectedPlayer} has been assigned Team ${selectedTeam.Team}`);
    }
}*/

function vendiStock(){
    var stockmessage;

    stockMessage=("I currently know....");
    stockMessage+= '\n';
    stockMessage+=(vendiJokeTotal + " Jokes");
    stockMessage+= '\n';
    stockMessage+=(vendiWisdomTotal + " pieces of wisdom");
    stockMessage+= '\n';
    stockMessage+=(personOneFactTotal + " facts about person one");
    stockMessage+= '\n';
    stockMessage+=(personTwoFactTotal + " facts about person two");
    stockMessage+= '\n';
    stockMessage+=(personThreeFactTotal + " facts about person three");
    stockMessage+= '\n';
    stockMessage+=(personFourFactTotal + " facts about person four");
    stockMessage+= '\n';
    stockMessage+=(personFiveFactTotal + " facts about person five");
    stockMessage+= '\n';
    stockMessage+=(personSixFactTotal + " facts about person six");
    stockMessage+= '\n';
    stockMessage+=(personSevenFactTotal + " facts about person seven");
    stockMessage+= '\n';
    stockMessage+=(personEightFactTotal + " facts about person eight");
    stockMessage+= '\n';
    stockMessage+=(personNineFactTotal + " facts about person nine");
    stockMessage+= '\n';
    stockMessage+=(personTenFactTotal + " facts about person ten");
    stockMessage+= '\n';
    stockMessage+=(personElevenFactTotal + " facts about person eleven");
    stockMessage+= '\n';
    stockMessage+=(personTwelveFactTotal + " facts about person twelve");
    stockMessage+= '\n';
    stockMessage+=(personThirteenFactTotal + " facts about person thirteen");
    stockMessage+= '\n';
    stockMessage+=(vendiFactTotal + " facts about me");
    stockMessage+= '\n';
    stockMessage+=(flufflesFactTotal + " facts about Fluffles");
    stockMessage+= '\n';
    stockMessage+=(quoteCountFor2020 + " quotes from 2020");
    stockMessage+= '\n';
    stockMessage+=(quoteCountFor2021 + " quotes from 2021");
    stockMessage+= '\n';
    stockMessage+=(quoteCountFor2022 + " quotes from 2022");
    stockMessage+= '\n';
    stockMessage+=("...wow, thats a lot of stuff. Thanks for all the donations but I need more!!!");

    return stockMessage;

}

bot.login(token);
