// JavaScript för att implementera krav F.


$("#submitProduct").on("click", e => {
   let data =  {
        id: $('#productId').val(),
        name: $('#productName').val(),
        price: $('#productPrice').val()
    }

   FormValidator.validate(data);
   const errories = errors
   for (let i = 0; i < errories.length; i++) {
       $('#allErrors').append($(`<p>${errors[i]}</p>`))
   }

})