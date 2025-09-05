// Easy-to-modify slide data
// Simply change the URLs, links, and descriptions here

export const slides = [
  {
    id: 1,
    imageUrl: '/img/SlideshowHomepage/Slide-post-0.webp',
    link: 'https://discord.com/channels/1075777026482520114/1300411111002079232/1394432156066906112',
    alt: 'Ferdi28',
  },
  {
    id: 2,
    imageUrl: '/img/SlideshowHomepage/Slide-post-1.webp',
    link: 'https://discord.com/channels/1075777026482520114/1300411111002079232/1405530417188307114',
    alt: 'fadel2023',
  },
  {
    id: 3,
    imageUrl: '/img/SlideshowHomepage/Slide-post-2.webp',
    link: 'https://discord.com/channels/1075777026482520114/1300411111002079232/1324969312099893279',
    alt: 'destipus23',
  },
  {
    id: 4,
    imageUrl: '/img/SlideshowHomepage/Slide-post-3.webp',
    link: 'https://discord.com/channels/1075777026482520114/1300411111002079232/1345340270522142720',
    alt: 'matthewkormasela',
  },
  {
    id: 5,
    imageUrl: '/img/SlideshowHomepage/Slide-post-4.webp',
    link: 'https://discord.com/channels/1075777026482520114/1300411111002079232/1383799506419716097',
    alt: 'insky7519_Insky',
  },
  {
    id: 6,
    imageUrl: '/img/SlideshowHomepage/Slide-post-5.webp',
    link: 'https://discord.com/channels/1075777026482520114/1355063064159846431/1389971394812706847',
    alt: 'bas00292_Baskun',
  },
];

// Configuration options - modify these to customize behavior
export const slideshowConfig = {
  autoAdvanceInterval: 5000, // 5 seconds
  pauseOnHover: true,
  showProgressBar: true,
  showNavigationDots: true,
  enableKeyboardNavigation: false, // Set to true if you want arrow key navigation
  aspectRatio: '3/2', // Maintain 3:2 aspect ratio

  // Long-press configuration for mobile devices
  longPress: {
    enabled: true, // Enable/disable long-press functionality
    threshold: 750, // Time in milliseconds to trigger long-press (750ms = 0.75 seconds)
    moveThreshold: 10, // Maximum pixel movement allowed during long-press
    showIndicator: true, // Show visual indicator when long-press is active
    indicatorText: 'Slideshow paused - Release to resume in 0.5s', // Customize indicator text
    resumeDelay: 500, // Delay in milliseconds before resuming after long-press release
  },

  // ENHANCED: Progress bar configuration
  progressBar: {
    alwaysVisible: true, // Always show progress bar
    opacity: 0.8, // Default opacity (0-1)
    hoverOpacity: 1.0, // Opacity on hover
    height: '6px', // Progress bar height
    smoothAnimation: true, // Enable smooth 50ms interval updates
    showGradient: true, // Use gradient background
  },
};
