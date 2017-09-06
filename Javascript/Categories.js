// Get's all the categories from the server and call setHtmlNewCategory(category)
function getCategories(){
  var sUrl = 'http://localhost:8080/categories';

  $.ajax({
    headers:{
      'Accept':'application/json'
    },
    type: 'GET',
    url: sUrl,
    success: function(res){
      console.log(res);
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
    '<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-plus"></span></button>'+
    '</div><div class="panel-body">' +
    '<div class="row" id="' + categoryName + '"></div></div></div>';

  $('#Categories').prepend(html);
}
