// Load DOM
document.addEventListener("DOMContentLoaded", (event) =>{

// ------------------------------------
// Prevent Scroll Position Restoration on Refresh
// This is a minimal, safe approach that doesn't interfere with normal page loading
// ------------------------------------

// Check if this is a page refresh
const isPageRefresh = window.performance && 
  (window.performance.navigation.type === 1 || // refresh
   window.performance.getEntriesByType('navigation')[0]?.type === 'reload');

if (isPageRefresh) {
  // Simply prevent the browser from restoring scroll position
  // This is much safer than trying to manipulate the DOM
  history.scrollRestoration = 'manual';
  
  // Force scroll to top after a brief delay to ensure it takes effect
  setTimeout(() => {
    window.scrollTo(0, 0);
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
  }, 100);
}

// ------------------------------------
// Lenis Smooth Scroll Setup
// ------------------------------------
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  gestureDirection: 'vertical',
});

// Store lenis globally for scroll reset access
window.lenis = lenis;

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


 
  // Begin Section - Zoom Image | Scrub */

  // Make sure image fills viewport on load and resize
  function sizeImage() {
    const img = document.querySelector(".zoom-image-wrapper img");
    const section = document.querySelector(".zoom-section");

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const sectionRatio = section.offsetWidth / section.offsetHeight;

    if (imgRatio > sectionRatio) {
      // Landscape image — match height
      img.style.height = "100%";
      img.style.width = "auto";
    } else {
      // Portrait image — match width
      img.style.width = "100%";
      img.style.height = "auto";
    }
  }

  window.addEventListener("load", sizeImage);
  window.addEventListener("resize", sizeImage);

  // Zoom + Pan animation
  gsap.fromTo(".zoom-image-wrapper img",
    {
      scale: 3,        // start zoomed in
      xPercent: -80,   // start horizontal position
      yPercent: -110   // start vertical position
    },
    {
      scale: 1,        // end zoomed out
      xPercent: -50,   // end horizontal position
      yPercent: -0,     // end vertical position
      ease: "none",
      scrollTrigger: {
        trigger: ".zoom-section",
        start: "top top",
        end: "+=300%", // controls animation speed while scrubbing
        scrub: true,
        pin: true
      }
    }
  );
  // End Section - Zoom Image | Scrub

  // ---------------------------------------------------------------------------
  // Begin Section - Horizontal RTL | Continuous Scrolling
  // ---------------------------------------------------------------------------
  if (document.querySelector('.horizontal-rtl-section')) {
    const section = document.querySelector('.horizontal-rtl-section');
    const container = section.querySelector('.horizontal-rtl-container');

    function buildHorizontal() {
      // Kill any existing ScrollTriggers on this section
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill(true);
      });

      // Calculate exact distances in pixels
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Total content width (5 items × 100vw = 5 × viewportWidth)
      const totalContentWidth = container.scrollWidth;
      
      // Maximum horizontal distance to translate so the last item fully passes the viewport
      const maxTranslateX = Math.max(0, totalContentWidth - viewportWidth);
      
      // Convert horizontal pixels to equivalent vertical scroll distance
      // We need to add enough vertical scroll height to account for the horizontal movement
      // This ensures the section has enough "height" to complete the horizontal scroll
      const requiredVerticalScroll = maxTranslateX;
      
      // Set the section height to accommodate the required scroll distance
      // The section needs to be taller than 100vh to allow for the horizontal scroll
      const scrollMultiplier = 2; // Helps control scroll rate; higher number equals slower scroll rate
      section.style.height = (viewportHeight + (requiredVerticalScroll * scrollMultiplier)) + 'px';

      const tlH = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          end: '+=' + (requiredVerticalScroll * scrollMultiplier), // Use the same multiplier for consistency
          scrub: true,
          pin: true,
          pinSpacing: false, // Prevent excessive spacing after section
          onUpdate: (self) => {
            // Force height reset as soon as we're very close to completion
            if (self.progress > 0.99) {
              section.style.height = viewportHeight + 'px';
            }
          }
        }
      });

      tlH.fromTo(container, { x: 0 }, { x: -maxTranslateX });
    }

    // Initial build
    buildHorizontal();

    // Rebuild on width/orientation changes
    RebuildRegistry.register(buildHorizontal);
  }
  // End Section - Horizontal RTL | Continuous Scrolling

})