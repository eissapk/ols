class Wishlist {

 static global() {
  Wishlist.nav = document.querySelector('nav');
  Wishlist.page = document.getElementById('wishlist-page');
  Wishlist.arr = [];
 }

 // show page
 static showPage(e) {
  if (e.target.classList.contains('click-wishlist')) {
   const page = document.getElementById('wishlist-page');

   // init check wishlist
   Wishlist.checkWishlist();
   // init remove item
   Wishlist.removeItem();

   // show page 
   document.body.style.overflow = 'hidden';
   page.style.display = 'block';
  }
 }

 // hide page
 static hidePage(e) {
  if (e.target.classList.contains('click-wishlist-back-btn')) {
   // select page
   const page = document.getElementById('wishlist-page');
   document.body.style.overflow = 'auto';
   page.style.display = 'none';
  }
 }

 // check wishlist
 static checkWishlist() {
  const pageAlert = document.getElementById('empty-wishlist-alert');
  const itemsHolder = document.getElementById('wps');

  if (itemsHolder.hasChildNodes()) { //* if there are items in wishlist page
   pageAlert.style.display = 'none';
  } else { //! if there are no items in wishlist page
   pageAlert.style.display = 'block';
  }
 }

 // wishlist items indicator
 static wishlistIndicator() {
  // select wishlist items indicator
  const indicator = document.querySelector('.wish-dot');
  // select wishlist items container
  const wishlistItemsCon = document.getElementById('wps');

  //* check if there are items in wishlist
  if (wishlistItemsCon.hasChildNodes()) {
   // select all items
   const wishlistItems = document.querySelectorAll('#wps .sec');
   // update items indicator
   indicator.textContent = wishlistItems.length;

   // reset indicator
   indicator.style.opacity = '0';
   indicator.style.display = 'block';

   // reset animation
   indicator.classList.remove('animate-wish-dot');
   // add animation
   setTimeout(() => indicator.classList.add('animate-wish-dot'), 0);
  } else { //! if no items in wishlist then hide indicator
   indicator.style.display = 'none';
  }
 }

 // add items to wishlist
 static addToWishlist() {
  document.addEventListener('click', e => {
   // detect if wish icon cliked
   if (e.target.classList.contains('click-wish')) {
    // select wishlist container
    const toBeAppendIn = document.getElementById('wps');
    // select all products
    const pro = Pro.container.querySelectorAll('.sec');
    // select container
    const con = e.target.parentElement.parentElement;
    // get clicked item id
    const id = con.querySelector('.id').value;
    // select notification
    const notify = document.getElementById('notify');
    const notifyContent = document.querySelector('#notify p');

    // filter clicked product
    let filteredArr = [...pro].filter(item => item.querySelector('.id').value == id);

    // if there is a matched item
    if (filteredArr.length) {
     const cloned = filteredArr[0].cloneNode(true);

     // select wish btn
     const wishBtn = cloned.querySelector('.wish-icon-con');
     // create remove button
     const btn = document.createElement('button');
     // add type
     btn.type = "button";
     // add class
     btn.className = "wish-del-btn";
     // append to btn
     btn.innerHTML = `
     <span class="click-wish-del-btn d1"></span>
     <span class="click-wish-del-btn d2"></span>
     <span class="click-wish-del-btn d3"></span>
     `;
     //* replace wish button with remove button
     wishBtn.replaceWith(btn);

     // load img
     const img = cloned.querySelector('.pro-img img');
     // load imgs
     img.setAttribute('src', img.getAttribute('data-src'));

     //* append clicked item to wishlist page
     toBeAppendIn.append(cloned);

     //! storage
     // update array
     Wishlist.arr = Wishlist.getWishlist();

     // push to array
     Wishlist.arr.push(id);

     // remove duplication
     const newArr = [...new Set(Wishlist.arr)];
     // update array
     Wishlist.arr = newArr;

     // set localStorage
     localStorage.setItem('wishlist', JSON.stringify(Wishlist.arr));

     // init indicator
     Wishlist.wishlistIndicator();

     //! update notify text and color
     notify.style.background = '#25b869'; //* success
     notifyContent.textContent = "item added to wishlist!";

     // check if product in cart or not
     if (toBeAppendIn.hasChildNodes()) {
      const itemsInWishlist = toBeAppendIn.querySelectorAll('#wps .sec');
      let wishlistItemsArr = [...itemsInWishlist].filter(item => item.querySelector('.id').value == id);

      // loop to remove all duplicated pros
      if (wishlistItemsArr.length > 1) {
       //* update notify text
       notify.style.background = '#ffa700'; //! alert
       notifyContent.textContent = "item already in wishlist!";
       //! remove all duplicated items
       for (let i = 1; i < wishlistItemsArr.length; i += 1) wishlistItemsArr[i].remove();
       // init indicator
       Wishlist.wishlistIndicator();
      }
     }

     //* show notify
     notify.style.display = 'block';
     //! hide notify after 3 seconds
     setTimeout(() => notify.style.display = 'none', 3000);

    }

   }
  });
 }

 // delete items from wishlist page
 static removeItem() {
  const page = document.getElementById('wishlist-page');
  // listen to remove button
  page.addEventListener("click", e => {
   if (e.target.classList.contains('click-wish-del-btn')) {
    const item = e.target.parentElement.parentElement;
    const id = item.querySelector('.id').value;
    // remove item
    item.remove();

    //! storage
    // update array
    Wishlist.arr = Wishlist.getWishlist();

    // loop to remove clicked items id
    Wishlist.arr.filter((item, index, array) => {
     if (item == id) array.splice(index, 1);
    });

    //? set localStorage
    localStorage.setItem('wishlist', JSON.stringify(Wishlist.arr));

    // init check wishlist
    Wishlist.checkWishlist();
    // init indicator
    Wishlist.wishlistIndicator();
   }
  });
 }

 // check wishlist storage
 static getWishlist() {
  let arr;
  if (localStorage.getItem('wishlist') === null) {
   arr = [];
  } else {
   arr = JSON.parse(localStorage.getItem('wishlist'));
  }
  return arr;
 }

 // load wishlist from storage //todo improve filteredArr
 static loadWishlist(container) {
  // select wishlist items indicator
  const indicator = document.querySelector('.wish-dot');
  // select wishlist container
  const toBeAppendIn = document.getElementById('wps');
  // select all products
  const pro = container.querySelectorAll('.sec');
  // get all ids in storage
  const storedArr = Wishlist.getWishlist();

  //! wipe out
  let filteredArr = [];
  toBeAppendIn.innerHTML = "";

  // loop to filter items based on id
  for (let id of storedArr) {
   let arr = [...pro].filter(item => item.querySelector('.id').value == id);
   filteredArr.push(arr[0]);
  }

  //! remove undefined items in wishlist
  filteredArr.forEach((item, index, array) => {
   if (item == undefined) array.splice(index, 1);
  });

  //? if there are items in array
  if (filteredArr.length) {
   // loop
   filteredArr.forEach(item => {
    if (item) { //! check if item exists
     // clone
     const cloned = item.cloneNode(true);
     // select wish btn
     const wishBtn = cloned.querySelector('.wish-icon-con');
     // create remove button
     const btn = document.createElement('button');
     // add type
     btn.type = "button";
     // add class
     btn.className = "wish-del-btn";
     // append to btn
     btn.innerHTML = `
    <span class="click-wish-del-btn d1"></span>
    <span class="click-wish-del-btn d2"></span>
    <span class="click-wish-del-btn d3"></span>
    `;
     //* replace wish button with remove button
     wishBtn.replaceWith(btn);

     // load img
     const img = cloned.querySelector('.pro-img img');
     // load imgs
     img.setAttribute('src', img.getAttribute('data-src'));

     //* append item
     toBeAppendIn.append(cloned);

     //! init indicator
     //* check if there are items in wishlist
     if (toBeAppendIn.hasChildNodes()) {
      // select all items
      const wishlistItems = document.querySelectorAll('#wps .sec');
      // update items indicator
      indicator.textContent = wishlistItems.length;
      indicator.style.display = 'block';
     } else indicator.style.display = 'none';
    }
   });
  }

  console.log('Fetched Wishlist');
 }

}
// init
Wishlist.global();
Wishlist.addToWishlist();

//! events
// show page 
Wishlist.nav.addEventListener('click', Wishlist.showPage);
// hide page
Wishlist.page.addEventListener('click', Wishlist.hidePage);