function btnSendSteamInfoCLickListener(){
  $('#btnSendSteamInfo').on('click', function(event) {
    event.preventDefault();
    getGame($('#txtSteamid').val(), $('#txtSteamAPIKey').val());
    getCategories($('#txtSteamid').val());
  });
}
function btnCreateCategoryClickListener(){
  $('#btnCreateCategory').on('click', function(event) {
    // sends the new category to the server and if successfull add to the home.html
    event.preventDefault();
    postCategory($('#txtCategoryName').val(), $('#txtSteamid').val());
  });
}

function btnAddGamesClickListener(){
  $('#Categories').on('click','.btnAddGames', function(event) {
    event.preventDefault();
    console.log($(this).attr('id'));
  });
}
