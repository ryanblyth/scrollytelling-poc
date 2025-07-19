// Load DOM
document.addEventListener("DOMContentLoaded", (event) =>{

  /* Begin Section - Image | Slide | From Right | Duration */
  ScrollTrigger.matchMedia({

    // DESKTOP ONLY
    "(min-width: 768px)": function () {
      // Shrink the left column
      gsap.to(".section-start-onscreen", {
        flexBasis: "66%",
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".section.section-slide-from-right-duration",
          start: "top 75%",
          toggleActions: "play reverse play reverse",
          // markers: true
        }
      });

      // Expand and fade in the right column
      gsap.to(".section-start-offscreen-right", {
        flexBasis: "33%",
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".section.section-slide-from-right-duration",
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
      gsap.set(".section-start-offscreen-right", {
        height: 0,
        // y: -100
      });

      // Slide the image down from above when triggered
      gsap.to(".section-start-offscreen-right", {
        height: "auto",
        // y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".animate-slide-from-right-duration",
          start: "top 65%",
          // end: "150% 100%",
          // scrub: true,
          duration: 2,
          markers: true
        }
      });
    }
  });
  /* End Section - Image | Slide | From Right | Duration */

})