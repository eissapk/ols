class Form {

  static global() {
    Form.myForm = document.getElementById('myForm');
  }

  // update db
  static updateDB() {
    // select all items in cart
    const itemsInCart = document.querySelectorAll('#cps .cps-item');

    //* loop to make updated array of quantities
    let arr = [...itemsInCart].map(item => {
      // get item id
      const id = +item.querySelector('.id').value;
      // get maximum quantity
      const maxQ = +item.querySelector('.mQ').value;
      // get selected quantity
      const selectedQ = +item.querySelector('select').value;
      //! final quantity to be updated in db
      const finalQ = maxQ - selectedQ;

      // make object of items info
      const obj = {
        id: id,
        q: finalQ
      };

      return obj;
    });

    //! update db
    arr.forEach(item => productsCol.child(item.id).update({
      quantity: item.q
    }));

    console.log('Updated Quantity');

  }

  // show form
  static showPage(e) {
    if (e.target.classList.contains('check-btn')) {
      // select form container
      const page = document.getElementById('formWrapper');
      // get final total price
      const tp = document.querySelector('.checkout .t-price span').textContent;
      // select container
      const toBeAppendIn = document.getElementById('amountToBePaid');

      //* append total price
      toBeAppendIn.textContent = tp;

      //* show form
      page.style.display = 'block';
    }
  }

  // hide form
  static hidePage(e) {
    if (e.target.classList.contains('clickCancelOrder')) {
      // select form container
      const page = document.getElementById('formWrapper');

      //! hide form
      page.style.display = 'none';
    }
  }

  // submit form
  static submitForm(e) {
    e.preventDefault();
    // select form container
    const page = document.getElementById('formWrapper');
    // select form notify container
    const formNotifyCon = document.getElementById('formNotify');
    // select success
    const successNotify = document.getElementById('success');
    // select error
    const errorNotify = document.getElementById('error');
    // select items container
    const itemsCon = document.getElementById('cps');
    // select items in cart
    const itemsInCart = document.querySelectorAll('#cps .cps-item');
    // select checkout box
    const checkout = document.querySelector('.checkout');
    // select form fields
    const form = document.getElementById('myForm');
    const selector = (id) => document.getElementById(id).value.trim();

    // make invoice number
    const invoice = new Date().getTime();
    // get cashAmount
    const cash = document.querySelector('.checkout .t-price span').textContent;

    //* loop to get which products including(quantity, id, title)
    let whichPro = [...itemsInCart].map(item => {
      // get item id
      const id = +item.querySelector('.id').value;
      // get selected quantity
      const q = +item.querySelector('select').value;
      // get item title 
      const title = item.querySelector('.cps-title').textContent;

      // make object of items info
      const obj = {
        id: id,
        selectedQuantity: q,
        title: title
      };

      return obj;
    });

    // create order object
    const order = {
      name: selector("fullName"),
      phone: selector("phoneNumber"),
      address: selector("address"),
      invoice: invoice,
      cash: cash,
      whichPro: whichPro
    };

    //* add invoice to db
    formCol.child(order.invoice).set(order)
      .then(() => {
        //! update db
        Form.updateDB();

        //! hide form page
        page.style.display = 'none';

        //* show notify
        formNotifyCon.style.display = 'block';
        successNotify.style.display = 'block';
        errorNotify.style.display = 'none';

        // init
        Form.success(order, itemsInCart, checkout);

        //! reset form
        form.reset();

        //! wipe out cart
        itemsCon.innerHTML = "";
        // init
        Cart.checkCart();
        Cart.cartIndicator();
      })
      .catch(() => {
        //* show notify
        formNotifyCon.style.display = 'block';
        successNotify.style.display = 'none';
        errorNotify.style.display = 'block';

        // init
        Form.error();
      });

  }

  // success
  static success(order, items, checkout) {
    // select notify container
    const container = document.getElementById('formNotify');
    // select success button
    const btn = document.querySelector('.successBtn');

    // init invoice
    Form.invoice(order, items, checkout);

    // error btn onclick
    btn.addEventListener('click', () => container.style.display = "none");
  }

  // error
  static error() {
    // select notify container
    const container = document.getElementById('formNotify');
    // select error button
    const btn = document.querySelector('.errorBtn');

    // onclick
    btn.addEventListener('click', () => container.style.display = "none");
  }

  // issue invoice
  static invoice(order, items, checkout) {
    // declare dom 
    let dom = "<!DOCTYPE html>";
    // select anchor
    const a = document.getElementById('a');
    // select download btn
    const btn = document.getElementById('invoiceBtn');

    //! make date
    const d = new Date();
    const date = `${d.getDate()}, ${Details.mArr[d.getMonth()]}, ${d.getFullYear()}`;

    //! make checkout box
    const subT = checkout.querySelector('.t-subtotal span').textContent;
    const shipping = checkout.querySelector('.shipping span').textContent;
    const totalP = checkout.querySelector('.t-price span').textContent;
    const checkoutBox = `
  <section class="checkout">
   <div class="t-subtotal">subtotal: <span>${subT}</span></div>
   <div class="shipping">shipping: <span>${shipping}</span></div>
   <div class="t-price">total: <span>${totalP}</span></div>
  </section>
  `;

    //! create items
    const cartItems = [...items].map(item => {
      const title = item.querySelector('.cps-title').textContent;
      const p = item.querySelector('.cps-price').textContent;
      const q = item.querySelector('.cps-q-select select').value;
      const tp = item.querySelector('.cps-t-price').textContent;

      return `
   <div class="cps-item">
    <!-- title -->
    <h4 class="cps-title">${title}</h4>
    <!-- price -->
    <span class="cps-price">${p}</span>
    <!-- quantity -->
    <span class="cps-q">${q}</span>
    <!-- total price -->
    <span class="cps-t-price">${tp}</span>
   </div>
   `;
    }).join("");

    //! make style
    const style = `
 /* global */
   * {
    box-sizing: border-box;
   }

   html,
   body {
    margin: 0;
    padding: 0;
    font-family: helvetica, Arial, sans-serif;
    font-size: 12pt;
    background-color: #eee;
   }

   /* main container */
   body>main {
    width: 21cm;
    min-height: 29.7cm;
    padding: 2cm;
    margin: 1cm auto;
    background: #fff;
   }

   /* logo */
   #logo {
    display: block;
    text-align: center;
    text-transform: capitalize;
    text-decoration: none;
    color: black;
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 25px;
   }

   /* invoiceHead */
   .generalInfo {
    width: 50%;
    float: left;
    text-align: center;
    text-transform: capitalize;
    font-weight: bold;
   }

   #fix {
    clear: both;
   }

   #invoiceHead #billedTo {
    margin-top: 40px;
   }

   #invoiceHead>div {
    margin: 5px 0;
    font-weight: bold;
    text-transform: capitalize;
   }

   .client {
    font-weight: normal;
   }

   /* invoiceBody */
   #invoiceBody {
    margin-top: 20px
   }

   /* header */
   #cart-head {
    height: 40px;
    border: 1px solid black;
    border-left: 0;
    border-right: 0;
    background-color: #f0f0f0;
   }

   #cart-head>span {
    float: left;
    height: 40px;
    line-height: 40px;
    text-align: center;
    text-transform: capitalize;
    font-weight: bold;
   }

   #cart-head-item {
    width: 55%;
   }

   #cart-head-price,
   #cart-head-quantity,
   #cart-head-total {
    width: 15%;
   }

   /* items */
   .cps-item {
    width: 100%;
    display: inline-block;
    border-bottom: 1px solid black;
   }

   .cps-title,
   .cps-price,
   .cps-q-select,
   .cps-t-price {
    float: left;
    text-align: center;
   }

   .cps-title {
    width: 55%;
    margin: 10px 0;
    text-align: left;
    padding-left: 10px;
   }

   .cps-price,
   .cps-t-price {
    width: 15%;
    margin: 10px 0;
   }

   .cps-q {
    width: 15%;
    margin: 10px 0;
    text-align: center;
    float: left;
   }

   .cps-t-price {
    font-weight: bold;
   }

   /* checkout */
   .checkout {
    float: right;
    margin-top: 10px;
    padding: 10px;
    border: 1px solid black;
    background-color: #f0f0f0;
   }

   .checkout>div {
    margin: 5px 0;
    text-transform: capitalize;
   }

   .checkout>div span {
    float: right;
    margin-left: 10px;
   }

   .t-price {
    font-weight: bold;
   }
 `;

    //! create html
    let html = document.createElement('html');
    // set attributes values
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');

    //* append to html
    html.innerHTML = `
  <head>
   <meta charset="UTF-8">
   <title>OLS Invoice</title>
   <style>${style}</style>
  </head>

  <body>

   <main>

    <!-- logo -->
    <a id="logo" href="https://eissa.xyz/ols" target="_blank">online store</a>

    <!-- header -->
    <div id="invoiceHead">
     <div class="generalInfo">invoice no.: <span>${order.invoice}</span></div>
     <div class="generalInfo">receipt date: <span>${date}</span></div>

     <div id="fix"></div>

     <div id="billedTo">billed to</div>
     <div>Name: <span class="client">${order.name}</span></div>
     <div>Phone: <span class="client">${order.phone}</span></div>
     <div>Address: <span class="client">${order.address}</span></div>
    </div>

    <!-- body -->
    <div id="invoiceBody">

     <!-- body header -->
     <div id="cart-head">
      <span id="cart-head-item">item</span>
      <span id="cart-head-price">price</span>
      <span id="cart-head-quantity">quantity</span>
      <span id="cart-head-total">total</span>
     </div>

     <!-- items -->
     <section id="cps">${cartItems}</section>

    <!-- checkout -->
    ${checkoutBox}

    </div>

   </main>

  </body>
  `;

    //! update dom
    dom += html.outerHTML;

    // onclick download btn
    btn.addEventListener('click', function (e) {
      // make html file
      const file = new Blob([dom], {
        type: 'text/html'
      });

      // add href link
      a.href = URL.createObjectURL(file);
      // name file
      a.download = 'invoice.html';
      // run click
      a.click();
    });

  }

}
// init
Form.global();

//! events
// show form
document.addEventListener('click', Form.showPage);
// hide form
document.addEventListener('click', Form.hidePage);
// submit form
Form.myForm.addEventListener('submit', Form.submitForm);