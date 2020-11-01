class Cart {
    static global() {
        Cart.nav = document.querySelector('nav');
        Cart.page = document.getElementById('cart-page');
        Cart.shipping = 0;
        Cart.arr = [];
    }

    // show page 
    static showPage(e) {
        if (e.target.classList.contains('click-cart')) {
            // select elements
            const page = document.getElementById('cart-page');

            //* append shipping price
            const shipping = document.querySelectorAll('.shipping span');
            shipping.forEach(span => span.textContent = `${Pro.currency} ${Cart.shipping.toLocaleString()}`);

            // init check cart
            Cart.checkCart();
            // init each item price caclculation
            Cart.calcTotalPrice();
            // init remove item from cart
            Cart.removeItem();
            // init see details
            Cart.seeDetails();

            //! reset price animation
            const price = document.querySelectorAll('.cps-item .cps-t-price');
            price.forEach(item => item.classList.remove("animate-p"));

            //* show page
            document.body.style.overflow = 'hidden';
            page.style.display = 'block';
        }
    }

    // hide page
    static hidePage(e) {
        if (e.target.classList.contains('click-cart-back-btn')) {
            // select page
            const page = document.getElementById('cart-page');
            document.body.style.overflow = 'auto';
            page.style.display = 'none';
        }
    }

    // check items in cart
    static checkCart() {
        // select elements
        const productsCon = document.getElementById('cps');
        const emptyAlert = document.getElementById('empty-cart-alert');
        const cartHead = document.getElementById('cart-head');
        const checkout = document.querySelectorAll('.checkout');
        const [checkout_1, checkout_2] = document.querySelectorAll('.checkout');

        //! check if there are items in cart
        if (productsCon.hasChildNodes()) {
            // select items in cart
            const elms = productsCon.querySelectorAll('.cps-item');
            emptyAlert.style.display = 'none'; //! hide alert
            // check media
            if (window.matchMedia('(max-width: 768px)').matches) { //? mobile size
                cartHead.style.display = 'none'; //! hide
                if (elms.length > 1) { // more than item in cart
                    checkout.forEach(item => item.style.display = 'block'); //* show all checkouts
                } else { // only one item in cart
                    checkout.forEach(item => item.style.display = 'none'); //! hide all checkouts
                    checkout_2.style.display = 'block'; //* show 2nd checkout
                }
            } else { //? desktop size
                cartHead.style.display = 'block'; //* show
                checkout.forEach(item => item.style.display = 'none'); //! hide all checkouts
                checkout_2.style.display = 'block'; //* show 2nd checkout
            }
        } else {
            cartHead.style.display = 'none'; //! hide head
            checkout.forEach(item => item.style.display = 'none');
            emptyAlert.style.display = 'block'; //* show alert
        }
    }

    // cart items indicator
    static cartIndicator() {
        // select cart items indicator
        const indicator = document.querySelector('.cart-dot');
        // select cart items container
        const cartItemsCon = document.getElementById('cps');

        //* check if there are items in cart
        if (cartItemsCon.hasChildNodes()) {
            // select all items
            const cartItems = document.querySelectorAll('.cps-item');
            // update items indicator
            indicator.textContent = cartItems.length;

            // reset indicator
            indicator.style.opacity = '0';
            indicator.style.display = 'block';

            // reset animation
            indicator.classList.remove('animate-dot');
            // add animation
            setTimeout(() => indicator.classList.add('animate-dot'), 0);
        } else { //! if no items in cart then hide indicator
            indicator.style.display = 'none';
        }
    }

    // add to cart | //! this the same fn in details page but without select tag
    static addToCart(e) {
        if (e.target.classList.contains('add-btn')) {
            // get item id
            const id = e.target.parentElement.parentElement.querySelector('.id').value;
            let selectedQ = 1;
            // select all products
            const pro = Pro.container.querySelectorAll('.sec');
            // select cart elements
            const toBeAppendIn = document.getElementById('cps');
            // select notification
            const notify = document.getElementById('notify');
            const notifyContent = document.querySelector('#notify p');

            //! filter products based on id
            let filteredArr = [...pro].filter(item => item.querySelector('.id').value == id);

            if (filteredArr.length) {
                //! cloned current product
                const cloned = filteredArr[0].cloneNode(true);
                // get props
                const img = cloned.querySelector('.pro-img img').getAttribute('data-src');
                const title = cloned.querySelector('.pro-title').textContent;
                const price = cloned.querySelector('.pro-new-p').textContent;
                const quantity = +cloned.querySelector('.q').value;

                // options
                let options = "";
                for (let i = 1; i <= quantity; i += 1) {
                    if (i == 1) options += `<option value="${i}" selected>${i}</option>`;
                    else options += `<option value="${i}">${i}</option>`;
                }

                // create div
                const div = document.createElement('div');
                // add class
                div.className = "cps-item";
                //* append props
                div.innerHTML = `
                <!-- !start button -->
                <button type="button" class="cart-del-btn">
                    <span class="click-cart-del-btn d1"></span>
                    <span class="click-cart-del-btn d2"></span>
                    <span class="click-cart-del-btn d3"></span>
                </button>
                <!-- !end button -->

                <input type="hidden" class="id" value="${id}">
                <input type="hidden" class="mQ" value="${quantity}">

                <!-- img -->
                <div class="cps-img"><img src="${img}" alt="preview"></div>

                <!-- title -->
                <h4 class="cps-title" title="See Details">${title}</h4>

                <!-- price -->
                <span class="cps-price">${price}</span>

                <!-- quantity -->
                <div class="cps-q-select">
                    <select required>
                        ${options}
                    </select>
                    <span class="select-arrow"></span>
                </div>

                <!-- total price -->
                <span class="cps-t-price">${Pro.currency} ${(+(price.replace(/\D/gi,"")) * selectedQ).toLocaleString()}</span>
                `;

                //* append product
                toBeAppendIn.append(div);

                // init indicator
                Cart.cartIndicator();

                // init sum prices
                Cart.sumPrices();

                //! update notify text and color
                notify.style.background = '#25b869'; //* success
                notifyContent.textContent = "item added to cart!";

                // check if product in cart or not
                if (toBeAppendIn.hasChildNodes()) {
                    const itemsInCart = toBeAppendIn.querySelectorAll('.cps-item');
                    let cartItemsArr = [...itemsInCart].filter(item => item.querySelector('.id').value == id);

                    // loop to remove all duplicated pros
                    if (cartItemsArr.length > 1) {
                        //* update notify text
                        notify.style.background = '#ffa700'; //! alert
                        notifyContent.textContent = "item already in cart!";
                        //! remove all duplicated items except the last one as it holds last selected value
                        for (let i = 0; i < cartItemsArr.length - 1; i += 1) cartItemsArr[i].remove();
                        // init indicator
                        Cart.cartIndicator();
                        // init sum prices
                        Cart.sumPrices();
                    }
                }

                //* show notify
                notify.style.display = 'block';
                //! hide notify after 3 seconds
                setTimeout(() => notify.style.display = 'none', 3000);

            }

        }
    }

    // sum all prices in cart
    static sumPrices() {
        // select all items price
        const itemsFinalP = document.querySelectorAll('.cps-t-price');
        // select subtotal
        const subT = document.querySelectorAll('.checkout .t-subtotal span');
        // select total final price
        const tP = document.querySelectorAll('.checkout .t-price span');
        //! wipe out
        Cart.arr = [];

        // loop to push prices
        [...itemsFinalP].forEach(item => {
            const num = item.textContent.replace(/\D/gi, "");
            Cart.arr.push(+num);
        });

        //! calc sub total price number
        const tSum = Cart.arr.reduce((total, num) => total + num, 0);
        //* append sub total price
        subT.forEach(span => span.textContent = `${Pro.currency} ${tSum.toLocaleString()}`);

        //! calc total price that the customer will pay
        let total = tSum + Cart.shipping;
        //* append total price
        tP.forEach(span => span.textContent = `${Pro.currency} ${total.toLocaleString()}`);

        // select all items to be animated
        const allItems = [...subT, ...tP]
        //! remove animation
        allItems.forEach(item => item.classList.remove('animate-p'));
        //* add animation
        setTimeout(() => allItems.forEach(item => item.classList.add('animate-p')), 0);
    }

    // calc total price of each item in cart
    static calcTotalPrice() {
        // select page
        const page = document.getElementById('cart-page');

        // init sum prices
        Cart.sumPrices();

        // listen to select box
        page.addEventListener("change", e => {
            if (e.target.nodeName.toLowerCase() === "select") {
                const value = +e.target.value;
                // select container
                const con = e.target.parentElement.parentElement;
                // select item price
                const price = con.querySelector(".cps-price");
                // select total price holder
                const toBeAppendIn = con.querySelector('.cps-t-price');

                //! calc total price of each item
                const total = value * (+(price.textContent.replace(/\D/gi, "")));

                //* append total price of each item
                toBeAppendIn.textContent = `${Pro.currency} ${total.toLocaleString()}`;
                //! remove animation
                toBeAppendIn.classList.remove('animate-p');
                //* add animation
                setTimeout(() => toBeAppendIn.classList.add('animate-p'), 0);

                // blur select box
                e.target.blur();

                // init sum prices
                Cart.sumPrices();
            }
        });
    }

    // remove item from cart
    static removeItem() {
        const page = document.getElementById('cart-page');

        // listen to remove button
        page.addEventListener("click", e => {
            if (e.target.classList.contains('click-cart-del-btn')) {
                // select container
                const con = e.target.parentElement.parentElement;
                // remove clicked item
                con.remove();

                // init indicator fn
                Cart.cartIndicator();
                // init sum prices
                Cart.sumPrices();
                // init check cart fn
                Cart.checkCart();
            }
        });
    }

    // see details of items in cart
    static seeDetails() {
        // select page
        const page = document.getElementById('cart-page');
        // select products container
        const proCon = document.getElementById('products');
        // select all products
        const pro = Pro.container.querySelectorAll('.sec');

        // onclick
        page.addEventListener('click', e => {
            // listen to cart item title
            if (e.target.classList.contains('cps-title')) {
                // select container
                const con = e.target.parentElement;
                // get item id
                const id = con.querySelector('.id').value;

                // filter clicked product
                let filteredArr = [...pro].filter(item => item.querySelector('.id').value == id);

                // if there is a matched product id
                if (filteredArr.length) {
                    const cloned = filteredArr[0].cloneNode(true);
                    // select details button
                    const btn = cloned.querySelector('.detail-btn');

                    //! wipe out product container
                    proCon.innerHTML = "";

                    // load img
                    const img = cloned.querySelector('.pro-img img');
                    // load imgs
                    img.setAttribute('src', img.getAttribute('data-src'));

                    //* append clicked product from cart 
                    proCon.append(cloned);

                    //* show details
                    btn.click();
                }

            }
        });
    }

}
// init
Cart.global();

// !events
// show page 
Cart.nav.addEventListener('click', Cart.showPage);
// hide page
Cart.page.addEventListener('click', Cart.hidePage);
// add item to cart
document.addEventListener('click', Cart.addToCart);
// init checkCart on resize
window.addEventListener('resize', Cart.checkCart);