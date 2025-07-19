// Load DOM
document.addEventListener("DOMContentLoaded", (event) =>{

  // // Shrink the left column
  // gsap.to(".section-start-onscreen", {
  //   flexBasis: "66%",
  //   duration: 2,
  //   ease: "power2.out",
  //   scrollTrigger: {
  //     trigger: ".section-start-onscreen",
  //     start: "top 75%", // when the top of .section-start-onscreen hits center of viewport height
  //     toggleActions: "play reverse play reverse",
  //     markers: true
  //   }
  // });

  // // Expand and fade in the right column
  // gsap.to(".section-start-offscreen-right", {
  //   flexBasis: "33%",
  //   opacity: 1,
  //   duration: 2,
  //   ease: "power2.out",
  //   scrollTrigger: {
  //     trigger: ".section-start-onscreen",
  //     start: "top 75%", // when the top of .section-start-onscreen hits center of viewport height
  //     toggleActions: "play reverse play reverse",
  //     markers: true
  //   }
  // });

  // gsap.from(".slide-in", {
  //   x: '100vw',
  //   duration: 2,
  //   ease: "power2.out",
  //   scrollTrigger: {
  //     trigger: ".slide-in",
  //     start: "top 75%", // when the top of .slide-in hits center of viewport height
  //     toggleActions: "play reverse play reverse"
  //     // markers: true
  //   }
  // });

  



ScrollTrigger.matchMedia({

  // DESKTOP ONLY
  "(min-width: 768px)": function () {
    // Shrink the left column
    gsap.to(".section-start-onscreen", {
      flexBasis: "66%",
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".section.intro",
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
        trigger: ".section.intro",
        start: "top 75%",
        toggleActions: "play reverse play reverse",
        // markers: true
      }
    });

    // Slide the image in from the right
    gsap.from(".slide-in", {
      x: '100vw',
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".slide-in",
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
        trigger: ".slide-in",
        start: "-20% 80%",
        end: "50% 80%",
        scrub: true,
        markers: true
      }
    });
  }

});







})