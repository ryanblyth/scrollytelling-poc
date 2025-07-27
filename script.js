// Load DOM
document.addEventListener("DOMContentLoaded", (event) =>{

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
        fastScrollEnd: true,
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
  // Pin the section and animate text blocks scrolling up
  // gsap.fromTo(
  //   ".scroll-overlay-three",
  //   { y: "150vh" },
  //   {
  //     y: "-200vh",
  //     scrollTrigger: {
  //       trigger: ".section-three-text-blocks",
  //       start: "top top",
  //       end: "+=500%",
  //       scrub: true,
  //       pin: true,
  //       pinSpacing: true,
  //       fastScrollEnd: true,
  //       invalidateOnRefresh: true,
  //       markers: true
  //     }
  //   }
  // );

  // // Image transitions using separate ScrollTriggers
  // ScrollTrigger.create({
  //   trigger: ".section-three-text-blocks",
  //   start: "top top",
  //   end: "+=500%",
  //   scrub: true,
  //   onUpdate: (self) => {
  //     const progress = self.progress;
      
  //     // Transition 1: At 25% progress
  //     if (progress >= 0.25) {
  //       gsap.set(".pinned-image-three.image-three-1", { opacity: 0 });
  //       gsap.set(".pinned-image-three.image-three-2", { opacity: 1 });
  //     } else {
  //       gsap.set(".pinned-image-three.image-three-1", { opacity: 1 });
  //       gsap.set(".pinned-image-three.image-three-2", { opacity: 0 });
  //     }
      
  //     // Transition 2: At 60% progress
  //     if (progress >= 0.60) {
  //       gsap.set(".pinned-image-three.image-three-2", { opacity: 0 });
  //       gsap.set(".pinned-image-three.image-three-3", { opacity: 1 });
  //     } else if (progress >= 0.25) {
  //       gsap.set(".pinned-image-three.image-three-2", { opacity: 1 });
  //       gsap.set(".pinned-image-three.image-three-3", { opacity: 0 });
  //     }
  //   }
  // });
  /* End Section - Three Text Blocks | Image Transitions */

})