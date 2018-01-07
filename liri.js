var keys = require("./keys.js");
var fs = require('fs'); 
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');


//this method will append data to the log.txt file when called in other variables. 
var printToLog = function(data) {
    fs.appendFile("log.txt", '\r\n\r\n');
  
    fs.appendFile("log.txt", JSON.stringify(data), function(err) {
      if (err) {
        return console.log(err);
      }
  
      console.log("log.txt was updated!");
    });
  }

