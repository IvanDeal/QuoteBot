//This will be Vendichan Mark II. It will be easier to rewrite from scratch at this point I feel. Let's find out
// Created by Ivan Deal

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Requires and Consts
//
// File names and references to real people have been changed.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Discord related Consts
require("dotenv").config();

const Discord = require("discord.js");
const bot = new Discord.Client();

//File Access consts
const csv = require('csv-parser');
const fs = require('fs');

//Files to be loaded. Would probably be better in a database. Then we could do more with them but this is fine for now. AWS is too expensive
//Quote CSV files first
const filePath2020 = './csvfiles/someCSVFile.csv';
const filePath2021 = './csvfiles/anotherCSVFile.csv';
const filePath2022 = './csvfiles/andAnotherCSVFile.csv';
const filePath2023 = './csvfiles/fourthCSVFile.csv';

//Friend Facts

const filePathFriendFacts = './csvfiles/differentCSVFile.csv';

//Misc consts
const PREFIX = '!';

//variables for use in later functions. These will mostly be prepopulated arrays
var beefWordArray = ["Array Entry #1", "Array Entry #2", "Array Entry #3"];

bot.login(process.env.BOT_TOKEN);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  
// Main Code
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Global Variables for function use
var quoteCountFor2020 = 0;
var quotesFrom2020 = [];

var quoteCountFor2021 = 0;
var quotesFrom2021 = [];

var quoteCountFor2022 = 0;
var quotesFrom2022 = [];

var quoteCountFor2023 = 0;
var quotesFrom2023 = [];

var friendFactsList = [];
var friendFactCount = 0;
var filteredArray = [];

// Things to do when starting the app
// Load the files and populate the variables.

