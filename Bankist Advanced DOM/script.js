"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const navLinks = document.querySelector(".nav__links");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// SMOOTH SCROLLING
btnScrollTo.addEventListener("click", function (e) {
  document.querySelector("#section--1").scrollIntoView({
    behavior: "smooth",
  });
});
// SMOOTH SCROLLING FOR NAV ITEMS --> USING EVENT DELEGATION
navLinks.addEventListener("click", function (e) {
  if (e.target.classList.contains("nav__link")) {
    e.preventDefault(); // necessary for preventing from scrolling immediately based on what we have written in html
    const sectionID = e.target.getAttribute("href"); // #section--1, #section--2, #section--3, #section--4
    document.querySelector(sectionID).scrollIntoView({
      behavior: "smooth",
    });
  }
});

// TABBED COMPONENT
const tabContainer = document.querySelector(".operations__tab-container"); // tab buttons container
const tabs = document.querySelectorAll(".operations__tab"); // tab buttons
const tabContents = document.querySelectorAll(".operations__content");

tabContainer.addEventListener("click", function (e) {
  // if we are clicking of the button only then we need to perform the task
  // using closest will allow us to select only button whether we are clicking on button or span tag within the button.
  const clicked = e.target.closest(".operations__tab");

  // if we click anywhere but the button then we need to return back immediately
  if (!clicked) return;

  // remove the operations__tab--active from all the tabs and add to only the class which we clicked on
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));

  // add the operations__tab--active to clicked button
  clicked.classList.add("operations__tab--active");

  // remove the operations__content--active from all the contents and add to only the class which we clicked on
  tabContents.forEach((content) =>
    content.classList.remove("operations__content--active")
  );

  // display the corresponding content to the button, by using dataset to identify it
  const content = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  content.classList.add("operations__content--active");
  console.log(content);
});

// NAV MENU FADE ANIMATION

// even handler will usually takes only one argument
const handlerHover = function (e) {
  // console.log(this); // this --> pointing to either 0.5 or 1
  const link = e.target;
  const siblings = link.closest(".nav").querySelectorAll(".nav__link");
  const logo = document.querySelector("#logo");
  siblings.forEach((el) => {
    if (el !== link) el.style.opacity = this;
  });
  logo.style.opacity = this;
};
// WAY ONE
// nav.addEventListener("mouseover", function (e) {
//   handlerHover(e, 0.5);
// });
// nav.addEventListener("mouseout", function (e) {
//   handlerHover(e, 1);
// });

// WAY TWO - usig bind
nav.addEventListener("mouseover", handlerHover.bind(0.5));
nav.addEventListener("mouseout", handlerHover.bind(1));

// STICKY NAV BAR
// we need to make the navbar sticky when scroll and reach section--1, and increase the opacity to 1
// // OLD WAY
// window.addEventListener("scroll", function (e) {
//   const navHeight = nav.getBoundingClientRect().height; // gives height width, t b l r
//   const headerHeight = document
//     .querySelector(".header")
//     .getBoundingClientRect().height;

//   if (window.scrollY >= headerHeight - navHeight) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

// MODERN WAY : USING INTERSECTION OBSERVER API

const stickyNav = function (entries, observer) {
  // entries --> array
  entries.forEach((entry) => {
    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
  });
};
// the intersection will happen only if 10% --> 0.1 threshold of the element is visible on the viewport,
const options = {
  root: null, // because we are dealing with root element
  threshold: 0, // if 0% of the header is visible only then we need to stick nav bar
  rootMargin: `-${nav.getBoundingClientRect().height}px`, // margin from root, negative to give from bottom
  // before the section1 starts itself we need to stick the nav bar, so that it wont cover the section1
};

const headerObserver = new IntersectionObserver(stickyNav, options);
headerObserver.observe(header); // to observe the movements of the header section

//REVEALING SECTIONS AS WE SCROLL DOWN
// in order to reveal so we need to hide it
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return; // if not intersecting return
    // remove class section--hidden
    entry.target.classList.remove("section--hidden");
    // once the observing is done we can unobserve them
    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, // intersection will happen when 15% of the section is visible
});
allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden"); // to hide all sections so that we can reveal them later on
});

// LAZY LOADING OF THE IMAGES
// here the images will be in low resolution once the images enter the viewport we need to replace the low resolution images with high resolution image and display it only when it is completely loaded. by default the images will be blurred

