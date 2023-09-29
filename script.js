'use strict';

const mobileNav = document.querySelector('nav');

document.querySelector('.icon-mobile-nav[name = "menu-outline"]').addEventListener('click', ()=>{
  mobileNav.classList.add("nav-open");
})
document.querySelector('.icon-mobile-nav[name = "close-outline"]').addEventListener('click', ()=>{
  mobileNav.classList.remove("nav-open");
});

//sm9oth scrolling animation
const allLinks = document.querySelectorAll('a:link');
allLinks.forEach((link)=>{
  link.addEventListener('click', function(e){
    e.preventDefault();
    const href = link.getAttribute("href");
    //
    if(href.startsWith('#')){
      mobileNav.classList.remove("nav-open");
    }
    if(href === "#"){
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
    if(href !== "#" && href.startsWith('#')){
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({behavior: "smooth"});
    }
  })
})

// Sticky nav
const sectionHeroEl = document.querySelector(".hero");
const obs = new IntersectionObserver(function(entries){
  const ent = entries[0];
  if(!ent.isIntersecting){
    document.body.classList.add('sticky');
  }
  if(ent.isIntersecting){
    document.body.classList.remove('sticky');
  }
}, 
{
  root: null,
  threshold: 0,
  rootMargin: "-80px",
})
obs.observe(sectionHeroEl);