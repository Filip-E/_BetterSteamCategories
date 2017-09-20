var http = require('http');
var express = require('express');
var app = express();
var fs = require('fs');


var loggedInSteamId;
app.listen(8080,function(){
  console.log('listening to port 8080');
});

// GAMELIST
/***********/
//  get owned games from steam and return that data
app.get('/gamesList',function(req,res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  req.setEncoding('utf8');
  var keys = req.query;
  var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + keys.apiKey +
  '&steamid=' + keys.steamId+'&format=json&include_appinfo=1';
  loggedInSteamId = keys.steamId;
  // get owned games from steam api
  http.get(url, function(responseFromSteam){
    const { statusCode } = responseFromSteam;
    const contentType = responseFromSteam.headers['content-type'];
    // error checking
    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      responseFromSteam.resume();
      return;
    }
    responseFromSteam.setEncoding('utf8');
    let rawData = '';
    responseFromSteam.on('data', function(chunk){
      rawData += chunk;
    });
    responseFromSteam.on('end', function(){
      res.end(rawData);
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
});

// Categories
/************/
var categoriesJSON = {
  steamId: '',
  categories: []
};

// when post request is received add a new category to categoriesJSON
app.post('/categories',function(req,res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  req.setEncoding('utf8');
  var rawData = '';
  req.on('data',function(chunk){
    rawData += chunk;
  });
  req.on('end',function(){
    var pathToFile = './Categories/' + loggedInSteamId + '.json';
    var newCategory = JSON.parse(rawData);
    // add newCategory to categoriesJSON
    if (categoriesJSON.categories.length == 0 ) {
      fs.readFile(pathToFile, function(err,data){
        console.log('readFileError: ' + err);
        if (typeof data !== 'undefined') {
          categoriesJSON = JSON.parse(data);
          categoriesJSON.steamId = loggedInSteamId;
          console.log('categoriesJSON: ' + JSON.stringify(categoriesJSON));
        }
      });
      categoriesJSON.categories[0] = newCategory;
    }else {
      categoriesJSON.categories[categoriesJSON.categories.length] = newCategory;
    }
    fs.writeFile(pathToFile, JSON.stringify(categoriesJSON), function(err){
      if (err) {
        console.log('writeFileError' + err);
      }
    })
    res.end(JSON.stringify(newCategory));
  });
});
// when get request received return all the categories (categoriesJSON) to the client
app.get('/categories',function(req,res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  req.setEncoding('utf8');
  fs.readFile('./Categories/' + req.query.steamId + '.json', 'utf8', function(err,data){
    if (err) {
      console.log('readFileError' + err);
    }
    res.end(data)
  });
});