const AllLazyImages = document.querySelectorAll("img[data-src]");

const lazyImgLoading = function (entries, observer) {
  // entries is based of number of thresholds
  const [entry] = entries; // only one threshold

  if (!entry.isIntersecting) return; // if isIntersecting === false

  entry.target.src = entry.target.dataset.src; // setting the high resolution image
  // we need to load the image completely on then we need to display
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img"); // we need to remove the blur effect only when the image loading is done
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(lazyImgLoading, {
  root: null,
  threshold: 0, // it will intersect if more than 0% of the image in the viewport
});
AllLazyImages.forEach((lzy) => {
  imgObserver.observe(lzy);
});

// // IMAGE SLIDER
const testimonalSlider = function () {
  const slides = document.querySelectorAll(".slide ");
  const slider = document.querySelector(".slider");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");

  //// slider.style.transform = "scale(0.3) translateX(-800px)";
  //// slider.style.overflow = "visible";

  let currSlide = 0;

  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * i}%)`;
    //arranging images -->img1 -> 0%,img2 -> 100%,img3 -> 200%,img4 -> 300%
  });

  // functions

  const gotoSlide = function (curr) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - curr)}%)`;
    });
  };

  const previousSlide = function (e) {
    if (currSlide === 0) currSlide = slides.length - 1;
    else currSlide--;
    gotoSlide(currSlide);
    activateDot(currSlide);

    //curr slide : 1-->img1 -> 0%,img2 -> 100%,img3 -> 200%,img4 -> 300%
    //curr slide : 2-->img1 -> -100%,img2 -> 0%,img3 -> 100%,img4 -> 200%
    //curr slide : 3-->img1 -> -200%,img2 -> -100%,img3 -> 0%,img4 -> 100%
    //curr slide : 0--> curr = 4-1 = 3 --> img1 -> -300%,img2 -> -200%,img3 -> 100%,img4 -> 0%
  };
  const nextSlide = function (e) {
    if (currSlide >= slides.length - 1) currSlide = 0;
    else currSlide++;
    gotoSlide(currSlide);
    activateDot(currSlide);

    //curr slide : 0-->img1 -> 0%,img2 -> 100%,img3 -> 200%,img4 -> 300%
    //curr slide : 1-->img1 -> -100%,img2 -> 0%,img3 -> 100%,img4 -> 200%
    //curr slide : 2 -->img1 -> -200%,img2 -> -100%,img3 -> 0%,img4 -> 100%
    //curr slide : 3 -->img1 -> -300%,img2 -> -200%,img3 -> -100%,img4 -> 0%
  };

  btnRight.addEventListener("click", nextSlide);

  btnLeft.addEventListener("click", previousSlide);

  // we want the image sliding to work even if we press the left and right arrow key
  document.addEventListener("keydown", function (e) {
    const key = e.key;
    key === "ArrowRight"
      ? nextSlide()
      : key === "ArrowLeft"
      ? previousSlide()
      : null;
  });

  // ADDING DOTS TO THE IMAGE SLIDER
  const dotContainer = document.querySelector(".dots");
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();
  console.log(dotContainer);

  const btnDots = document.querySelectorAll(".dots__dot");
  console.log(btnDots);
  const activateDot = function (curr) {
    btnDots.forEach((dot) => {
      dot.classList.remove("dots__dot--active");
      console.log(dot);
    });
    document
      .querySelector(`button[data-slide = '${curr}']`)
      .classList.add("dots__dot--active");
  };

  activateDot(currSlide);

  // btnDots.forEach((dot) => {
  //   dot.addEventListener("click", function (e) {
  //     // const slide = e.target.dataset.slide;
  //     const { slide } = e.target.dataset; // dataset is an object
  //     gotoSlide(slide);
  //   });
  // });

  // or using delegation

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      // const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset; // dataset is an object
      gotoSlide(slide);
      activateDot(slide);
      console.log(slide);
    }
  });
};
testimonalSlider();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // //  creating , inserting and deleting element
// const header = document.querySelector(".header");

// const message = document.createElement("div"); // creates div element
// message.classList.add("cookie-message"); // adding a class
// message.innerHTML = `we are adding cookie message . <button class="btn btn--close-cookie">click here</button>`;

// // console.log(message);

// // // append
// header.append(message); // appends after all the contents of header, after athe last child node

