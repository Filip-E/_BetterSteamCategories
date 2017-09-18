function fillGameList(steamId, apiKey){
  var sUrl = 'http://localhost:8080/gamesList';
  // data which get send to the server
  var keys = {
    'apiKey' : apiKey,
    'steamId' : steamId
  };
  $.ajax({
    /*headers:{
      'Accept':'application/json'
    },*/
    type: 'GET',
    url: sUrl,
    data: keys,
    success: function(res){
      var gamesArray = res.response.games;
      $.each(gamesArray,function(index, el) {
        setHtmlGameList(index, el);
      });
    },
    dataType: 'json'
  });
};
function setHtmlGameList(htmlID, game){
  var appid = game.appid;
  var name = game.name;
  var iconHash = game.img_icon_url;
  var iconUrl;
  if (iconHash != '') {
    iconUrl = 'http://media.steampowered.com/steamcommunity/public/images/apps/' +
    appid + '/' + iconHash + '.jpg';
  }
  var html = '<img src="' + iconUrl + '" />' + name +
  '<input type="checkbox" class="gameListCheckbox"><br /><br />';

  $('#gameList').find('span').append(html);
}
