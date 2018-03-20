// JavaScript för att implementera kraven A-E.

// Lets hide the checkout by default!
$('#showCart').hide();

// Lets implement buttons so we can change the view
$('#displayProducts').on("click", e => {
   $('#showCart').hide();
   $('#showProducts').show();
});
$('#displayCart').on("click", e => {
    $('#showProducts').hide();
    $('#showCart').show();
});



// Lets get all the products we need:
let productList;
let itemsInCart = [];

// REQUIREMENT C: Render all products on site
// This function is declared at the start, so I can call it while fetching products

function renderProducts(listOfProducts) {
    $('#productWrapper').html("");
    for (let product of listOfProducts) {
        // Part of REQUIREMENT D: If this product is out of stock - you cant add it to cart
        if (product.AvailableProducts === 0) {
            $('#productWrapper').append(`
            <div class="product" id="${product.Id}">
                <h3 class="productName">${product.Name}</h3>
                <img src="${product.Image}" alt="">
                <p>Sorry! This product is out of stock</p>
        </div>
        `)
        } else {
         $('#productWrapper').append(`
        <div class="product" id="${product.Id}">
            <h3 class="productName">${product.Name}</h3>
            <img src="${product.Image}" alt="">
            <p>Available products: ${product.AvailableProducts}</p>
            <button class="addToCart">Add to cart</button>
        </div>
        `)
        }
    }
}

// REQUIREMENT A: Fetch all products from the API
// +
// REQUIREMENT B: On fetching, set a random number of products available

fetch('http://demo.edument.se/api/products')
    .then(response => response.json())
    .then(function (data) {
       let allProducts = data;
       for (let product of allProducts) {
           product.AvailableProducts = Math.floor((Math.random() * 10) + 1);
       }
       productList = allProducts;
       renderProducts(productList);
    })

//REQUIREMENT D: Add to cart function
// Create event listeners so we can see which item I press add 2 cart on:

$('body').on("click", ".addToCart", e => {
    let clickedProduct = e.target.parentNode;
    let productID = clickedProduct.getAttribute("id");
    let findProduct = findItem(productID);
    addProductToCart(findProduct);
});

// This function searches for the current product in the list of all products
function findItem(productID) {
    for (var i=0; i < productList.length; i++) {
        if (productList[i].Id == productID) {
            return productList[i];
        }
    }
}

//This function adds items to the cart, decreases available number of products, and handles quantity of items in cart
function addProductToCart(product) {
    product.AvailableProducts--;
    renderProducts(productList);

    // This gives all the products a quantity - that I can check on in cart
    if (!product.quantity) {
        product.quantity = 1;
    }

    // Is this product already in the cart?
    let found = itemsInCart.some(function (el) {
        return el.Name === product.Name;
    });

    // If the cart is emtpy, then we will want to add this item to the cart
    if (itemsInCart.length == 0) {
        itemsInCart.push(product);
    } else {
        // If its not empty, lets check if the product is added for the first time
        if (!found) {
            itemsInCart.push(product);
        }
        // If its already in the cart, lets just increase the quantity of the item
        else {
            product.quantity++;
        }
    }
    renderCart()
    totalCost()
};


// REQUIREMENT E: Renders the cart with the product names + quantities shown
// It also shows the products total cost

// This function renders all products you've bought to the cart
function renderCart() {
    // Lets make sure the cart is empty
    $('#cart').html("");
    $('#totalPrice').text('Total Cost: 0');
    let totalCost = 0;

    // Render all the objects + count the price
    for (let item of itemsInCart) {
        $('#cart').append($("<div></div>").html(`<span>${item.Name} </span><span>- Quantity: ${item.quantity}</span>`))
    }
}

// This function totals the cost of all products in cart
function totalCost() {
    let totalPrice = 0;
    for (let i in itemsInCart) {
        let price = itemsInCart[i].Price;
        let removeSymbols = parseFloat(price);
        let quantityPrice = removeSymbols * itemsInCart[i].quantity;
        totalPrice = totalPrice + quantityPrice;
        $("#totalPrice").text(`Total Cost: ${totalPrice}`);
    }
}

// Add event listener to the order button so we can submit orders
$('body').on("click", "#submitOrder", e => {
    if (itemsInCart.length === 0) {
        alert('Sorry - you cant send an empty order!')
    } else {
        sendOrder()
    }
});

function sendOrder() {
    // Each product will be posted once
    const promises = [];
    for (let item of itemsInCart) {
        //Create the order that will be sent - one for each item
        let order = {
            productName: item.Name,
            productId: item.Id,
            productQuantity: item.quantity
        }
        // WWhen we post the item, create a promise
        const promise =  fetch('http://localhost:3000/orders', {
            method: 'POST',
            body: JSON.stringify({order}),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        //Push that into the promises array
        promises.push(promise)
    }

    // When all promises are resolved (posted), remove the cart
    Promise.all(promises)
        .then( alert("Your order has been sent!") )
        .then( itemsInCart = [] )
        .then( renderCart() )
}