// Load DOM
document.addEventListener("DOMContentLoaded", (event) =>{

  // Shrink the left column
  gsap.to(".section-start-onscreen", {
    flexBasis: "66%",
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".section-start-onscreen",
      start: "top center", // when the top of .section-start-onscreen hits center of viewport height
      toggleActions: "play reverse play reverse",
      markers: true
    }
  });

  // Expand and fade in the right column
  gsap.to(".section-start-offscreen-right", {
    flexBasis: "33%",
    opacity: 1,
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".section-start-onscreen",
      start: "top center", // when the top of .section-start-onscreen hits center of viewport height
      toggleActions: "play reverse play reverse",
      markers: true
    }
  });

  gsap.from(".slide-in", {
    x: '100vw',
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".slide-in",
      start: "top center", // when the top of .slide-in hits center of viewport height
      toggleActions: "play reverse play reverse"
      // markers: true
    }
  });


})