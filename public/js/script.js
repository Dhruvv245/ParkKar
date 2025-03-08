import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';
import AOS from 'aos';

export const locoScroll = () => {
  const mainElement = document.getElementById('main');
  if(!mainElement) return;
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true,
  });
  locoScroll.on('scroll', ScrollTrigger.update);

  AOS.init();

  ScrollTrigger.scrollerProxy('#main', {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector('#main').style.transform
      ? 'transform'
      : 'fixed',
  });
  ScrollTrigger.addEventListener('refresh', () => locoScroll.update());

  ScrollTrigger.refresh();
};

export const cursorEffect = () => {
  var page1Content = document.querySelector('#page1-content');
  var cursor = document.querySelector('#cursor');
  if(!page1Content || !cursor) return;

  page1Content.addEventListener('mousemove', function (dets) {
    gsap.to(cursor, {
      x: dets.x,
      y: dets.y,
    });
  });

  page1Content.addEventListener('mouseenter', function () {
    gsap.to(cursor, {
      scale: 1,
      opacity: 1,
    });
  });
  page1Content.addEventListener('mouseleave', function () {
    gsap.to(cursor, {
      scale: 0,
      opacity: 0,
    });
  });
};


export const sliderAnimaton = () => {
  var swiper = new Swiper('.mySwiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    effect: 'slide',
    speed: 1000,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
    },
  });
};

export const loader = () => {
  var tl = gsap.timeline();
  tl.from('#loader h3', {
    x: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
  });
  tl.to('#loader h3', {
    opacity: 0,
    x: -40,
    stagger: 0.1,
    duration: 1,
  });
  tl.to('#loader', {
    opacity: 0,
  });
  tl.from('#page1-content h1 span', {
    y: 100,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    delay: 0.5,
  });
  tl.to('#loader', {
    display: 'none',
  });
};
