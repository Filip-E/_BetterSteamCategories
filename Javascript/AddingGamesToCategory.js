function addGamesToCategory(selectedCategory){
  console.log(selectedCategory);
  var selectedGames = {appId : []};
  $('#gameList').find('.games').each(function(index, el) {
    // if game is selected do stuff
    if ($(this).children('input').prop( "checked" )) {
      selectedGames.appId.push($(this).attr('id'));
    };
  });
  console.log(selectedGames);
};
