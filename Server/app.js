var http = require('http');
var express = require('express');
var app = express();

// gets all the ownded games from steam
app.post('/gamesList',function(req,res){
  //  allow CORS and write response header
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  // get data from request
  req.setEncoding('utf8'); // why?
  let rawData = '';
  req.on('data',function(chunk){
    rawData += chunk;
  });
  // when done getting data from request
  req.on('end',function(){
    // set url
    var keys = JSON.parse(rawData);
    var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + keys.apiKey +
              '&steamid='+keys.steamId+'&format=json&include_appinfo=1';
    // get owned games from steam api
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
      // get data from steam
      responseSteam.setEncoding('utf8'); // why?
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
var categoriesJSON = {categories: []};

app.post('/categories',function(req,res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  // get data from request
  req.setEncoding('utf8');
  var rawData = '';
  req.on('data',function(chunk){
    rawData += chunk;
  });
  req.on('end',function(){
    var newCategory = JSON.parse(rawData);
    console.log('new category:' + JSON.stringify(newCategory));
    if (categoriesJSON.categories.length == 0 ) {
      categoriesJSON.categories[0] = newCategory;
    }else {
      categoriesJSON.categories[categoriesJSON.categories.length] = newCategory;
    }

    console.log('all categories:' + JSON.stringify(categoriesJSON));
    res.end(JSON.stringify(newCategory));
  });

});
app.get('/categories',function(req,res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);
  console.log('categories request recieved.');
  res.end(JSON.stringify(categoriesJSON));
});

app.listen(8080,function(){
  console.log('listening to port 8080');
});
