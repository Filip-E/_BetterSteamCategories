var http = require('http');
var express = require('express');
var app = express();

app.listen(8080,function(){
  console.log('listening to port 8080');
});

// GAMELIST
/***********/
// when post request is received get owned games from steam and return that data
app.post('/gamesList',function(req,res){
  //  allow CORS and write response header
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  // get data from request
  req.setEncoding('utf8');
  let rawData = '';
  req.on('data',function(chunk){
    rawData += chunk;
  });
  // when done getting data from request
  // request owned games from steam
  req.on('end',function(){
    // set url
    var keys = JSON.parse(rawData);
    var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + keys.apiKey +
              '&steamid='+keys.steamId+'&format=json&include_appinfo=1';
    // get request owned games from steam api
    http.get(url, function(responseSteam){
      const { statusCode } = responseSteam;
      const contentType = responseSteam.headers['content-type'];
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
        responseSteam.resume();
        return;
      }
      // get data from steam api request
      responseSteam.setEncoding('utf8');
      let rawData = '';
      responseSteam.on('data', function(chunk){
        rawData += chunk;
      });
      // when done getting data from steam
      responseSteam.on('end', function(){
        // write to the response stream and end the stream
        res.end(rawData);
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  });
});

// Categories
/************/
// var which saves all the categories
var categoriesJSON = {categories: []};

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

    var newCategory = JSON.parse(rawData);
    // add newCategory to categoriesJSON
    if (categoriesJSON.categories.length == 0 ) {
      categoriesJSON.categories[0] = newCategory;
    }else {
      categoriesJSON.categories[categoriesJSON.categories.length] = newCategory;
    }
    // return new category to the client
    res.end(JSON.stringify(newCategory));
  });
});
// when get request received return all the categories (categoriesJSON) to the client
app.get('/categories',function(req,res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  res.end(JSON.stringify(categoriesJSON));
});
