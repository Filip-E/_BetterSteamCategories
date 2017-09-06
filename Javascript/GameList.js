//game list functions
function getGame(steamId, apiKey){
  var sUrl = 'http://localhost:8080/gamesList';
  // data which get send to the server
  var keys = {
    'apiKey' : apiKey,
    'steamId' : steamId
  };
  $.ajax({
    headers:{
      'Accept':'application/json'
    },
    type: 'POST',
    url: sUrl,
    data: JSON.stringify(keys),
    success: function(res){
      console.log(res);
      var gamesArray = res.response.games;
      $.each(gamesArray,function(index, el) {
        setHtmlGameList(index, el);
      });
    },
    dataType: 'json'
  });
};
// old getGame()
/*
function getGame(){
  var sUrl = 'http://localhost:8080/gamesList';
  // data which get send to the server
  var apiKey = '[PASTE API KEY HERE BETWEEN QUOTES]';
  var steamId = '[PASTE STEAM ID HERE BETWEEN QUOTES]';
  var keys = {
    'apiKey' : apiKey,
    'steamId' : steamId
  };
  $.ajax({
    headers:{
      'Accept':'application/json'
    },
    type: 'POST',
    url: sUrl,
    data: JSON.stringify(keys),
    success: function(res){
      console.log(res);
      var gamesArray = res.response.games;
      $.each(gamesArray,function(index, el) {
        setHtmlGameList(index, el);
      });
    },
    dataType: 'json'
  });
};
*/

function setHtmlGameList(htmlID, game){
  var appid = game.appid;
  var name = game.name;
  var iconHash = game.img_icon_url;
  var iconUrl;
  if (iconHash != '') {
    iconUrl = 'http://media.steampowered.com/steamcommunity/public/images/apps/' +
    appid + '/' + iconHash + '.jpg';
  }else {
    console.log(appid);
  }
  var html = '<img src="' + iconUrl + '" />' + name +
  '<input type="checkbox" class="gameListCheckbox"><br /><br />';

  $('#gameList').find('span').append(html);
}
