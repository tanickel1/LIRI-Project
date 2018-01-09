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

//this method will return bands/artists found in the Spotify API
  var findBands = function(artist) {
    return artist.name;
  };

//this method will return song titles found in the Spotify API
  var findSongs = function(songTitle) {
    if (songTitle === undefined) {
      songTitle = 'The Sign';
    };

    spotify.search({ type: 'track', query: songTitle }, function(err, data) {
        if (err) {
          console.log('Error occurred: ' + err);
          return;
        }

        var songs = data.tracks.items;
        var data = []; 
        //for loop to put info in var data 
        for (var i = 0; i < songs.length; i++) {
          data.push({
            'artist(s)': songs[i].artists.map(findBands),
            'song name: ': songs[i].name,
            'preview song: ': songs[i].preview_url,
            'album: ': songs[i].album.name,
          });
        }
        console.log(data);
        printToLog(data); //logging data to log.txt as references above. 
      });
};

//this method pulls info requested from twitter, maxing out at the last 10 tweets, info from tangoalphanov. 
var pullTweets = function() {
    var client = new twitter(keys.twitterKeys);
      
    var params = { screen_name: 'tangoalphanov', count: 10 };
      
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      
        if (!error) {
            var data = []; 
            for (var i = 0; i < tweets.length; i++) {
                data.push({
                    'created at: ' : tweets[i].created_at,
                    'Tweets: ' : tweets[i].text,
                });
            }
            console.log(data);
            printToLog(data); //logging data to log.txt as references above.
        }
    });
};

//this method finds movie names and returns info from OMDB
var findMovies = function(movieName) {

    if (movieName === undefined) {
      movieName = 'Mr Nobody';
    }
  
    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";
  
    request(urlHit, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = [];
        var jsonData = JSON.parse(body);
  
        data.push({
          'Title: ' : jsonData.Title,
          'Year: ' : jsonData.Year,
          'Rated: ' : jsonData.Rated,
          'IMDB Rating: ' : jsonData.imdbRating,
          'Country: ' : jsonData.Country,
          'Language: ' : jsonData.Language,
          'Plot: ' : jsonData.Plot,
          'Actors: ' : jsonData.Actors,
          'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
          'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
        });
        console.log(data);
        printToLog(data); //logging data to log.txt as references above.
      }
    });
  }

var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(err, data){
        console.log(data);
        printToLog(data); //logging data to log.txt as references above.

        var dataArray = data.split(',')

        if (dataArray.length == 2) {
        pick(dataArray[0], dataArray[1]);
        } else if (dataArray.length == 1) {
        pick(dataArray[0]);
    }
    });
}


//js switch statment for returning the info you are requesting. 
var pick = function(caseData, functionData) {
    switch (caseData) {
      case 'my-tweets':
        pullTweets();
        break;
      case 'spotify-this-song':
        findSongs(functionData);
        break;
      case 'movie-this':
        findMovies(functionData);
        break;
      case 'do-what-it-says':
        doWhatItSays();
        break;
      default:
        console.log('LIRI doesn\'t know that');
    }
  }


//method for running in node. 
  var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
  };
  
  runThis(process.argv[2], process.argv[3]);