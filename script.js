// --- Sticky Navigation ---
class StickyNavigation {
	constructor() {
	  this.currentId = null;
	  this.currentTab = null;
	  this.tabContainerHeight = 70;
	  let self = this;
	  $('.tab').click(function () {
		self.onTabClick(event, $(this));
	  });
	  $(window).scroll(() => this.onScroll());
	  $(window).resize(() => this.onResize());
	}
  
	onTabClick(event, element) {
	  event.preventDefault();
	  let scrollTop = $(element.attr('href')).offset().top - this.tabContainerHeight + 1;
	  $('html, body').animate({ scrollTop: scrollTop }, 600);
	}
  
	onScroll() {
	  this.checkTabContainerPosition();
	  this.findCurrentTabSelector();
	}
  
	onResize() {
	  if (this.currentId) {
		this.setSliderCss();
	  }
	}
  
	checkTabContainerPosition() {
	  let offset = $('.tabs').offset().top + $('.tabs').height() - this.tabContainerHeight;
	  if ($(window).scrollTop() > offset) {
		$('.tabs-container').addClass('tabs-container--top');
	  } else {
		$('.tabs-container').removeClass('tabs-container--top');
	  }
	}
  
	findCurrentTabSelector() {
	  let newCurrentId;
	  let newCurrentTab;
	  let self = this;
	  $('.tab').each(function () {
		let id = $(this).attr('href');
		let offsetTop = $(id).offset().top - self.tabContainerHeight;
		let offsetBottom = $(id).offset().top + $(id).height() - self.tabContainerHeight;
		if ($(window).scrollTop() > offsetTop && $(window).scrollTop() < offsetBottom) {
		  newCurrentId = id;
		  newCurrentTab = $(this);
		}
	  });
	  if (this.currentId !== newCurrentId || this.currentId === null) {
		this.currentId = newCurrentId;
		this.currentTab = newCurrentTab;
		this.setSliderCss();
	  }
	}
  
	setSliderCss() {
	  if (this.currentTab) {
		$('.tab-slider').css({
		  width: this.currentTab.css('width'),
		  left: this.currentTab.offset().left
		});
	  }
	}
  }
  
  new StickyNavigation();
  
  
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
	const frameDuration = 800; // 6 seconds total
  
	const interval = setInterval(() => {
	  frame++;
  
	  // Change image frame
	  if (frame < totalFrames) {
		imgEl.src = framePaths[frame];
	  }
  
	  // Deblur after frame 2 (index 2)
	  if (frame === 2) {
		contentWrapper.classList.add('deblur');
	  }
  
	  // Show scroll after frame 3 (index 3)
	  if (frame === 3) {
		scrollWrapper.classList.add('visible'); // triggers fade-in
	  }
  
	  if (frame >= totalFrames) {
		clearInterval(interval);
	  }
	}, frameDuration);
  };
  
  preloadImages(framePaths, playAnimation);