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