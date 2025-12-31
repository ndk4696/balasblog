// --- 1. Flicker-Free Image Animation ---
const framePaths = [
    "/image/Frame1.png",
    "/image/Frame2.png",
    "/image/Frame3.png",
    "/image/Frame4.png"
];

const preloadImages = (paths, callback) => {
    let loaded = 0;
    const total = paths.length;

    if (total === 0) return; // Safety check

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

    // Only run if elements exist (Prevents errors on other pages)
    if (!imgEl || !contentWrapper || !scrollWrapper) return;

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

// Start Animation
preloadImages(framePaths, playAnimation);


// --- 2. Handle Small Height Landscape Mode ---
function handleSmallHeightLandscape() {
    const isSmallLandscape = window.innerHeight <= 600 && window.innerWidth > window.innerHeight;
    const isVerySmallLandscape = window.innerHeight <= 350 && window.innerWidth > window.innerHeight;

    const tabs = document.querySelector('.tabs');
    // If not on the home page, stop here
    if (!tabs) return;

    const contentWrapper = document.getElementById('content-wrapper');
    const animationWrapper = document.querySelector('.animation-wrapper');
    const animation = document.getElementById('animation');
    const textContent = document.querySelector('.text-content');
    if (!textContent) return; // Safety
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
        // Apply Landscape Styles
        tabs.style.padding = '0';
        tabs.style.height = '100vh';
        tabs.style.overflow = 'hidden';

        contentWrapper.style.height = 'auto';
        contentWrapper.style.minHeight = '60vh';
        contentWrapper.style.padding = '0px';
        contentWrapper.style.flexDirection = 'column';
        contentWrapper.style.gap = '0em';
        contentWrapper.style.marginTop = '1em';

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

        scrollWrapper.style.position = 'absolute';
        scrollWrapper.style.bottom = isVerySmallLandscape ? '2px' : '5px';
        scrollWrapper.style.flexDirection = 'column';
        scrollWrapper.style.alignContent = 'center';
        scrollWrapper.style.width = 'auto';
        scrollWrapper.style.paddingBottom = '10px';

        scrollMessage.style.fontSize = isVerySmallLandscape ? '0.5rem' : '0.7rem';
        scrollMessage.style.textAlign = 'center';

        scrollDown.style.width = isVerySmallLandscape ? '5px' : '8px';
        scrollDown.style.height = isVerySmallLandscape ? '4px' : '7px';
        scrollDown.style.alignContent = 'center';

    } else {
        // Reset Styles
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
        if (animation) animation.style.opacity = '1';
    }
}


// --- 3. MAIN DOM EVENT LISTENER (Everything Safe Inside Here) ---
document.addEventListener('DOMContentLoaded', () => {
    
    // A. Run Landscape Logic
    handleSmallHeightLandscape();

    // B. Intersection Observer (Slide Up)
    const latestPosts = document.getElementById('latest-posts');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-up-visible');
                }
            });
        },
        { threshold: 0.1 }
    );
    if (latestPosts) {
        observer.observe(latestPosts);
    }

    // C. HAMBURGER MENU LOGIC
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", function(e) {
            e.stopPropagation();
            hamburger.classList.toggle("active");
            mobileMenu.classList.toggle("active");
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove("active");
                mobileMenu.classList.remove("active");
            }
        });
    }

    // D. SHARE BUTTON LOGIC
    const shareBtn = document.getElementById('shareBtn');
    const sharePopup = document.getElementById('sharePopup');
    const waLink = document.getElementById('waLink');
    const tgLink = document.getElementById('tgLink');

    if (shareBtn && sharePopup) {
        const shareUrl = window.location.href;
        const shareText = "Check out this latest article by Nanduri Bala Subrahmanyam: ";

        if (waLink) waLink.href = `https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`;
        if (tgLink) tgLink.href = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sharePopup.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!sharePopup.contains(e.target) && e.target !== shareBtn) {
                sharePopup.classList.remove('active');
            }
        });
    }

    // Copy to Clipboard (Global helper)
    window.copyToClipboard = function() {
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert("Link copied to clipboard!");
            if (sharePopup) sharePopup.classList.remove('active');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    // E. POPUP RESCUE (Fixes positioning issue)
    const popup = document.getElementById('thankYouPopup');
    if (popup) { document.body.appendChild(popup); }

    // F. NOTIFY FORM HANDLER
    const notifyForm = document.getElementById('notifyForm');
    const closeThankYou = document.getElementById('closeThankYou');

    if (notifyForm) {
        notifyForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const btn = notifyForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = "Sending...";
            btn.disabled = true;

            const formData = new FormData(notifyForm);

            fetch("https://formsubmit.co/ajax/balasblog@gmail.com", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                const finalPopup = document.getElementById('thankYouPopup');
                if (finalPopup) {
                    finalPopup.style.display = "flex";
                    // Small delay to allow display:flex to apply before adding class for animation
                    setTimeout(() => finalPopup.classList.add('active'), 10);
                }
                notifyForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error connecting. Please try again.");
                btn.textContent = originalText;
                btn.disabled = false;
            });
        });
    }

    // Close Popup Logic
    if (closeThankYou) {
        closeThankYou.addEventListener('click', () => {
            const finalPopup = document.getElementById('thankYouPopup');
            if (finalPopup) {
                finalPopup.style.display = "none";
                finalPopup.classList.remove('active');
            }
        });
    }
});

// --- 4. Window Event Listeners ---
window.addEventListener('resize', handleSmallHeightLandscape);
window.addEventListener('orientationchange', handleSmallHeightLandscape);