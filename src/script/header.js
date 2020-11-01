class Header {
 static global() {
  Header.logo = document.getElementById('logo');
  // carousel
  Header.num = 0;
  Header.time = 5000;
  Header.auto = true;
  Header.interval;
  // offers
  Header.slider = document.getElementById('inner-offers');
  Header.nextBtn = document.querySelector('.click-offers-next');
  Header.prevBtn = document.querySelector('.click-offers-prev');
  Header.isDown = false;
  Header.startX;
  Header.scrollLeft;
  Header.scrollToggle = true;
 }

 // navigate home
 static getHome(e) {
  // select elements
  const headerPage = document.querySelector('header');
  const productPage = document.getElementById('products-wrapper');
  const menuBtn = document.querySelector('.menu-btn');

  const nav = document.getElementById('side-nav');
  const btn = document.querySelector('.menu-btn');
  const pro = document.getElementById('products');
  const loadBtn = document.getElementById('loadBtnContainer');

  //! hide product page
  productPage.style.display = 'none';
  //! hide side nav btn
  menuBtn.style.display = 'none';
  //* show header wapper
  headerPage.style.display = 'block';

  // remove active classes
  btn.classList.remove('activeSideNavBtn');
  nav.classList.remove('activeSideNav');
  pro.classList.remove('activeSideNav');
  loadBtn.classList.remove('activeSideNav');
  Nav.toggle = true;
 }

 //! advs carousel
 // Next slide
 static next() {
  const slides = document.querySelectorAll('.carousel-content');
  const slidesText = document.querySelectorAll('.carousel-content .carousel-text');
  const slidesImg = document.querySelectorAll('.carousel-content .carousel-img');
  const dot = document.querySelectorAll('#carousel-dots span');
  let max = slides.length - 1;

  // !remove active class
  slides.forEach((slide) => slide.classList.remove('active-slide'));
  slidesText.forEach((text) => text.classList.remove('active-slide-text'));
  slidesImg.forEach((img) => img.classList.remove('active-slide-img'));
  dot.forEach((dot) => dot.classList.remove('active-dot'));

  // make counter
  if (Header.num < max) Header.num += 1;
  else Header.num = 0;

  // *add active class
  slides[Header.num].classList.add('active-slide');
  slidesText[Header.num].classList.add('active-slide-text');
  slidesImg[Header.num].classList.add('active-slide-img');
  dot[Header.num].classList.add('active-dot');
 }

 // Navigate slides
 static nav() {
  const slides = document.querySelectorAll('.carousel-content');
  const slidesText = document.querySelectorAll('.carousel-content .carousel-text');
  const slidesImg = document.querySelectorAll('.carousel-content .carousel-img');
  const dots = document.querySelectorAll('#carousel-dots span');

  dots.forEach(function (dot, index, array) {
   dot.addEventListener('click', function (e) {
    // sync i with index number
    array[index].i = index;

    //* get clicked dot index
    let num = e.target.i;

    // update num
    Header.num = num;

    // !remove active class
    slides.forEach((slide) => slide.classList.remove('active-slide'));
    slidesText.forEach((text) => text.classList.remove('active-slide-text'));
    slidesImg.forEach((img) => img.classList.remove('active-slide-img'));
    dots.forEach((el) => el.classList.remove('active-dot'));

    // *add active class
    slides[Header.num].classList.add('active-slide');
    slidesText[Header.num].classList.add('active-slide-text');
    slidesImg[Header.num].classList.add('active-slide-img');
    dots[Header.num].classList.add('active-dot');

    // clear and run next
    if (Header.auto) {
     clearInterval(Header.interval);
     Header.interval = setInterval(Header.next, Header.time);
    }

   });
  });



 }

 //! offers carousel
 // next offer
 static nextOffers() {
  let boxWidth = 280;
  let boxMarginRight = 20;
  let w = boxWidth + boxMarginRight;

  // scroll 
  Header.slider.scrollBy({
   top: 0,
   left: w,
   behavior: 'smooth'
  });
 }

 // prev offer
 static prevOffers() {
  let boxWidth = 280;
  let boxMarginRight = 20;
  let w = boxWidth + boxMarginRight;

  // scroll 
  Header.slider.scrollBy({
   top: 0,
   left: -w,
   behavior: 'smooth'
  });
 }

 // navigate by mouse
 static navOffers() {
  // mouse down
  Header.slider.addEventListener('mousedown', (e) => {
   // active down
   Header.isDown = true;
   //* get startX point
   Header.startX = e.pageX - Header.slider.offsetLeft;
   //! store last scrollleft value
   Header.scrollLeft = Header.slider.scrollLeft;
   // add class
   Header.slider.classList.add('move-offers');
  });

  // mouse leave
  Header.slider.addEventListener('mouseleave', () => {
   // disable down
   Header.isDown = false;
   // remove class
   Header.slider.classList.remove('move-offers');
   // run
   Header.scrollToggle = true;
  });

  // mouse up
  Header.slider.addEventListener('mouseup', () => {
   // disable down
   Header.isDown = false;
   // remove class
   Header.slider.classList.remove('move-offers');
  });

  // mouse move
  Header.slider.addEventListener('mousemove', (e) => {
   if (Header.isDown) { // if isDown true
    // prevent default behaviour
    e.preventDefault();
    // add class
    Header.slider.classList.add('move-offers');
    // get moveTo point
    const x = e.pageX - Header.slider.offsetLeft;
    // calc diff
    const walk = (x - Header.startX);
    // continue scroll from last scrollleft value - walk
    Header.slider.scrollLeft = Header.scrollLeft - walk;
   }
   // die
   Header.scrollToggle = false;
  });

  //! touch screens
  Header.slider.addEventListener('touchstart', (e) => Header.scrollToggle = false);
  Header.slider.addEventListener('touchend', (e) => Header.scrollToggle = true);

 }

 // clone offers
 static cloneOffers(container) {
  // select offers loader
  const loader = document.getElementById('offersLoader');
  // select offers main container
  const offersCon = document.getElementById('offers');
  // select main container
  const toBeAppendIn = document.getElementById('inner-offers');
  // select all products
  const section = container.querySelectorAll('.sec');
  // make array
  let proArr = [...section];

  // filter products based on discount percentage
  let filteredArr = proArr.filter((item) => {
   // select discount
   let dis = item.querySelector('.discount');

   if (dis) { //! check if discount exists
    //* get percentage %
    let percent = Number(dis.textContent.replace(/\D/gi, ""));

    return percent >= 10; // get products that has discount greater than or equal 10 %
   }

  });

  // check discounted products
  if (filteredArr.length) { //* if there are products
   // rank products
   let sortedArr = filteredArr.sort((a, b) => {
    let numA = Number(a.querySelector('.discount').textContent.replace(/\D/gi, ""));
    let numB = Number(b.querySelector('.discount').textContent.replace(/\D/gi, ""));

    return numB - numA; //! rank from higher to lower
   });

   // get max number of products to be showen
   const max = (sortedArr.length >= 20) ? 20 : sortedArr.length;

   //! wipe out
   toBeAppendIn.innerHTML = "";

   //* loop to show products
   for (let i = 0; i < max; i += 1) {
    // clone products
    let cloned = sortedArr[i].cloneNode(true);

    // load imgs
    let img = cloned.querySelector('.pro-img img');
    img.src = img.getAttribute('data-src');

    //* append offers
    toBeAppendIn.append(cloned);
   }

   //! hide loader
   loader.style.display = 'none';

   //* auto scroll
   setInterval(() => {
    if (Header.scrollToggle) {
     const end = ((Header.slider.scrollWidth - Header.slider.clientWidth) === Header.slider.scrollLeft) ? "" : Header.nextOffers();
    }
   }, 5000);

  } else offersCon.style.display = 'none'; //! if not

 }

}

// init
Header.global();

//! events
// get home
Header.logo.addEventListener('click', Header.getHome);

//* advs carousel
// next
if (Header.auto) Header.interval = setInterval(Header.next, Header.time);
// dots
Header.nav();

//* offers carousel
// mouse
Header.navOffers();
// next
Header.nextBtn.addEventListener('click', Header.nextOffers);
// prev
Header.prevBtn.addEventListener('click', Header.prevOffers);