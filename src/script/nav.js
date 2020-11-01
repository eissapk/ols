class Nav {
 static global() {
  Nav.navCon = document.querySelector('nav');
  // side nav
  Nav.sideNav = document.getElementById('side-nav');
  Nav.menuBtn = document.querySelector('.menu-btn');
  Nav.toggle = true;
  // search engine
  Nav.searchInput = document.getElementById('engine');
  Nav.num = 0;
 }

 // fire side nav
 static fireMenu(e) {
  const nav = document.getElementById('side-nav');
  const btn = document.querySelector('.menu-btn');
  const pro = document.getElementById('products');
  const loadBtn = document.getElementById('loadBtnContainer');
  const engineCon = document.getElementById('engineCon');
  const mql = window.matchMedia('(max-width: 767px)');

  if (e.target.classList.contains('click-menu')) {
   if (Nav.toggle) {
    btn.classList.add('activeSideNavBtn');
    nav.classList.add('activeSideNav');
    pro.classList.add('activeSideNav');
    loadBtn.classList.add('activeSideNav');
    if (mql.matches) engineCon.classList.add('activeSideNav');
    Nav.toggle = false;
   } else {
    btn.classList.remove('activeSideNavBtn');
    nav.classList.remove('activeSideNav');
    pro.classList.remove('activeSideNav');
    loadBtn.classList.remove('activeSideNav');
    if (mql.matches) engineCon.classList.remove('activeSideNav');
    Nav.toggle = true;
   }
  }
 }

 // fix responsiveness
 static engineMedia() {
  const engineCon = document.getElementById('engineCon');
  const mql = window.matchMedia('(min-width: 768px)');
  const mql2 = window.matchMedia('(max-width: 767px)');

  if (mql.matches) engineCon.classList.remove('activeSideNav');
  else if (mql2.matches && Nav.toggle == false) engineCon.classList.add('activeSideNav');
 }

 // current category
 static currentCategory(e) {
  if (e.target.classList.contains('nb')) {
   //! remove current class 
   const tabs = document.querySelectorAll('.currentTab');
   tabs.forEach(tab => tab.classList.remove('currentTab'));
   const currentTabColor = document.querySelectorAll('.currentTabColor');
   currentTabColor.forEach(tab => tab.classList.remove('currentTabColor'));

   //* add current class
   // if <li> tag clicked trigger click on <a> tag
   if (e.target.nodeName.toLowerCase() === "li") e.target.querySelector('a').click();
   // if <a> tag is clicked add current class
   if (e.target.nodeName.toLowerCase() === "a") {
    e.target.querySelector('span').classList.add('currentTab');
    e.target.classList.add('currentTabColor');
   }
  }
 }

 // fire engine
 static runEngine(e) {
  // select elements
  // pages
  const headerPage = document.querySelector('header');
  const productsPage = document.getElementById('products-wrapper');
  // containers
  const pro = document.getElementById('products');
  const btnCon = document.getElementById('loadBtnContainer');
  const menuBtn = document.querySelector('.menu-btn');
  // select num container
  const sugNum = document.getElementById('suggestionsNum');
  // select results contaier
  const toBeAppendIn = document.getElementById('engineSuggestions');
  // select all product titles 
  const keywords = Pro.container.querySelectorAll('.sec .keywords');

  // !REGEX
  // letters regex
  const checkLetters = (key, letters) => {
   // make pattern of 1st 3 charachters
   let pattern = letters.split('').map(x => `(?=.*${x})`).join('');
   // initiate regex
   let regex = new RegExp(`${pattern}`, "g");
   return key.match(regex);
  };

  // word regex
  const checkWord = (key, wordsArr) => {
   //! no shuffle letters, just the same arrangement
   let pattern = wordsArr.map(x => `(?=.*${x.substring(0, 3)})`).join('');
   // initiate regex
   let regex = new RegExp(`${pattern}`, "g");
   return key.match(regex);
  };

  //* ENGINE
  // get input value
  let val = e.target.value.toLowerCase().replace(/^\s+/gi, '');
  // make array of words
  let words = val.split(' ');
  // remove duplicated words
  let wordsArr = [...new Set(words)];

  //* all words
  let netWordsArr = wordsArr.filter(Boolean); //* all words without white spaces & duplication [array]
  let word_1 = (netWordsArr[0] != undefined) ? String(netWordsArr[0]) : "foo";
  //* 1st word
  let netWord_1 = word_1.substring(0, 3); //* 1st 3 characters of 1st word without white spaces [string]

  // keys arrays
  let keys = [...keywords];

  // !filter products names based on input value
  let filteredArr = keys.filter(key => {
   // make sentence of keywords
   let string = key.value.toLowerCase().trim().split(',').join(' ');
   // 1st word
   if (netWordsArr.length == 1) return string.includes(netWord_1) || checkLetters(string, netWord_1);
   // 2nd word and above
   if (netWordsArr.length > 1) return checkWord(string, netWordsArr);
  });

  //* check suggestions
  if (filteredArr.length) {
   // set max suggestions num to 20
   let max = (filteredArr.length >= 20) ? 20 : filteredArr.length;
   // !add suggestions num
   sugNum.innerText = `About ${max} result`;

   // show suggestions
   for (let i = 0; i < max; i += 1) {
    let cloned = (filteredArr[i].parentElement).cloneNode(true);
    // select title 
    let title = cloned.querySelector('.pro-title');

    // !wipe out lis
    toBeAppendIn.innerHTML = '';
    // create element
    const li = document.createElement('li');
    // add class
    li.className = 'clickSuggest';
    //! add highlighted text
    let regex = new RegExp(`${netWordsArr[0]}`, "gi");
    li.innerHTML = title.textContent.replace(regex, `<mark>${netWordsArr[0]}</mark>`);

    // seperated fn
    setTimeout(() => {
     // *append to suggestions container
     toBeAppendIn.appendChild(li);

     // add current class to 1st suggestion
     document.querySelector('.clickSuggest').classList.add('currentSugg');

     // onclick event
     li.addEventListener('click', (e) => {
      //! wipe out
      pro.innerHTML = "";
      btnCon.innerHTML = "";
      //! hide header wapper
      headerPage.style.display = 'none';
      //* show products warpper
      productsPage.style.display = 'block';
      //* show side nav btn
      menuBtn.style.display = 'block';

      // load product image
      const img = cloned.querySelector('.pro-img img');
      img.src = img.getAttribute('data-src');
      //* append product
      pro.append(cloned);
     });

    }, 0);

   }

  } else sugNum.innerText = `No results`;

 }

 // engine validation
 static validateEngine() {
  const engine = document.getElementById('engine');
  let eventsArr = ['keydown', 'focus', 'keyup', 'input', 'change'];

  eventsArr.forEach(events => {

   engine.addEventListener(events, e => {
    // select main container
    const con = document.getElementById('suggestionsCon');
    // select suggestions container
    const suggestions = document.getElementById('engineSuggestions');

    // get value
    let val = e.target.value.trim();

    // *show suggestions
    if (suggestions.hasChildNodes && val != '') {
     con.style.display = 'block';
    }
    if (val != '') { // show wipe icon 
     document.getElementById('wipeIconCon').style.display = 'block';
    }
    if (val == '') { // if val empty
     //  hide wipe icon
     document.getElementById('wipeIconCon').style.display = 'none';
     // clear suggestions
     document.getElementById('engineSuggestions').innerHTML = '';
     // clear suggestions number
     document.getElementById('suggestionsNum').innerHTML = '';
    }

   });

  });

 }

 // suggest control
 static selectSuggestions(e) {
  const suggest = document.querySelectorAll('.clickSuggest');
  let current = document.querySelector('.currentSugg');
  let max = suggest.length - 1;
  let min = 0;

  if (e.keyCode === 40) { // down arrow  [0,1,2]
   if (Nav.num < max) {
    Nav.num += 1;
   } else {
    Nav.num = 0;
   }
   // !remove current class
   suggest.forEach((el) => el.classList.remove('currentSugg'));
   // *add current class
   suggest[Nav.num].classList.add('currentSugg');
  } else if (e.keyCode === 38) { // up arrow [2,1,0]
   if (Nav.num <= max) {
    Nav.num -= 1;
   }
   if (Nav.num < min) {
    Nav.num = max;
   }
   // !remove current class
   suggest.forEach((el) => el.classList.remove('currentSugg'));
   // *add current class
   suggest[Nav.num].classList.add('currentSugg');
  } else if (e.keyCode === 13) { // enter key
   // run click on selected suggestion
   current.click();
   // blur engine
   Nav.searchInput.blur();
  }

  if (current) { // if class does exist
   // scroll container
   current.scrollIntoView({
    behavior: "smooth",
    block: "center"
   });
  }

 }

}

// init
Nav.global();
Nav.validateEngine();

//! events
// toggle side nav
Nav.menuBtn.addEventListener('click', Nav.fireMenu);
// show current category
Nav.sideNav.addEventListener('click', Nav.currentCategory);
// fix responsiveness of engine
window.addEventListener('resize', Nav.engineMedia);

//* search engine
// run engine
Nav.searchInput.addEventListener('input', e => {
 if (Pro.isFetched) {
  Nav.num = 0;
  Nav.runEngine(e);
 }
});
// blur engine 
Nav.searchInput.addEventListener('blur', () => setTimeout(() => document.getElementById('suggestionsCon').style.display = 'none', 300));
// select suggestions by arrows 
Nav.searchInput.addEventListener('keydown', (e) => Nav.selectSuggestions(e));
// click wipe out icon
Nav.navCon.addEventListener('click', (e) => {
 if (e.target.classList.contains('clickWipe')) {
  // clear input
  document.getElementById('engine').value = '';
  // clear suggestions
  document.getElementById('engineSuggestions').innerHTML = '';
  // clear suggestions number
  document.getElementById('suggestionsNum').innerHTML = '';
  // hide wipe btn
  document.getElementById('wipeIconCon').style.display = 'none';
 }
});