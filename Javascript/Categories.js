// Get's all the categories from the server and call setHtmlNewCategory(category)
function getCategories(steamId){
  var sUrl = 'http://localhost:8080/categories';
  var steamIdJSON = {'steamId': steamId};
  $.ajax({
    headers:{
      'Accept':'application/json'
    },
    type: 'GET',
    url: sUrl,
    data : steamIdJSON,
    success: function(res){
      $('#Categories').empty();
      $.each(res.categories,function(index, el) {
        setHtmlNewCategory(el);
      });
    },
    dataType: 'json'
  });
}
// creates html syntax and prepends to home.html
function setHtmlNewCategory(category){
  var categoryName = category.name;

  var html =
    '<div class="panel panel-default"><div class="panel-heading">' +
    '<h3 class="panel-title">' + categoryName + '</h3>'+
    '<button type="button" class="btn btn-default btn-sm btnAddGames" id="' + categoryName + '"><span class="glyphicon glyphicon-plus"></span></button>'+
    '</div><div class="panel-body">' +
    '<div class="row" id="row_' + categoryName + '"></div></div></div>';

  $('#Categories').prepend(html);
}

function postCategory(categoryName,steamId){
  var category = {'name': categoryName};
  var sUrl = 'http://localhost:8080/categories'
  $.ajax({
    headers:{
      'Accept':'application/json'
    },
    type: 'POST',
    url: sUrl ,
    data: JSON.stringify(category),
    success: function(res){
      $('#txtCategoryName').val('');
      getCategories(steamId);
    },
    dataType: 'json'
  });
}
