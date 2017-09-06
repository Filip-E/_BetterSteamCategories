function btnCreateCategoryClickListener(){
  $('#btnCreateCategory').on('click', function(event) {
    // sends the new category to the server and if successfull add to the home.html
    event.preventDefault();
    var category = {'name': $('#txtCategoryName').val()};
    var sUrl = 'http://localhost:8080/categories'
    $.ajax({
      headers:{
        'Accept':'application/json'
      },
      type: 'POST',
      url: sUrl ,
      data: JSON.stringify(category),
      success: function(res){
        console.log(res);
        setHtmlNewCategory(res);
        $('#txtCategoryName').val('');
      },
      dataType: 'json'
    });
  });
}