// // prepend
// // header.prepend(message.cloneNode(true)); // before the first child node

// // appends before all the contents of header. cannot add the same element twice, so we create a clone of it along with its descendents.

// // after
// header.after(message); // after the node
// // before
// header.before(message.cloneNode(true)); // before the node

// message.append();

// // deleting the ,message node
// document
//   .querySelector(".btn--close-cookie")
//   .addEventListener("click", function (e) {
//     message.remove();
//   });

// // getting css values
// message.style.backgroundColor = "#3456df";
// message.style.width = "800px";
// // we can only get the values of the css properties for which we have set the values in javascript.
// console.log(message.style.backgroundColor);
// console.log(message.style.width);
// console.log(message.style.height); // we have not set the value of height property in js , so we wont get any result.

// // to get the values of of the css properties, mentioned in the css values.
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// message.style.height =
//   parseFloat(getComputedStyle(message).height, 10) + 50 + "px"; // 47.5 + 50 + 'px' --> '97.5px'
// console.log(message.style.height);

// // pointing to :root property in css
// // pointing to css varaible
// document.documentElement.style.setProperty("--color-primary", "crimson"); // where and all '--color-primary' is used the value of it will be changed.

// // getting standard attributes of a html element
// const logo = document.querySelector(".nav__logo");
// console.log(logo.alt); // returns the alternate text of the image --> Bankist logo
// console.log(logo.src); // retuns the absolute path of the image
// console.log(logo.className); // retuns the name of the class attribute, prefer classList over className

// // setting the value of a standard property
// logo.alt = "new Bankist logo";
// console.log(logo.alt); //--> new Bankist logo

// // accessing user defined attributes from the html element
// // user defined attributes cannot be accessed normaly
// console.log(logo.designer); // cannot access --> undefined

// // to access the userdefined attributes we use getAttribute()
// console.log(logo.getAttribute("designer")); //akhila
// console.log(logo.getAttribute("company")); //chiku

// // to get the relative path of the source
// console.log(logo.getAttribute("src"));

// // setting the value of userdefined attributes
// logo.setAttribute("designer", "chintu"); // chintu
// console.log(logo.getAttribute("designer"));

// // data attributes --> these are used to store data in the html/UI
// // these attributes will start with data-attributename = value
// console.log(logo.dataset.versionNumber); // 3.0 --> name of the attribute should be writtem in camel case

// // SMOOTH SCROLLING
// const btnScrollTo = document.querySelector(".btn--scroll-to");
// const section1 = document.querySelector("#section--1");

// // when we click on we need to scroll to section1
// btnScrollTo.addEventListener("click", function (e) {
//   // // OLD WAY
//   // const s1coords = section1.getBoundingClientRect(); // this will how much height, width,top, left, right, bottom, x-axis and y-axis the element occupying
//   //   console.log(s1coords);
//   //   console.log(
//   //     "current scroll offset (X) : ",
//   //     window.pageXOffset,
//   //     window.scrollX
//   //   ); // both gives the same value
//   //   console.log(
//   //     "current scroll offset (Y) : ",
//   //     window.pageYOffset,
//   //     window.scrollY
//   //   ); // both gives the same value

//   //   // viewport height and width
//   //   console.log(document.documentElement.clientHeight); // 791
//   //   console.log(document.documentElement.clientWidth); // 1605

//   //   window.scrollTo(
//   //     s1coords.left + window.scrollX, //no. of px from left to right of the section + horizontal scorll --> left = 0, scrollX = 0
//   //     s1coords.top + window.scrollY // no. of px from top to bottom of the section + vertical scroll --> top = 300px scrollY = 246px --> so we need to scroll from top is 546px;
//   //   );

//   //   // or
//   //   window.scrollTo({
//   //     left: s1coords.left + window.scrollX,
//   //     top: s1coords.top + window.scrollY,
//   //     behavior: "smooth", // smooth scrolling
//   //   });

//   // MODERN WAY OF SMOOTH SCROLLING
//   // this is the modern way of smooth scrolling, we will just specify that we need section to be in view
//   section1.scrollIntoView({
//     behavior: "smooth",
//   });
// });

// // TYPES OF EVENTS
// const h1 = document.querySelector("h1");
// const eventH1 = function (e) {
//   alert("hey we are entering the h1 zone!! ");
//   // to stop the event listener
//   // after performing the event for once we need to stop it

