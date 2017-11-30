//grab data from keys.js
var keys = require("./keys.js");
var command = process.argv[2];

var twitter = require("twitter");
var client = new twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });
//   console.log(keys.twitterKeys.consumer_key);
//   console.log(keys.twitterKeys.consumer_secret);
//   console.log(keys.twitterKeys.access_token_key);
//   console.log(keys.twitterKeys.access_token_secret);
//Include the spotify npm package
var Spotify = require("node-spotify-api");
var spotify = new Spotify({
    id: keys.spotifyKeys.client_id,
    secret: keys.spotifyKeys.client_secret
});
// console.log(keys.spotifyKeys.client_id);
// console.log(keys.spotifyKeys.client_secret);
// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");

// Store all of the arguments in an array
var nodeArgs = process.argv;

// Create an empty variable for holding the song name
var songName = "";

// Create an empty variable for holding the movie name
var movieName = "";

// fs is a core Node package for reading and writing files
var fs = require("fs");

//commands
switch (command) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("I don't understand you command");
}

function myTweets(){
    client.get("statuses/user_timeline", function(error, tweets, response){
        if (error){
            return console.log(error);
        }
        for(var i=0; i<tweets.length; i++){
            if(tweets[i].text!=="undefined"){
                var j=i+1;
                console.log(j+". "+tweets[i].text+" Time created: "+tweets[i].user.created_at);
                
            } else {
                tweets[i].text = "null";
                console.log(i+". "+tweets[i].text+tweets[i].user.created_at);
            }          
        }
    })
};

function spotifyThisSong(){
    for (var i = 3; i < nodeArgs.length; i++) {  
        if (i > 3 && i < nodeArgs.length) {
          songName = songName + "+" + nodeArgs[i];
          console.log(songName);
        }
        else {
          songName += nodeArgs[i];
        }
      }
  if(songName===""){
      songName = "The Sign";
  }  
  console.log(songName);
  spotify.search({type:'track', query: songName}, function(err, data) {
    if(err){
        return console.log(err);
    }
    // console.log(data);
    for(var x=0;x<5;x++){
        console.log(x+1);
        console.log("Artist: "+ data.tracks.items[x].album.artists[0].name);
        console.log("Song's name: "+data.tracks.items[x].name);
        console.log("Preview link of the song from Spotify: "+data.tracks.items[x].preview_url);
        console.log("From album: "+data.tracks.items[x].album.name);
    }
  });
};

function movieThis(){
    for (var i = 3; i < nodeArgs.length; i++) {  
          if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];
            console.log(movieName);
          }
          else {
            movieName += nodeArgs[i];
          }
        }
    if(movieName===""){
        movieName = "Mr.Nobody";
    }  
        // Then run a request to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        
        // This line is just to help us debug against the actual URL.
        console.log(queryUrl);
        
        request(queryUrl, function(error, response, body) {
        
          // If the request is successful
          if (!error && response.statusCode === 200) {
        
            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("Imdb rating: " + JSON.parse(body).Rated);
            // if(JSON.parse(body).Ratings[0].Source==="Rotten Tomatoes"){
                console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
            // } else {
            //     console.log("Rotten Tomatoes rating not found.");
            // }
            console.log("Country where the movie is produced: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
          }
        });
};

function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        
          // If the code experiences any errors it will log the error to the console.
          if (error) {
            return console.log(error);
          }
        
          // We will then print the contents of data
          console.log(data);
        
          // Then split it by commas (to make it more readable)
          var dataArr = data.split(",");
        
          // We will then re-display the content as an array for later use.
          console.log(dataArr);
        
          if(dataArr[0]==="my-tweets"){
              myTweets();
          }
          if(dataArr[0]==="spotify-this-song"){
              songName = dataArr[1];
              spotifyThisSong();
          }
          if(dataArr[0]==="movie-this"){
              movieThis();
          }
        });
}