class Pro {
    static global() {
        Pro.currency = "L.E";
        Pro.container;
        Pro.isFetched = false;
    }

    // add products to dom
    static getProducts(data) {
        return new Promise((resolve, reject) => {
            let error = false;
            if (!error) {
                //! create products
                const products = data.map(product => {
                    // discount
                    const percent = Math.round(((Number(product.price.old) - Number(product.price.current)) / Number(product.price.old)) * 100);
                    const discount = ((product.price.old != "") && (percent > 0) && (Number(product.quantity) > 0)) ? `<div class="discount">${percent}% off</div>` : "";
                    // price
                    const oldP = (product.price.old != "") ? `<span class="pro-old-p">${Pro.currency} ${(+product.price.old).toLocaleString()}</span>` : "";
                    // out of stock
                    const cartBtn = (Number(product.quantity) <= 0) ? `<button type="button" class="add-btn" style="background: #eee;" disabled>add to cart</button>` : `<button type="button" class="add-btn">add to cart</button>`;
                    const price = (Number(product.quantity) <= 0) ? "" : `<!-- new price --><span class="pro-new-p">${Pro.currency} ${(+product.price.current).toLocaleString()}</span><!-- old price -->${oldP}`;
                    // imgs
                    const imgs = product.img.map(item => `<li><img data-src="${item}" alt="thumbnail"></li>`).join('');
                    // description
                    const sentence = product.description.sentence;
                    const des_ = product.description.items.map(item => `<li><i>${item}</i></li>`).join('');
                    const des = (product.description.items[0] == "null" && product.description.items.length == 1) ? "" : `<ul>${des_}</ul>`;

                    return `
                    <section class="${product.category} sec">

                        <!-- discount -->
                        ${discount}

                        <!-- wish list icon -->
                        <div class="wish-icon-con">
                            <img src="img/wish-icon.svg" alt="wish" class="click-wish">
                        </div>

                        <!-- *IMG -->
                        <div class="pro-img">
                            <img data-src="${product.img[0]}" alt="${product.title}">
                        </div>

                        <!-- *TITLE -->
                        <h4 class="pro-title">${product.title}</h4>

                        <!-- *PRICE -->
                        <div class="pro-p">
                            ${price} 
                        </div>

                        <!-- BTNS -->
                        <div class="pro-btns">
                            <button type="button" class="detail-btn">details</button>
                            ${cartBtn}
                        </div>

                        <!-- ! HIDDEN INFO -->
                        <!-- *ID -->
                        <input class="id" type="hidden" value="${product.id}">

                        <!-- *KEYWORDS -->
                        <input class="keywords" type="hidden" value="${[...(product.keywords)]}">

                        <!-- *CONDITION -->
                        <input class="condition" type="hidden" value="${product.condition}">

                        <!-- *QUANTITY -->
                        <input class="q" type="hidden" value="${product.quantity}">

                        <!-- *THUMBNAILS -->
                        <ul class="thumbnails">${imgs}</ul>

                        <!-- DESCRIPTION -->
                        <div class="description">
                            ${(sentence != "") ? `<p>${sentence}</p>` : ""}
                            ${des}
                        </div>

                    </section>
                    `;

                }).join("");

                // create products container
                const container = document.createElement('div');
                //* append to container
                container.innerHTML = products;

                //! store finished products
                Pro.container = container;
                Pro.isFetched = true;
                resolve('Processed Products');

            } else reject(`Couldn't Process Products!`);
        });
    }

    // handle categories
    static displayCategory(wrapper) {
        //! make array of all products
        const arr = [...wrapper.querySelectorAll('.sec')];
        // filter electric category
        const electricArr = arr.filter(item => item.classList.contains('electric'));
        // filter electronic category
        const electronicArr = arr.filter(item => item.classList.contains('electronic'));
        // filter supplies category
        const suppliesArr = arr.filter(item => item.classList.contains('supplies'));
        // filter kitchen category
        const kitchenArr = arr.filter(item => item.classList.contains('kitchen'));
        // filter perfume category
        const perfumeArr = arr.filter(item => item.classList.contains('perfume'));

        // select elements
        // pages
        const productsPage = document.getElementById('products-wrapper');
        const homePage = document.querySelector('header');
        // containers
        const pro = document.getElementById('products');
        const btnCon = document.getElementById('loadBtnContainer');
        const menuBtn = document.querySelector('.menu-btn');
        let btn;

        // load Category fn
        const loadCategory = (filteredArr, target) => {
            //? ADD CURRENT CLASS TO CLICKED CATEGORY
            //! remove current class 
            const tabs = document.querySelectorAll('.currentTab');
            tabs.forEach(tab => tab.classList.remove('currentTab'));
            const currentTabColor = document.querySelectorAll('.currentTabColor');
            currentTabColor.forEach(tab => tab.classList.remove('currentTabColor'));

            // get clicked category class
            const className = target.classList[0];
            // select all anchors
            const a = document.querySelectorAll('#side-nav a');
            //* loop to add current class
            a.forEach(elm => {
                if (elm.classList.contains(className)) {
                    elm.querySelector('span').classList.add('currentTab');
                    elm.classList.add('currentTabColor');
                };
            });

            // numbers
            let start = 0;
            let num = filteredArr.length >= 5 ? 5 : filteredArr.length; // default number of products to be shown
            let max = filteredArr.length; // max number of products to be shown

            //! hide load btn if showen products === the max
            if (num === max) btn.style.display = "none";
            else btn.style.display = "block";

            // load fn
            const loadMore = () => {
                for (let i = start; i < num; i += 1) {
                    // clone
                    const cloned = filteredArr[i].cloneNode(true);
                    const img = cloned.querySelector('.pro-img img');
                    // load imgs
                    img.setAttribute('src', img.getAttribute('data-src'));
                    // append products
                    pro.append(cloned);
                }
            };
            loadMore();

            // !click load btn to show next elements
            btn.addEventListener("click", () => {
                if (num < max) { // *increase elements by [5] each click
                    num += 5;
                    start += 5;
                }
                if (num >= max) { // !if num reached max
                    // set num to max
                    num = max;
                    // hide btn
                    btn.style.display = "none";
                }
                // call func
                loadMore();
            });
        };

        //* display categories
        document.addEventListener('click', e => {
            if (e.target.classList.contains('nb')) { // trigger all btns
                // create load more button
                btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = 'load more';

                //! wipe out 
                pro.innerHTML = "";
                btnCon.innerHTML = "";
                //* append btn
                btnCon.append(btn);

                //! hide home page
                homePage.style.display = 'none';
                //* show products warpper
                productsPage.style.display = 'block';
                //* show side nav btn
                menuBtn.style.display = 'block';
            }

            if (e.target.classList.contains('electric-btn')) { // click electric category
                loadCategory(electricArr, e.target);
            } else if (e.target.classList.contains('electronic-btn')) { // click electronic category
                loadCategory(electronicArr, e.target);
            } else if (e.target.classList.contains('supplies-btn')) { // click supplies category
                loadCategory(suppliesArr, e.target);
            } else if (e.target.classList.contains('kitchen-btn')) { // click kitchen category
                loadCategory(kitchenArr, e.target);
            } else if (e.target.classList.contains('perfume-btn')) { // click perfume category
                loadCategory(perfumeArr, e.target);
            }

        });

    }

}

// init
Pro.global();