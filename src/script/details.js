class Details {

    static global() {
        Details.page = document.getElementById('detail-page');
        // magnifier
        Details.zoom = 1.79;
        // rate
        Details.mArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        Details.rateArr = [];
        Details.rateNum;
        // reviews
        Details.reviewsArr = [];
    }

    // hide details page
    static hidePage(e) {
        if (e.target.classList.contains('click-detail-back-btn')) {
            // select page
            const detailsPage = document.getElementById('detail-page');
            const wishlistPage = document.getElementById('wishlist-page');
            const cartPage = document.getElementById('cart-page');

            if (cartPage.style.display == "block" || wishlistPage.style.display == "block") { // when closing details page if cart or wishlist pages are showen
                document.body.style.overflow = 'hidden';
            } else { // if not
                document.body.style.overflow = 'auto';
            }

            // hide page
            detailsPage.style.display = 'none';
        }
    }

    // show details page
    static showPage(e) {
        return new Promise((resolve, reject) => {
            if (e.target.classList.contains('detail-btn')) {
                const pro = e.target.parentElement.parentElement;
                const cloned = pro.cloneNode(true);
                // select page
                const detailsPage = document.getElementById('detail-page');

                //! process info
                let condition,
                    discount,
                    q,
                    CartSection;
                //? quantity
                const quantity = Number(cloned.querySelector('.q').value);
                // id
                const id = cloned.querySelector('.id').value;
                // title
                const title = cloned.querySelector('.pro-title').textContent;
                // images
                //       preview
                const imgPreview = cloned.querySelector('.pro-img img').getAttribute('data-src');
                //       thumb
                const imgs = cloned.querySelectorAll('.thumbnails img');
                imgs.forEach((img, index, array) => {
                    // parse src
                    img.src = img.getAttribute('data-src');
                    // activate 1st img holder <li>
                    array[0].parentElement.classList.add('activeLi');
                });
                const imgThumb = cloned.querySelector('.thumbnails').outerHTML;
                // description
                const description = cloned.querySelector('.description').outerHTML;

                //? check product quantity
                if (quantity <= 0) { //! out of stock 
                    condition = "";
                    discount = "";
                    q = `<p id="outofStockHint"><i>out of stock</i></p>`;
                    CartSection = "";
                } else { //* in stock 
                    // condition
                    const cond_ = cloned.querySelector('.condition').value;
                    const cond = (cond_.toLowerCase().includes('new')) ? `<div id="dps-cond">condition: <span style="background: #30cc71;">${cond_}</span></div>` : `<div id="dps-cond">condition: <span style="background: #ff4758;">${cond_}</span></div>`;
                    condition = cond;
                    // dicsount
                    const dis_ = cloned.querySelector('.discount');
                    const dis = dis_ ? `<div id="discount">save ${dis_.textContent.replace(/\D/gi,"")}%</div>` : "";
                    discount = dis;
                    // quantity
                    q = (quantity > 1) ? `<p id="dps-q"><span>${quantity}</span> items left in stock</p>` : `<p id="dps-q"><span>${quantity}</span> item left in stock</p>`;
                    // price
                    const newP = cloned.querySelector('.pro-new-p').textContent;
                    const oldP_ = cloned.querySelector('.pro-old-p');
                    const oldP = oldP_ ? `<span id="dps-old-p">${oldP_.textContent}</span>` : "";
                    // options
                    let options = "";
                    for (let i = 1; i <= quantity; i += 1) {
                        options += `<option value="${i}">${i}</option>`;
                    }

                    // cart buttons
                    CartSection = `
                    <div id="dps-2">
                        <!-- price -->
                        <div id="dps-p">
                            <span id="dps-new-p">${newP}</span>
                            ${oldP}
                        </div>

                        <!-- form -->
                        <form id="detailsForm">
                            <!-- quantity -->
                            <div id="dps-q-select-con">
                                <select id="dps-q-select" required>
                                    <option value="" disabled selected>quantity</option>
                                    ${options}
                                </select>
                                <span id="select-arrow"></span>
                            </div>

                            <!-- add to cart btn -->
                            <button type="submit">add to cart</button>
                        </form>
                    </div>
                    `;

                }

                // create details page with clicked product
                detailsPage.innerHTML = `
                <!-- back con -->
                <div class="backBtnCon">
                    <!-- start button -->
                    <button type="button" class="detail-back-btn click-detail-back-btn">
                        <svg class="click-detail-back-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.991 511.991">
                            <path class="click-detail-back-btn" d="M153.433 255.99L381.037 18.033c4.063-4.26 3.917-11-.333-15.083-4.23-4.073-10.98-3.896-15.083.333L130.954 248.616a10.69 10.69 0 0 0 0 14.75L365.62 508.7a10.65 10.65 0 0 0 7.708 3.292c2.646 0 5.313-.98 7.375-2.958 4.25-4.073 4.396-10.823.333-15.083L153.433 255.99z" />
                        </svg>
                        back
                    </button>
                    <!-- end button -->

                    <!-- start reference -->
                    <ul class="reference">
                        <li>home</li>
                        <!-- greater than sign -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path d="M365.52 209.85L59.22 67c-16.06-7.5-35.15-.54-42.64 15.52L3 111.6c-7.5 16.06-.54 35.15 15.52 42.64L236.96 256.1 18.5 358C2.47 365.46-4.46 384.5 3 400.52l13.52 29C24 445.54 43.04 452.47 59.06 445l306.47-142.9a32.003 32.003 0 0 0 18.48-29v-34.23c-.01-12.45-7.2-23.76-18.5-29z" />
                        </svg>
                        <li>details</li>
                    </ul>
                    <!-- end reference -->
                </div>


                <!-- !start section -->
                <section id="dps">

                    <!-- *1st -->
                    <div id="dps-1">
                        <!-- title -->
                        <h4 id="dps-title">${title}</h4>
                        <!-- id -->
                        <input type="hidden" id="id" value="${id}">
                        <!-- condition -->
                        ${condition}
                        <!-- discount -->
                        ${discount}
                        <!-- quantity hint -->
                        ${q}
                        <!-- img -->
                        <div id="dps-img">
                            <!-- *img -->
                            <img src="${imgPreview}" alt="preview">
                            <!-- !magnifier -->
                            <div id="magnifier"></div>
                            <!-- ?hint -->
                            <span id="hover-hint">dbl-click or hover to magnify</span>
                        </div>
                        <!-- thumbnails -->
                        <div id="dps-thumb">${imgThumb}</div>
                    </div>

                    <!-- *2nd -->
                    ${CartSection}

                    <!-- *3rd -->
                    <div id="dps-3">
                        <!-- head -->
                        <h3>description</h3>
                        <!-- content -->
                        <div id="dps-des">${description}</div>
                    </div>

                

                    <!-- *4th -->
                    <div id="reviewsCon">
                    

                        <!-- !form -->
                        <div id="reviewFormCon">
                            <h3>Rate this product</h3>
                            <form id="reviewForm">
                                <div>
                                    <!-- title -->
                                    <label>rate</label>
                                    <!-- field -->
                                    <div id="rate">
                                        <label>
                                            <input type="checkbox" id="star1" required>
                                            <span class="switch"></span>
                                        </label>
                                        <label>
                                            <input type="checkbox" id="star2">
                                            <span class="switch"></span>
                                        </label>
                                        <label>
                                            <input type="checkbox" id="star3">
                                            <span class="switch"></span>
                                        </label>
                                        <label>
                                            <input type="checkbox" id="star4">
                                            <span class="switch"></span>
                                        </label>
                                        <label>
                                            <input type="checkbox" id="star5">
                                            <span class="switch"></span>
                                        </label>
                                    </div>
                                </div>
                    
                                <div>
                                    <!-- title -->
                                    <label>message</label>
                                    <!-- field -->
                                    <textarea placeholder="e.g. a good product"></textarea>
                                </div>
                                <button type="submit">submit review</button>
                            </form>
                        </div>


                        <section id="productRev"></section>


                    </div>

                </section>
                <!-- !end section -->
                `;

                // style Page
                document.body.style.overflow = 'hidden';
                detailsPage.style.display = 'block';

                resolve(`Loaded Product`);
            }
        });
    }

    // preview slider
    static slider() {
        // select main img
        const preview = document.querySelector('#dps-img img');
        // select images
        const imgs = document.querySelectorAll('#dps-thumb img');
        // select lis
        const lis = document.querySelectorAll('#dps-thumb li');

        if (imgs.length > 1) {
            // loop to add click event
            imgs.forEach(img => {
                img.addEventListener('click', (e) => {
                    let el = e.target;
                    //* update preview
                    preview.src = el.src;

                    //? animate preview
                    preview.style.opacity = '0';
                    preview.classList.remove('slide');
                    setTimeout(() => preview.classList.add('slide'), 0);

                    //! remove active class
                    lis.forEach((li) => li.classList.remove('activeLi'));

                    //* add active class to current img
                    el.parentElement.classList.add('activeLi');
                });
            });
        } else return;

    }

    // magnify preview
    static magnify() {
        // select elements
        const magnifier = document.getElementById('magnifier');
        const img = document.querySelector('#dps-img img');
        const hint = document.getElementById('hover-hint');
        let x2, y2;

        //* mousemove over preview
        img.addEventListener('mousemove', (e) => {
            // prevent default behavior
            e.preventDefault();
            let w = magnifier.offsetWidth / 2;
            let h = magnifier.offsetHeight / 2;
            // !start getting cursor pos
            e = e || window.event;
            let a = e.target.getBoundingClientRect();
            let x = e.pageX - (a.left + window.pageXOffset);
            let y = e.pageY - (a.top + window.pageYOffset);
            // !end getting cursor pos

            // show magnifier
            magnifier.style.visibility = 'visible';
            // hide hint
            hint.className = 'removeHint';

            //* center magnifier
            x2 = x - w;
            y2 = y - h;
            magnifier.style.transform = `translate(${x2}px, ${y2}px)`;
            magnifier.style.backgroundImage = ``;
        });

        //* mousemove over magnifier
        magnifier.addEventListener('mousemove', (e) => {
            // prevent default behavior
            e.preventDefault();
            let w = magnifier.offsetWidth / 2;
            let h = magnifier.offsetHeight / 2;

            // !start getting cursor pos
            e = e || window.event;
            let a = e.target.getBoundingClientRect();
            let x = e.pageX - (a.left + window.pageXOffset + w);
            let y = e.pageY - (a.top + window.pageYOffset + h);
            // !end getting cursor pos

            // show magnifier
            magnifier.style.visibility = 'visible';
            // hide hint
            hint.className = 'removeHint';

            // update x,y pos
            x2 += x;
            y2 += y;

            //! detect walls
            if (x2 > img.clientWidth - w) { // right
                x2 = img.clientWidth - w;
                // hide magnifier
                magnifier.style.visibility = 'hidden';
                // show hint
                hint.className = 'addHint';
            }
            if (x2 < -w) { // left
                x2 = -w;
                // hide magnifier
                magnifier.style.visibility = 'hidden';
                // show hint
                hint.className = 'addHint';
            }
            if (y2 > img.clientHeight - h) { // bottom
                y2 = img.clientHeight - h;
                // hide magnifier
                magnifier.style.visibility = 'hidden';
                // show hint
                hint.className = 'addHint';
            }
            if (y2 < -h) { // top
                y2 = -h;
                // hide magnifier
                magnifier.style.visibility = 'hidden';
                // show hint
                hint.className = 'addHint';
            }

            //* move magnifier
            magnifier.style.transform = `translate(${(x2)}px, ${(y2)}px)`;

            // get background pos x,y
            const X = (-(x2 * Details.zoom)) - w;
            const Y = (-(y2 * Details.zoom)) - h;

            // update background
            magnifier.style.backgroundImage = `url('${img.src}')`;
            magnifier.style.backgroundSize = `${img.offsetWidth * Details.zoom}px ${img.offsetHeight * Details.zoom}px`;
            magnifier.style.backgroundPosition = `${X}px ${Y}px`;
        });

        //! mouseleave over magnifier
        magnifier.addEventListener('mouseleave', (e) => {
            // hide magnifier
            magnifier.style.visibility = 'hidden';
            // show hint
            hint.className = 'addHint';
        });
    }

    // submit product to cart | //! this the same fn in cart page but with select tag
    static submitProToCart(select, id) {
        // select all products
        const pro = Pro.container.querySelectorAll('.sec');
        // select cart elements
        const toBeAppendIn = document.getElementById('cps');
        // select notification
        const notify = document.getElementById('notify');
        const notifyContent = document.querySelector('#notify p');
        // select form fields | //! must be declared after selecting all products => (Pro.container)
        const form = document.getElementById("detailsForm");

        if (form) {
            // onsubmit
            form.addEventListener('submit', e => {
                e.preventDefault();
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
                        if (i == select.value) options += `<option value="${i}" selected>${i}</option>`;
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
                    <span class="cps-t-price">${Pro.currency} ${(+(price.replace(/\D/gi,"")) * (+select.value)).toLocaleString()}</span>
                    `;

                    //* append product
                    toBeAppendIn.append(div);

                    // init indicator
                    Cart.cartIndicator();

                    // init sum prices
                    Cart.sumPrices();

                    // reset form
                    form.reset();

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

            });
        }
    }

    // get reviews
    static getReviews(id) {
        // got data successfully
        const gotData = data => {
            // check if there is data in collection
            if (data.val() !== null) {
                console.log('Fetched Reviews');
                Details.displayReviews(data.val(), id);
            } else console.log('Reviews Collection Is Empty!');
        };

        // error while getting data
        const gotError = err => console.log(err + '\n' + 'Error While Fetching Reviews!');

        //! listen to value event
        reviewsCol.on('value', gotData, gotError);
    }

    // process reviews
    static displayReviews(data, id) {
        // select container
        const container = document.getElementById('productRev');
        //! get reviews keys
        const keys = Object.keys(data);
        //! wipe out array
        Details.reviewsArr = [];
        //* loop to get all reviews objects and push them to array
        for (let key of keys) Details.reviewsArr.push(data[key]);

        // filter array based on opened product
        let filteredArr = Details.reviewsArr.filter(item => item.id == id);

        // html rate fn
        const makeRate = (num) => {
            let string = "";
            if (num == 1) {
                string = `
                <span class="no-star star"></span>
                <span class="no-star"></span>
                <span class="no-star"></span>
                <span class="no-star"></span>
                <span class="no-star"></span>
                `;
            } else if (num == 2) {
                string = `
                <span class="no-star star"></span>
                <span class="no-star star"></span>
                <span class="no-star"></span>
                <span class="no-star"></span>
                <span class="no-star"></span>
                `;
            } else if (num == 3) {
                string = `
                <span class="no-star star"></span>
                <span class="no-star star"></span>
                <span class="no-star star"></span>
                <span class="no-star"></span>
                <span class="no-star"></span>
                `;
            } else if (num == 4) {
                string = `
                <span class="no-star star"></span>
                <span class="no-star star"></span>
                <span class="no-star star"></span>
                <span class="no-star star"></span>
                <span class="no-star"></span>
                `;
            } else if (num == 5) {
                string = `
                <span class="no-star star"></span>
                <span class="no-star star"></span>
                <span class="no-star star"></span>
                <span class="no-star star"></span>
                <span class="no-star star"></span>
                `;
            }
            return string;
        };

        //? make reviews as html
        if (filteredArr.length) { //* has reviews
            // calc total stars ratings
            const star_1 = filteredArr.filter(star => star.rate == 1);
            const star_2 = filteredArr.filter(star => star.rate == 2);
            const star_3 = filteredArr.filter(star => star.rate == 3);
            const star_4 = filteredArr.filter(star => star.rate == 4);
            const star_5 = filteredArr.filter(star => star.rate == 5);
            // final rate as decimal
            const calcRate = (((star_5.length * 5) + (star_4.length * 4) + (star_3.length * 3) + (star_2.length * 2) + (star_1.length * 1)) / filteredArr.length).toFixed(1);
            //   final rate as percentage
            const percent = Math.floor((calcRate / 5) * 100);

            //! make stars system as html
            let starsSys = `
            <!-- total rates -->
            <div id="overallRate">
                <div id="finalNum">${calcRate}</div>
                <div id="starsImg">
                    <span id="starsBase"></span>
                    <span id="starsActual" style="width:${percent}%;"></span>
                </div>
                <div id="starsInfo">
                    <h3>${(/0/g.test(calcRate)) ? calcRate.replace(/.0/g,"") : calcRate} out of 5</h3>
                    <p>${filteredArr.length} ${(filteredArr.length >1) ? "ratings" : "rating"}</p>
                </div>
            </div>
            `;

            // rank reviews from higher stars to lower
            let sortedArr = filteredArr.sort((a, b) => Number(b.rate) - Number(a.rate));

            //! check if customer wrote a message and filter them
            const filteredSection = sortedArr.filter(item => item.msg != "");

            //* if there are messages
            if (filteredSection.length) {

                const section = filteredSection.map(item => {
                    return `
                    <section class="reviewSection">
                    <div class="rate">${makeRate(item.rate)}</div>
                    <div class="time">${item.time}</div>
                    <p class="msg">${item.msg}</p>         
                    </section>
                    `;
                }).join("");

                //* append reviews
                container.innerHTML = `${starsSys}<div id="currentReviewsCon"><h3>reviews</h3><div id="currentReviews">${section}</div></div>`;

            } else container.innerHTML = starsSys;

        } else container.innerHTML = `<div id="noReviews">No ratings yet</div>`;
    }

    // submit review to relative product
    static submitReview() {
        // select form fields
        const form = document.getElementById("reviewForm");
        const msg = document.querySelector('#reviewForm textarea');
        const rate = document.getElementById('rate');
        const rateInputs = document.querySelectorAll('#rate input');

        //* rating system
        rate.addEventListener('click', e => {
            if (e.target.nodeName.toLowerCase() === 'input') {
                //! wipe out array
                Details.rateArr = [];
                //! reset all inputs
                rateInputs.forEach(input => input.checked = false);

                if (e.target.id === "star1") { // star 1
                    e.target.checked = true;
                } else if (e.target.id === "star2") { // star 2
                    e.target.checked = true;
                    rateInputs[0].checked = true;
                } else if (e.target.id === "star3") { // star 3
                    e.target.checked = true;
                    rateInputs[0].checked = true;
                    rateInputs[1].checked = true;
                } else if (e.target.id === "star4") { // star 4
                    e.target.checked = true;
                    rateInputs[0].checked = true;
                    rateInputs[1].checked = true;
                    rateInputs[2].checked = true;
                } else if (e.target.id === "star5") { // star 5
                    e.target.checked = true;
                    rateInputs[0].checked = true;
                    rateInputs[1].checked = true;
                    rateInputs[2].checked = true;
                    rateInputs[3].checked = true;
                }

                //* get final rate
                rateInputs.forEach(input => {
                    if (input.checked) Details.rateArr.push(Number(input.id.replace(/\D/gi, "")));
                });
                // get value
                Details.rateNum = Math.max(...Details.rateArr);
            }
        });

        //! onsubmit
        form.addEventListener('submit', e => {
            e.preventDefault();
            //! filter bad words
            let badwords_en = ["<[^>]*>(.*?)<[^>]*>", "fucken", "fucking", "fuck", "ass", "pussy", "a7a", "bitch", "porn", "dick", "boobs", "55+", "gay", "lesbian"];
            let badwords_ar = ["احا", "خول", "كس", "زبر", "نيك", "متناكة", "متناك", "فشيخة", "فشيخه", "فشيخ", "فشخ", "شرموطة", "شرموطه", "شرموط", "وسخة", "وسخه", "وسخ", "بنت", "ابن", "دين", "اهلك", "اهل", "بضان", "بيض", "خخ+", "بزاز", "بز", "طياز", "طيزك", "طيز", "المتناكة", "المتناك", "ياولاد", "الشرموط", "الشرموطه", "ولاد", "المتناكه"];
            let badwords = [...badwords_en, ...badwords_ar];
            // make pattern of bad words
            let pattern = badwords.map(w => `${w}|`).join("").slice(0, -1);
            // make regex with that pattern
            let regex = new RegExp(`${pattern}`, "gi");
            // filter message
            const filteredMsg = msg.value.replace(regex, "");
            const message = (filteredMsg.trim() != "") ? filteredMsg.trim() : "";
            // store time
            const date = new Date();
            const y = date.getFullYear();
            const m = Details.mArr[date.getMonth()];
            const d = date.getDate();
            const time = `${d} ${m} ${y}`;
            // get product id 
            const id = document.querySelector('#detail-page #id').value;

            // review object
            let reviewObj = {
                id: id,
                rate: Details.rateNum,
                time: time,
                msg: message
            };

            //* add review
            reviewsCol.push().set(reviewObj);

            //! reset form
            form.reset();

        });
    }

}

// init
Details.global();

//! events
// show details page
document.addEventListener('click', e => {
    Details.showPage(e).then(res => {
            console.log(res); // log success
            // get current product id
            const id = document.querySelector('#detail-page #id').value;
            // get select box
            const select = document.getElementById('dps-q-select');

            Details.slider(); // init slider
            Details.magnify(); // init magnifier

            if (select) {
                // init submit product to cart
                Details.submitProToCart(select, id);
                // blur select box
                select.addEventListener('change', e => e.target.blur());
            }

            Details.getReviews(id); // init get product reviews
            Details.submitReview(); // init submit review
        })
        .catch(err => console.log(err));
});
// hide details page
Details.page.addEventListener('click', Details.hidePage);
// todo fix flickering 