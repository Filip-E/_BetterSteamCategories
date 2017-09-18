function btnLogInCLickListener(){
  $('#btnLogIn').on('click', function(event) {
    event.preventDefault();
    fillGameList($('#txtSteamid').val(), $('#txtSteamAPIKey').val());
    fillCategories($('#txtSteamid').val());
  });
}
function btnCreateCategoryClickListener(){
  $('#btnCreateCategory').on('click', function(event) {
    event.preventDefault();
    // sends the new category to the server and if successfull add to the home.html
    postCategory($('#txtCategoryName').val(), $('#txtSteamid').val());
  });
}
function btnAddGamesToCategoryClickListener(){
  $('#Categories').on('click','.btnAddGames', function(event) {
    event.preventDefault();
    console.log($(this).attr('id'));
  });
}
