// Easy-to-modify slide data
// Simply change the URLs, links, and descriptions here

export const slides = [
  {
    id: 1,
    imageUrl: "/img/SlideshowHomepage/Slide-post-0.png",
    link: "https://discord.com/channels/1075777026482520114/1300411111002079232/1394432156066906112",
    alt: "Ferdi28"
  },
  {
    id: 2,
    imageUrl: "/img/SlideshowHomepage/Slide-post-1.png",
    link: "https://discord.com/channels/1075777026482520114/1300411111002079232/1405530417188307114",
    alt: "fadel2023",
  },
  {
    id: 3,
    imageUrl: "/img/SlideshowHomepage/Slide-post-2.png",
    link: "https://discord.com/channels/1075777026482520114/1300411111002079232/1324969312099893279",
    alt: "destipus23",
  },
  {
    id: 4,
    imageUrl: "/img/SlideshowHomepage/Slide-post-3.png",
    link: "https://discord.com/channels/1075777026482520114/1300411111002079232/1345340270522142720",
    alt: "matthewkormasela",
  }
];

// Configuration options - modify these to customize behavior
export const slideshowConfig = {
  autoAdvanceInterval: 4000, // 4 seconds
  pauseOnHover: true,
  showProgressBar: true,
  showNavigationDots: true,
  enableKeyboardNavigation: false, // Set to true if you want arrow key navigation
  aspectRatio: "3/2", // Maintain 3:2 aspect ratio
  
  // Long-press configuration for mobile devices
  longPress: {
    enabled: true, // Enable/disable long-press functionality
    threshold: 750, // Time in milliseconds to trigger long-press (750ms = 0.75 seconds)
    moveThreshold: 10, // Maximum pixel movement allowed during long-press
    showIndicator: true, // Show visual indicator when long-press is active
    indicatorText: "Slideshow paused - Release to resume" // Customize indicator text
  }
};