bot.on('ready', () =>{

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Start of File processing
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //Accessing the files
    fs.access(filePath2020, fs.F_OK, err =>{
        if(err){
            console.log("Quote list CSV file for 2020 does not exist and could not be loaded. Please create file then reload the application")
        }
    })

    fs.access(filePath2021, fs.F_OK, err =>{
        if(err){
            console.log("Quote list CSV file for 2021 does not exist and could not be loaded. Please create file then reload the application")
        }
    })

    fs.access(filePath2022, fs.F_OK, err =>{
        if(err){
            console.log("Quote list CSV file for 2022 does not exist and could not be loaded. Please create file then reload the application")
        }
    })

    fs.access(filePath2023, fs.F_OK, err =>{
        if(err){
            console.log("Quote list CSV file for 2023 does not exist and could not be loaded. Please create file then reload the application")
        }
    })

    fs.access(filePathFriendFacts, fs.F_OK, err =>{
        if(err){
            console.log("CSV file for friend facts does not exist and could no be loaded. Please create file then reload the application")
        }
    })

    // Reading the files and populating the variables

    fs.createReadStream(filePath2020)
        .pipe(csv())
        .on('data', (row) =>{
            quotesFrom2020.push(row);
            quoteCountFor2020++;
        })
        .on('end', () => {
            console.log("Quotes from 2020 successfuly processed.");
            console.log(quoteCountFor2020 + " quotes from 2020 have been loaded");
        })

    fs.createReadStream(filePath2021)
        .pipe(csv())
        .on('data', (row) =>{
            quotesFrom2021.push(row);
            quoteCountFor2021++;
        })
        .on('end', () => {
            console.log("Quotes from 2021 successfuly processed.");
            console.log(quoteCountFor2021 + " quotes from 2021 have been loaded");
        })

    fs.createReadStream(filePath2022)
        .pipe(csv())
        .on('data', (row) =>{
            quotesFrom2022.push(row);
            quoteCountFor2022++;
        })
        .on('end', () => {
            console.log("Quotes from 2022 successfuly processed.");
            console.log(quoteCountFor2022 + " quotes from 2022 have been loaded");
        })

    fs.createReadStream(filePath2023)
        .pipe(csv())
        .on('data', (row) =>{
            quotesFrom2023.push(row);
            quoteCountFor2023++;
        })
        .on('end', () => {
            console.log("Quotes from 2023 successfuly processed.");
            console.log(quoteCountFor2023 + " quotes from 2020 have been loaded");
        })

    fs.createReadStream(filePathFriendFacts)
        .pipe(csv())
        .on('data', (row) =>{
            if(friendFactsList.push(row)){
                friendFactCount++;
            };           
        })
        .on('end', () =>{
            console.log("FriendFacts successfully loaded.");
            console.log(friendFactCount + " facts about friends have been loaded");
        })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // End of file processing
    //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    console.log("Everything seems good. I'm Ready to go!");
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// What do check for when someone posts a message
// This will be mostly used for user commands
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


bot.on('message', message =>{

    let args = message.content.substring(PREFIX.length).toLowerCase().split(" ");

    if(!message.content.startsWith(PREFIX)){
        return;
    }
    switch(args[0]){
        //case '':
        //do the thing
        //break;
        case 'quote':
            message.channel.send(quote(args[1]))
        break;
        case 'help':
            message.channel.send(helpMenu())
        break;
        case 'addquote':
            if(message.author.bot){
                break;
            }
            message.channel.send(addQuote(message.content));
        break;
        case 'fact':
            message.channel.send(friendFactRoll(args[1]));
        break;
        case 'beef':
            message.channel.send(beefRoll(args[1], args[2]));
        break;
        case 'feeb':
            message.channel.send(feebRoll(args[1]));
        break;
        case 'magic8ball':
        case 'magiceightball':
            message.channel.send(eightBall());
        break;
        case 'toast':
        break;
    }

})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// All the functions
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function quote(year){
    var luckyWinner;
    var winningQuote;
    var returnMessage;

    if(year === '2020'){
        console.log("Year 2020 selected.")
        luckyWinner = Math.floor(Math.random()* quoteCountFor2020);
        winningQuote = quotesFrom2020[luckyWinner];
        returnMessage = ("\"" + winningQuote.Quote + "\" - " + winningQuote.Name + " " + winningQuote.Year);
        console.log("Final message to return is: " + returnMessage);
    } else if(year === '2021'){
        console.log("Year 2021 selected.")
        luckyWinner = Math.floor(Math.random()* quoteCountFor2021);
        winningQuote = quotesFrom2021[luckyWinner];
        returnMessage = ("\"" + winningQuote.Quote + "\" - " + winningQuote.Name + " " + winningQuote.Year);
        console.log("Final message to return is: " + returnMessage);
    } else if(year === '2022'){
        console.log("Year 2022 selected.")
        luckyWinner = Math.floor(Math.random()* quoteCountFor2022);
        winningQuote = quotesFrom2022[luckyWinner];
        returnMessage = ("\"" + winningQuote.Quote + "\" - " + winningQuote.Name + " " + winningQuote.Year);
        console.log("Final message to return is: " + returnMessage);
    } else if(year === '2023'){
        console.log("Year 2023 selected.")
        luckyWinner = Math.floor(Math.random()* quoteCountFor2023);
        winningQuote = quotesFrom2023[luckyWinner];
        returnMessage = ("\"" + winningQuote.Quote + "\" - " + winningQuote.Name + " " + winningQuote.Year);
        console.log("Final message to return is: " + returnMessage);
    } else {
        returnMessage = "I'm sorry, either that wasn't a valid year or I don't have any quotes for it yet.";
    }

    return returnMessage;
}

function addQuote(content){
    //content contains the full content of the message including the command. e.g !addquote "Potato" - Dave EveryDamnDay
    var validMessage = false;
    var quoteContent = content;
    var stringA; //stringA will be the quote itself. Might rename the variable to avoid confusion
    var stringB; //stringB will be the symbol that is used. Either - or ~ and the name and year. This will then be divided further
    var result = [];
    var quoteSaveMessage = "";

    console.log("Quote message receieved: " + content)
    console.log("Quote data added to local variable to be tested for validity: " + quoteContent)

    if(quoteContent.includes('" -')){
        validMessage = true
    }

    if(quoteContent.includes('" ~')){
        validMessage = true
    }
    
    console.log("Message is valid? " + validMessage)

    if(validMessage){
        stringA = quoteContent.substring(
            quoteContent.indexOf("\"") + 1,
            quoteContent.lastIndexOf("\"")
        );
        console.log("String A: " + stringA);

        if(quoteContent.includes('" -')){
            stringB = quoteContent.substring(
                quoteContent.indexOf("-") + 1
            )
        }

        if(quoteContent.includes('" ~')){
            stringB = quoteContent.substring(
                quoteContent.indexOf("~") + 1
            )
        }

        var stringBsplit = stringB.split(" ");
        stringBsplit.forEach(entry =>{
            console.log("array entry 0 " + stringBsplit[0]);
            console.log("array entry 1 " + stringBsplit[1]);
            console.log("array entry 2 " + stringBsplit[2]);
            console.log(entry);

        })

        var quoteYear = parseInt(stringBsplit[2]);
        var quoteName = stringBsplit[1];

        console.log("Quote to be added is: " + stringA)
        console.log("Quote name to be added is: " + quoteName)
        console.log("Quote year to be added is: " + quoteYear)

        result.push(stringA);
        result.push(quoteName);
        result.push(quoteYear);

        result += '\n';

        //another check to make sure the quote is valid. If the quote doesn't parse correctly then the year won't be valid and it wont bother writing to array or CSV
        if(quoteYear === 2023){
            quotesFrom2023.push(result);
            console.log("Quote array now contains this many: " + quotesFrom2023.length);
            fs.appendFile(filePath2023, result, function(err){
                if(err)
                {
                    throw err;
                }
                console.log("Quote passed the validity check to see if it is valid for this year and has been added to file");
                
            })
            quoteSaveMessage = "Saved.";
        } else {
            console.log("quote was not valid. I'm ignoring that.");  
            quoteSaveMessage = "Quote wasn't valid. Is something wrong with the formatting?";
        }
        
    } else {
        quoteSaveMessage = "Quote wasn't valid. Is something wrong with the formatting?";
    }
    return quoteSaveMessage;
}

function helpMenu(){
    
    var helpMessage;

    helpMessage = "These are the commands for Vendi Mk2";
    helpMessage += '\n';
    helpMessage += "Currently Vendi responds to these commands: ";
    helpMessage += '\n';
    helpMessage += '\n';
    helpMessage += "!help";
    helpMessage += '\n';
    helpMessage += "Shows a list of all the current commands Vendi can process."
    helpMessage += '\n';
    helpMessage += '\n';
    helpMessage += "!quote followed by a year. E.g. !quote 2020";
    helpMessage += '\n';
    helpMessage += "This command returns a quote from the year specified";
    helpMessage += '\n';
    helpMessage += '\n';
    helpMessage += "!addquote followed by the quote, name and year. e.g. !addquote \"someone said a funny\" - person 2023";
    helpMessage += '\n';
    helpMessage += "This will save the quote for later use";
    helpMessage += '\n';
    helpMessage += '\n';
    helpMessage += "!beef can either be used with a word, two words or no words. E.g. !beef, !beef steak or !beef steak happy";
    helpMessage += '\n';
    helpMessage += '\n';
    helpMessage += "!feeb also exists. It's like beef but backwards.";
    helpMessage += '\n';
    helpMessage += '\n';
    helpMessage += "!magic8ball can be used to extract wisdom or future readings in the form of quotes. Use with caution.";
    helpMessage += '\n';
    helpMessage += '\n';
    
    return helpMessage;

}

function friendFactRoll(friendName){
    var factMessage = "";
    
    nameToUseForFilter = friendName;
    friendFactFilter(nameToUseForFilter);
    console.log("There are this many items in the array: " + filteredArray.length)
    if(filteredArray.length === 0){
        factMessage = "I'm sorry, it appears I don't have any facts for this person.";
    } else if(filteredArray.length >= 1){
        var luckyWinner = Math.floor(Math.random()* filteredArray.length);
        var winningFact = filteredArray[luckyWinner];
        factMessage = winningFact.Fact;
    }

    return factMessage;

}

function friendFactFilter(friendName){

    //logic here is going to be, take the friendfact array. Loop through it to find all that match and put them into a local funtion array. Then use the local array to choose the fact.
    //will also use the friend chosen to generate the discord embed
    filteredArray = [];
    var nameToUse = friendName;
    var currentFact;
    var currentFactName;
    
    for(let i = 0; i < friendFactsList.length; i++){

        currentFact = friendFactsList[i];

        currentFactName = currentFact.FriendName.toLowerCase();

        if(currentFactName === nameToUse){
            console.log("Friend name of current fact is: " + currentFactName);
            filteredArray.push(currentFact);
        } else {
            console.log("Ignoring this fact as the names don't match");
        }
    }
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

//probably won't change this for now. Doesn't really need to use 2023 for prophetic thoughts
function eightBall(){

    var returnMessage = "";

    var whichArrayToUse = Math.floor((Math.random()* 3) + 1);
    
    if(whichArrayToUse == 1)
    {
        returnMessage = quote('2020');
    } 
    else if (whichArrayToUse == 2)
    {
        returnMessage = quote('2021');
    } 
    else if (whichArrayToUse == 3)
    {
        returnMessage = quote('2022');
    } 
    else  if (whichArrayToUse == 4)    
    {
        returnMessage = quote('2023');
    }
    console.log("Eightball array to use is: " + whichArrayToUse)

    return returnMessage;
}