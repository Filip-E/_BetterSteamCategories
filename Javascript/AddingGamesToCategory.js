function addGamesToCategory(selectedCategory, steamId){
  var selectedGames =
  {
    'steamId' : steamId,
    'selectedCategory' : selectedCategory,
    'allAppId' : []
  };
  var sUrl = 'http://localhost:8080/categories/addGames';

  $('#gameList').find('.games').each(function(index, el) {
    // if game is selected do stuff
    if ($(this).children('input').prop( "checked" )) {
      selectedGames.allAppId.push($(this).attr('id'));
    };
  });

  $.ajax({
    headers:{
      'Accept':'application/json'
    },
    type: 'POST',
    url: sUrl ,
    data: selectedGames,
    success: function(res){
      console.log('post success:' + JSON.stringify(res));
    },
    dataType: 'json'
  });
};
