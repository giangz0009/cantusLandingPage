const audio = document.querySelector("audio");
const canvas1 = document.querySelector(".canvas1");
const canvas2 = document.querySelector(".canvas2");

const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
const analyser = context.createAnalyser();
const source = context.createMediaElementSource(audio);

const fbc_array = new Uint8Array(analyser.frequencyBinCount);

window.addEventListener(
  "load",
  () => {
    source.connect(analyser);
    analyser.connect(context.destination);
    loop();
  },
  false
);

function loop() {
  window.requestAnimationFrame(loop);
  analyser.getByteFrequencyData(fbc_array);

  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  ctx1.fillStyle = "#df001f";
  ctx2.fillStyle = "rgba(224, 0, 30, .4)";

  let bar_x;
  let bar_width;
  let bar_height;
  let bars = 100;

  for (let i = 0; i < bars; i++) {
    bar_x = i * 3;
    bar_width = 2;
    bar_height = -fbc_array[i] / 2;
    ctx1.fillRect(bar_x, canvas1.height, bar_width, bar_height);
    ctx2.fillRect(bar_x, 0, bar_width, -bar_height);
  }
}

audio.onplay = () => {
  context.resume();
};

// Add event for Header menu bar
const menuBar = document.querySelector("#header .header-menu-bar");
const menuBarModal = menuBar.querySelector(".header-menu-bar__modal");
const menuBarList = menuBarModal.querySelector(
  ".header-menu-bar__wrap > .header-menu-bar__list"
);
const menuBarMultiLevels = menuBarList.querySelectorAll(
  ".header-menu-bar__item--multi-level-menu"
);

const menuCloseBtn = menuBarModal.querySelector(
  ".header-menu-bar__wrap > .header-menu-bar__close-btn"
);
const menuBarOpenBtn = menuBar.querySelector(".header-menu-bar__icon");
const menuBarMask = menuBarModal.querySelector(".header-menu-bar-mask");

menuCloseBtn.addEventListener("touchend", function () {
  menuBarModal.classList.toggle("header-menu-bar__modal--close");
});

menuBarOpenBtn.addEventListener("touchend", function () {
  menuBarModal.classList.toggle("header-menu-bar__modal--close");
});

menuBarMask.addEventListener("touchstart", function () {
  this.ontouchmove = () => {
    this.ontouchend = () => {
      // Not thing when scroll on Menu Bar
    };
  };
});

menuBarMask.addEventListener("touchstart", function () {
  this.ontouchend = () => {
    menuBarModal.classList.toggle("header-menu-bar__modal--close");
  };
});

Array.from(menuBarMultiLevels).forEach(function (menuBarMultiLevel) {
  menuBarMultiLevel.ontouchend = function () {
    this.classList.toggle("header-menu-bar__item--down");
  };
});

const headerSearch = document.querySelector(".header-search");
const headerSearchToggleBtn = headerSearch.querySelector(".header-search__btn");
const headerSearchInputWrap = headerSearch.querySelector(
  ".header-search__input-wrap"
);

const headerSearchStartBtn = headerSearchInputWrap.querySelector(
  ".header-search__input-search-icon"
);
let searchBoxIsOpen = false;

headerSearchToggleBtn.ontouchend = toggleClassToSearchInput;

headerSearchStartBtn.ontouchend = () => {
  // Search Script
  toggleClassToSearchInput();
};

function toggleClassToSearchInput() {
  searchBoxIsOpen = !searchBoxIsOpen;
  headerSearchInputWrap.classList.toggle(
    "header-search__input-wrap--open",
    searchBoxIsOpen
  );
}

document.ontouchend = (e) => {
  if (
    searchBoxIsOpen &&
    e.target !== headerSearchToggleBtn &&
    e.target !== headerSearchToggleBtn.firstElementChild
  ) {
    let headerSearchInputWrapOpened = headerSearch.querySelector(
      ".header-search__input-wrap.header-search__input-wrap--open"
    );

    if (!e.path.includes(headerSearchInputWrapOpened)) {
      toggleClassToSearchInput();
    }
  }
};

// Show more for Trending
const width = window.innerWidth > 0 ? window.innerWidth : screen.width;

const trendingList = document.querySelector(".trending__list");
const trendingItems = trendingList.querySelectorAll(".trending__item");
const trendingShowMore = trendingList.querySelector(".trending__show-more-btn");
const trendingShowLess = trendingList.querySelector(".trending__show-less-btn");

const trendingItemsLength = Array.from(trendingItems).length;
let qualityToShow = 4;

if (width >= 575) qualityToShow = 6;
if (width >= 768) qualityToShow = 8;

if (trendingItemsLength > qualityToShow) {
  trendingList.classList.add("trending__list--show-more");
}

Array.from(trendingItems).forEach(function (trendingItem, i) {
  // Hide Elements > quality to Show
  if (i >= qualityToShow) {
    trendingItem.classList.add("d-n");
  }
});

trendingShowMore.ontouchend = () => {
  let trendingItemsHides = document.querySelectorAll(
    "#trending .trending__item.d-n"
  );

  Array.from(trendingItemsHides).forEach(function (
    trendingItemsHide,
    i,
    thisArray
  ) {
    const thisLength = thisArray.length;
    const qualityToShowMore = 8;
    if (i < qualityToShowMore) {
      trendingItemsHide.classList.remove("d-n");
    }

    if (thisLength <= qualityToShow) {
      trendingList.classList.add("trending__list--show-less");
      trendingList.classList.remove("trending__list--show-more");
    }
  });
};

trendingShowLess.ontouchend = () => {
  Array.from(trendingItems).forEach(function (trendingItem, i) {
    // Hide Elements > quality to Show
    if (i >= qualityToShow) {
      trendingItem.classList.add("d-n");
    }
  });

  trendingList.classList.remove("trending__list--show-less");
  trendingList.classList.add("trending__list--show-more");
};
