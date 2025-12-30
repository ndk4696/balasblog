// --- Flicker-Free Image Animation ---
const framePaths = [
	"/image/Frame1.png",
	"/image/Frame2.png",
	"/image/Frame3.png",
	"/image/Frame4.png"
  ];
  
  const preloadImages = (paths, callback) => {
	let loaded = 0;
	const total = paths.length;
  
	paths.forEach((path) => {
	  const img = new Image();
	  img.onload = () => {
		loaded++;
		if (loaded === total) callback();
	  };
	  img.onerror = () => {
		loaded++;
		if (loaded === total) callback();
	  };
	  img.src = path;
	});
  };
  
  const playAnimation = () => {
	const imgEl = document.getElementById("animation");
	const contentWrapper = document.getElementById("content-wrapper");
	const scrollWrapper = document.getElementById("scroll-container");
  
	imgEl.style.opacity = 1;
  
	let frame = 0;
	const totalFrames = framePaths.length;
	const frameDuration = 800;
  
	const interval = setInterval(() => {
	  frame++;
  
	  if (frame < totalFrames) {
		imgEl.src = framePaths[frame];
	  }
  
	  if (frame === 2) {
		contentWrapper.classList.add('deblur');
	  }
  
	  if (frame === 3) {
		scrollWrapper.classList.add('visible');
	  }
  
	  if (frame >= totalFrames) {
		clearInterval(interval);
	  }
	}, frameDuration);
  };
  
  preloadImages(framePaths, playAnimation);

// Add this to your script.js file

// Function to handle small height landscape mode
function handleSmallHeightLandscape() {
	// Check if we're in landscape mode with height <= 500px
	const isSmallLandscape = window.innerHeight <= 600 && window.innerWidth > window.innerHeight;
	const isVerySmallLandscape = window.innerHeight <= 350 && window.innerWidth > window.innerHeight;
	
	// Elements we need to modify
	const tabs = document.querySelector('.tabs');
	const contentWrapper = document.getElementById('content-wrapper');
	const animationWrapper = document.querySelector('.animation-wrapper');
	const animation = document.getElementById('animation');
	const textContent = document.querySelector('.text-content');
	const h1 = textContent.querySelector('h1');
	const tagline = document.querySelector('.tagline');
	const bullets = document.querySelectorAll('.bullet');
	const scrollWrapper = document.getElementById('scroll-container');
	const scrollMessage = document.querySelector('.scroll-message');
	const scrollDown = document.querySelector('.scroll-down');
	
	const resetStyles = (el, styles) => {
		if (!el) return;
		styles.forEach(style => {
			el.style[style] = '';
		});
	};
	if (isSmallLandscape) {
	  // Apply landscape styles directly
	  
	  // Tab and content wrapper
	  tabs.style.padding = '0';
	  tabs.style.height = '100vh';
	  tabs.style.overflow = 'hidden';
	  
	  contentWrapper.style.height = 'auto';
	  contentWrapper.style.minHeight = '60vh';
	  contentWrapper.style.padding = '0px';
	  contentWrapper.style.flexDirection = 'column';
	  contentWrapper.style.gap = '0em';
	  contentWrapper.style.marginTop = '1em';
	  
	  // Animation
	  animationWrapper.style.transform = 'translateX(10px)';
	  animationWrapper.style.flex = '0.6';
	  animationWrapper.style.margin = '0';
	  animationWrapper.style.padding = '0';
	  animationWrapper.style.width = 'auto';
	  animationWrapper.style.alignContent = 'center';
	  
	  animation.style.maxHeight = isVerySmallLandscape ? '150px' : '250px';
	  animation.style.maxWidth = isVerySmallLandscape ? '150px' : '250px';
	  animation.style.width = 'auto';
	  animation.style.objectFit = 'contain';
	  animation.style.alignContent = 'center';
	  
	  // Text content
	  textContent.style.flex = '1.4';
	  textContent.style.textAlign = 'center';
	  textContent.style.alignItems = 'center';
	  textContent.style.padding = '0';
	  textContent.style.width = 'auto';
	  
	  h1.style.fontSize = isVerySmallLandscape ? 'clamp(0.7rem, 2vw, 1.1rem)' : 'clamp(0.8rem, 2.5vw, 1.4rem)';
	  h1.style.lineHeight = '1.1';
	  h1.style.marginBottom = '8px';
	  h1.style.textAlign = 'center';
	  
	  tagline.style.marginTop = isVerySmallLandscape ? '5px' : '10px';
	  tagline.style.fontSize = isVerySmallLandscape ? 'clamp(0.7rem, 1vw, 1rem)' : 'clamp(0.9rem, 1.2vw, 1.1rem)';
	  tagline.style.lineHeight = '1.2';
	  tagline.style.textAlign = 'center';
	  
	  bullets.forEach(bullet => {
		bullet.style.fontSize = '8px';
	  });
	  
	  // Scroll indicator
	  scrollWrapper.style.position = 'absolute';
	  scrollWrapper.style.bottom = isVerySmallLandscape ? '2px' : '5px';
	  scrollWrapper.style.flexDirection = 'column';
	  scrollWrapper.style.alignContent = 'center';
	  scrollWrapper.style.width = 'auto';
	  scrollWrapper.style.paddingBottom = '10px';

	  
	  scrollMessage.style.fontSize = isVerySmallLandscape ? '0.5rem' : '0.7rem';
	  scrollMessage.style.textAlign = 'center'
	  
	  scrollDown.style.width = isVerySmallLandscape ? '5px' : '8px';
	  scrollDown.style.height = isVerySmallLandscape ? '4px' : '7px';
	  scrollDown.style.alignContent = 'center'

	} else {
		// ✅ Use resetStyles helper here
		resetStyles(tabs, ['padding', 'height', 'overflow']);
		resetStyles(contentWrapper, ['height', 'minHeight', 'padding', 'flexDirection', 'gap', 'marginTop']);
		resetStyles(animationWrapper, ['transform', 'flex', 'margin', 'padding', 'width', 'alignContent']);
		resetStyles(animation, ['maxHeight', 'maxWidth', 'width', 'objectFit', 'alignContent']);
		resetStyles(textContent, ['flex', 'paddingRight', 'textAlign', 'alignItems', 'padding', 'width']);
		resetStyles(h1, ['fontSize', 'lineHeight', 'marginBottom', 'textAlign']);
		resetStyles(tagline, ['marginTop', 'fontSize', 'lineHeight', 'textAlign']);
		resetStyles(scrollWrapper, ['position', 'bottom', 'flexDirection', 'alignContent', 'width', 'paddingBottom', 'marginTop']);
		resetStyles(scrollMessage, ['fontSize', 'textAlign']);
		resetStyles(scrollDown, ['width', 'height', 'alignContent']);
		bullets.forEach(bullet => resetStyles(bullet, ['fontSize']));

		// ✅ Re-apply animation visibility
		animation.style.opacity = '1';
	}
  }
  
   // Run on page load