//   // h1.removeEventListener("mouseenter", eventH1); // this removes the event
// };
// h1.addEventListener("mouseenter", eventH1);

// // after 10 secs the mouseEnter event from the h1 applied by eventH1 function will be removed.
// setTimeout(() => h1.removeEventListener("mouseenter", eventH1), 10 * 1000);

// // or --> older way no much used
// // h1.onmouseleave = function (e) {
// //   alert("ohhh no we are leaving the h1 zone :(");
// // };

// // EVENT CAPTURING AND EVENT BUBBLING
// // EVENT CAPTURING : all the event will be created at the top of the DOM, and the created event must capture the target element so it traverse down the DOM to tree to capture the target element, this phase is called as CAPTURING

// // EVENT BUBBLING : once the target element is captured, then after executing the event , the control will be sent back to the DOM, this phase is where the control is bubbling the DOM tree, from target element to its parent, and grand parent and so on until it reaches the top of the DOM Tree. during the bubbling we will also execute the events of the parent elements as well. this phase is called as EVENT BUBBLING.

// // BUBBLING
// // random color generator
// const colorGenerator = function () {
//   return `rgb(${Math.trunc(Math.random() * 256)},${Math.trunc(
//     Math.random() * 256
//   )},${Math.trunc(Math.random() * 256)})`; // RGB(red,green,blue)
// };

// // when we click on the child element the event of the child and all the other events of the parent will also be triggred, this is called as event bubbling.

// // on the 1st anchor link
// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   this.style.backgroundColor = colorGenerator(); // this keyword points to the current target element
//   console.log(`LINK`, e.target); // this shows which element triggered the event calling. --> link
//   console.log("LINK", e.currentTarget); // this will show the element to the the event has attached to --> nav__link

//   // to stop the event bubbling from happening
//   e.stopPropagation();
// });

// //  on the ul -> parent of anchor tag
// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   this.style.backgroundColor = colorGenerator(); // this keyword points to the current target element
//   console.log(`UL`, e.target); // this shows which element triggered the event calling. --> link
//   console.log("UL", e.currentTarget); // this will show the element to the the event has attached to --> nav__links
// });

// //  on the Nav -> parent of ul and anchor tag
// document.querySelector(".nav").addEventListener("click", function (e) {
//   this.style.backgroundColor = colorGenerator(); // this keyword points to the current target element
//   console.log(`NAV`, e.target); // this shows which element triggered the event calling. --> link
//   console.log("NAV", e.currentTarget); // this will show the element to the the event has attached to --> nav
// });

// // TRAVERSING THROUGH DOM
// // CHILD ELEMENTS --> traversing downwards
// const h1 = document.querySelector("h1");
// console.log(h1.childNodes); // includes comments , text nodes, line spaces every thing // not recommended
// console.log(h1.children); // returns HTMLCollection , gives only the html elements, includes break if any,
// console.log(h1.firstElementChild); // returns the first child
// console.log(h1.lastElementChild); // returns the last child

// // PARENT ELEMENTS --> traversing upwards
// console.log(h1.parentElement); // returns the parent element
// console.log(h1.parentNode.parentNode); // returns the parent element // both are same
// console.log(h1.closest(".header")); // traversing upwards , similar to quertselector, just returns the nearest parent element matching the criteria

// h1.closest(".header").style.background = "var(--gradient-primary)"; // using css variable to change the background color

// // SIBLINGS --> traversing sideways
// console.log(h1.previousSibling); // includes text nodes
// console.log(h1.previousElementSibling); // returns if any previous node if not null
// console.log(h1.nextElementSibling); // returns if any previous node if not null

// NAVBAR Fade

// // nav.addEventListener("mouseover", function (e) {
//   const link = e.target;
//   const siblings = link.closest(".nav").querySelectorAll(".nav__link");
//   const logo = document.querySelector("#logo");
//   siblings.forEach((el) => {
//     if (el !== link) el.style.opacity = 0.6;
//   });
//   logo.style.opacity = 0.6;
// });
// nav.addEventListener("mouseout", function (e) {
//   const link = e.target;
//   const siblings = link.closest(".nav").querySelectorAll(".nav__link");
//   const logo = document.querySelector("#logo");
//   siblings.forEach((el) => {
//     if (el !== link) el.style.opacity = 1;
//   });
//   logo.style.opacity = 1;
// });
