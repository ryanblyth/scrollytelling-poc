// Load DOM
document.addEventListener("DOMContentLoaded", (event) =>{









// ------------------------------------
// Lenis Smooth Scroll Setup
// ------------------------------------
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  gestureDirection: 'vertical',
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register ScrollTrigger and sync with Lenis
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
  },
  scrollLeft(value) {
    return arguments.length ? lenis.scrollTo(value, { immediate: true, axis: 'x' }) : (lenis.scrollX || 0);
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
  pinType: document.body.style.transform ? "transform" : "fixed"
});

// Tell ScrollTrigger to update when Lenis scrolls
lenis.on("scroll", ScrollTrigger.update);















  // Prevent ScrollTrigger from refreshing on mobile address bar show/hide which causes bounce glitches
  ScrollTrigger.config({ ignoreMobileResize: true });

  // ---------------------------------------------------------------------------
  // Global RebuildRegistry: one debounced width-based resize/orientation handler
  // Any section that needs to rebuild itself should call RebuildRegistry.register(fn)
  // ---------------------------------------------------------------------------
  const RebuildRegistry = (() => {
    const rebuildFns = new Set();
    let lastW = window.innerWidth;
    let tId;

    function runAll() {
      rebuildFns.forEach(fn => fn());
      ScrollTrigger.refresh();
    }

    function handleResize() {
      clearTimeout(tId);
      tId = setTimeout(() => {
        const w = window.innerWidth;
        if (Math.abs(w - lastW) > 10) { // Ignore height-only changes
          lastW = w;
          runAll();
        }
      }, 150);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      lastW = window.innerWidth;
      runAll();
    });

    return {
      register: fn => rebuildFns.add(fn),
      unregister: fn => rebuildFns.delete(fn)
    };
  })();

  // ---------------------------------------------------------------------------
  // Section - Image | Slide | From Right | Duration
  // ---------------------------------------------------------------------------
  /* Begin Section - Image | Slide | From Right | Duration */
  ScrollTrigger.matchMedia({

    // DESKTOP ONLY
    "(min-width: 768px)": function () {
      // Shrink the left column
      gsap.to(".section-slide-from-right-duration-start-onscreen", {
        flexBasis: "66%",
        duration: 2,
        ease: "power2.out",
        onComplete: () => ScrollTrigger.refresh(),
        scrollTrigger: {
          trigger: ".section-slide-from-right-duration",
          start: "top 75%",
          toggleActions: "play reverse play reverse",
          // markers: true
        }
      });

      // Expand and fade in the right column
      gsap.to(".section-slide-from-right-duration-start-offscreen-right", {
        flexBasis: "33%",
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".section-slide-from-right-duration",
          start: "top 75%",
          toggleActions: "play reverse play reverse",
          // markers: true
        }
      });

      // Slide the image in from the right
      gsap.from(".animate-slide-from-right-duration", {
        x: '100vw',
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".animate-slide-from-right-duration",
          start: "top 75%",
          toggleActions: "play reverse play reverse",
          // markers: true
        }
      });
    },

    // MOBILE ONLY
    "(max-width: 767px)": function () {
      // Initially hide the image container on mobile
      gsap.set(".section-slide-from-right-duration-start-offscreen-right", {
        height: 0
      });

      // Slide the image down from above when triggered
      gsap.to(".section-slide-from-right-duration-start-offscreen-right", {
        height: "auto",
        ease: "none",
        onComplete: () => ScrollTrigger.refresh(),
        scrollTrigger: {
          trigger: ".animate-slide-from-right-duration",
          start: "top 65%",
          duration: 2,
          // markers: true
        }
      });
    }
  });
  /* End Section - Image | Slide | From Right | Duration */



  
  /* Begin Section - Text Over Image | Slide | From Bottom | Scrub */
  gsap.fromTo(
    ".scroll-overlay",
    { y: "150vh" },             // from
    {
      y: "33vh",                // to
      scrollTrigger: {
        trigger: ".image-pin-section",
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
        // markers: true
      }
    }
  );
  /* End Section - Text Over Image | Slide | From Bottom | Scrub */




  /* Begin Section - Pinned Text Scroll | Image Transitions */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section-pinned-text-scroll-text",
      start: "top 80%", // use these settings in conjunction based on text content length
      end: "60% 20%", // use these settings in conjunction based on text content length  
      scrub: true
      // markers: true
    }
  });

  // Show first image initially
  gsap.set(".transition-image.image-1", { opacity: 1 });

  // Transition to second image at 33%
  tl.to(".transition-image.image-1", { opacity: 0, duration: 0.1, }, 0.25) // use these settings in conjunction based on text content length
    .to(".transition-image.image-2", { opacity: 1, duration: 0.1 }, 0.25);

  // Transition to third image at 66%
  tl.to(".transition-image.image-2", { opacity: 0, duration: 0.1 }, 0.50) // use these settings in conjunction based on text content length
    .to(".transition-image.image-3", { opacity: 1, duration: 0.1 }, 0.50);
  /* End Section - Pinned Text Scroll | Image Transitions */



  
  /* Begin Section - Three Text Blocks | Image Transitions */
  if (document.querySelector('.section-three-text-blocks')) {
    const sectionTT = document.querySelector('.section-three-text-blocks');
    const textBlocksTT = sectionTT.querySelectorAll('.scroll-overlay-three');
    const imagesTT = sectionTT.querySelectorAll('.pinned-image-three');

    // Pin the section and animate text blocks scrolling up
    // Create a function to (re)build the scrolling timeline based on actual text height
    let tlTT;
    function buildTimeline() {
      // If a previous timeline exists, completely kill its ScrollTrigger and unwrap pin-spacers
      if (tlTT) {
        if (tlTT.scrollTrigger) tlTT.scrollTrigger.kill(true);
        tlTT.kill();

        // Unwrap any leftover pin-spacer wrappers around the section
        while (sectionTT.parentNode && sectionTT.parentNode.classList && sectionTT.parentNode.classList.contains('pin-spacer')) {
          const spacer = sectionTT.parentNode;
          const grand = spacer.parentNode;
          if (grand) grand.insertBefore(sectionTT, spacer);
          spacer.remove();
        }
      }

      // Total height of all text blocks combined
      const blocksArray = Array.from(textBlocksTT);
      const totalTextHeight = blocksArray.reduce((sum, el) => sum + el.offsetHeight + parseFloat(getComputedStyle(el).marginBottom), 0);

      // Extra viewport space so the last block fully clears and section can unpin
      const extraSpace = window.innerHeight;
      const scrollDistance = totalTextHeight + extraSpace;

      tlTT = gsap.timeline({
        scrollTrigger: {
          trigger: sectionTT,
          start: 'top top',
          end: '+=' + scrollDistance,
          scrub: true,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true
        }
      });

      // Start each block just below the viewport and move everything up through full text height
      tlTT.fromTo(
        textBlocksTT,
        { y: window.innerHeight },
        { y: -scrollDistance + window.innerHeight, ease: 'none' }
      );
    }

    // Initial build
    buildTimeline();
    // Register with global registry so it rebuilds on width/orientation changes
    RebuildRegistry.register(buildTimeline);

    // Ensure starting state for images
    gsap.set(imagesTT, { opacity: 0 });
    if (imagesTT[0]) gsap.set(imagesTT[0], { opacity: 1 });

    let currentImageTT = 1;
    let tweeningTT = false;

    function fadeToTT(index) {
      if (tweeningTT || currentImageTT === index) return;
      tweeningTT = true;
      gsap.to(imagesTT[currentImageTT - 1], { opacity: 0, duration: 0.35 });
      gsap.to(imagesTT[index - 1], {
        opacity: 1,
        duration: 0.35,
        onComplete: () => (tweeningTT = false)
      });
      currentImageTT = index;
    }

    ScrollTrigger.create({
      trigger: sectionTT,
      start: 'top top',
      end: '+=500%',
      scrub: true,
      onUpdate: () => {
        const block1Bottom = textBlocksTT[0].getBoundingClientRect().bottom;
        const block2Bottom = textBlocksTT[1].getBoundingClientRect().bottom;

        // Transition when 150px remains in text-block-1
        if (block1Bottom <= 150 && currentImageTT === 1) fadeToTT(2);
        else if (block1Bottom > 150 && currentImageTT === 2) fadeToTT(1);

        // Transition when 150px remains in text-block-2
        if (block2Bottom <= 150 && currentImageTT === 2) fadeToTT(3);
        else if (block2Bottom > 150 && currentImageTT === 3) fadeToTT(2);
      }
    });
  }
  // End Section - Three Text Blocks | Image Transitions | Precise 150px Triggers

})