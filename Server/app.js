var http = require('http');
var express = require('express');
var bodyParser  = require('body-parser');
var fs = require('fs');
var app = express();


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

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
  var pathToFile = './Categories/' + loggedInSteamId + '.json';
  var newCategory = req.body;
  // add newCategory to categoriesJSON
  if (categoriesJSON.categories.length == 0 ) {
    fs.readFile(pathToFile, function(err,data){
      if (err) {
        console.log('readFileError: ' + err);
      }
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
  });
  res.end(JSON.stringify(newCategory));

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

app.post('/categories/addGames',function(req,res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  req.setEncoding('utf8');


  var selectedGames = req.body;
  var filePath = './Categories/' + selectedGames.steamId + '.json';
  fs.readFile(filePath, 'utf8', function(err,data){
    if (err) {
      console.error(err);
    }
    categoriesJSON = JSON.parse(data);
    for (var i = 0; i < categoriesJSON.categories.length; i++) {
      if (categoriesJSON.categories[i].name == selectedGames.selectedCategory) {
        categoriesJSON.categories[i]['allAppId'] = selectedGames.allAppId;
      }
    }
    fs.writeFile(filePath, JSON.stringify(categoriesJSON), function(err){
      if (err) {
        console.log('writeFileError' + err);
      }
      console.log('write done.' + JSON.stringify(categoriesJSON));
      res.end(JSON.stringify(categoriesJSON));
    });
  });

});
