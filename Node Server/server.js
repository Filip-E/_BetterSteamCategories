var http = require('http');
var port = 8080;

http.createServer(function(request, response){
  //  allow CORS and write response header
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.writeHead(200);
  // set url
  request.setEncoding('utf8'); // why?
  let rawData = '';
  request.on('data',function(chunk){
    rawData += chunk;
  });
  request.on('end',function(){
    var keys = JSON.parse(rawData);
    var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + keys.apiKey + '&steamid='+keys.steamId+'&format=json&include_appinfo=1';
    // get owned games from steam api
    http.get(url, function(res){
      const { statusCode } = res;
      const contentType = res.headers['content-type'];
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
        res.resume();
        return;
      }
      // parse json
      res.setEncoding('utf8'); // why?
      let rawData = '';
      res.on('data', function(chunk){
        rawData += chunk;
      });
      res.on('end', function(){
        try {
          const parsedData = JSON.parse(rawData);
          // START OWN CODE
          var jsonString = JSON.stringify(parsedData);
          response.end(jsonString);
          // END OWN CODE
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  });
}).listen(port);
console.log('listening on port ' + port + '...');
