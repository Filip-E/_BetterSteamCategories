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
// when post request is received get owned games from steam and return that data
app.get('/gamesList',function(req,res){
  //  allow CORS and write response header
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  // get data from request
  req.setEncoding('utf8');
  // when done getting data from request
  // request owned games from steam
  // set url
  var keys = req.query;
  var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + keys.apiKey +
  '&steamid='+keys.steamId+'&format=json&include_appinfo=1';
  loggedInSteamId = keys.steamId;
  // get request owned games from steam api
  http.get(url, function(respnoseFromSteam){
    const { statusCode } = respnoseFromSteam;
    const contentType = respnoseFromSteam.headers['content-type'];
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
      respnoseFromSteam.resume();
      return;
    }
    // get data from steam api request
    respnoseFromSteam.setEncoding('utf8');
    let rawData = '';
    respnoseFromSteam.on('data', function(chunk){
      rawData += chunk;
    });
    // when done getting data from steam
    respnoseFromSteam.on('end', function(){
      // write to the response stream and end the stream
      res.end(rawData);
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
});

// Categories
/************/
// var which saves all the categories
var categoriesJSON = {
  steamId: '',
  categories: []
};

// when post request is received add a new category to categoriesJSON
app.post('/categories',function(req,res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  // get data from request
  req.setEncoding('utf8');
  var rawData = '';
  req.on('data',function(chunk){
    rawData += chunk;
  });
  // when finished getting data from request
  req.on('end',function(){
    var pathToFile = './Categories/' + loggedInSteamId + '.json';
    var newCategory = JSON.parse(rawData);
    // add newCategory to categoriesJSON
    if (categoriesJSON.categories.length == 0 ) {
      fs.readFile(pathToFile, function(err,data){
        console.log('error: ' + err);
        console.log('data from file: ' + data);
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
      console.log(err);
    })
    // return new category to the client
    res.end(JSON.stringify(newCategory));
  });
});
// when get request received return all the categories (categoriesJSON) to the client
app.get('/categories',function(req,res){
  //  allow CORS and write response header
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  req.setEncoding('utf8');
  fs.readFile('./Categories/' + req.query.steamId + '.json', 'utf8', function(err,data){
    console.log(err);
    res.end(data)
  });
});