document.addEventListener('DOMContentLoaded', () => {
	handleSmallHeightLandscape();
	
	// Intersection Observer for slide-up effect
	const latestPosts = document.getElementById('latest-posts');
	const observer = new IntersectionObserver(
	  (entries) => {
		entries.forEach((entry) => {
		  if (entry.isIntersecting) {
			entry.target.classList.add('slide-up-visible');
		  }
		});
	  },
	  {
		threshold: 0.1,
	  }
	);
  
	if (latestPosts) {
	  observer.observe(latestPosts);
	}
  });
  
  // Run when window resizes or orientation changes
  window.addEventListener('resize', handleSmallHeightLandscape);
  window.addEventListener('orientationchange', handleSmallHeightLandscape);

  
  // 1. Select Elements
    const shareBtn = document.getElementById('shareBtn');
    const sharePopup = document.getElementById('sharePopup');
    const waLink = document.getElementById('waLink');
    const tgLink = document.getElementById('tgLink');

    // 2. Define the URL you want to share (Current Page)
    // Since your latest post is hardcoded, you can hardcode the link here too if you want,
    // OR just use window.location.href to share the homepage link.
    const shareUrl = window.location.href; 
    const shareText = "Check out this latest article by Nanduri Bala Subrahmanyam: ";

    // 3. Update Social Links
    waLink.href = `https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`;
    tgLink.href = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

    // 4. Toggle Popup on Click
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents the click from closing it immediately
        sharePopup.classList.toggle('active');
    });

    // 5. Close Popup when clicking anywhere else
    document.addEventListener('click', (e) => {
        if (!sharePopup.contains(e.target) && e.target !== shareBtn) {
            sharePopup.classList.remove('active');
        }
    });

    // 6. Copy Link Function
    function copyToClipboard() {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert("Link copied to clipboard!");
            sharePopup.classList.remove('active'); // Close after copying
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }