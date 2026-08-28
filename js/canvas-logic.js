// Prevent the script from running twice when Swup swaps pages
if (!window.deepSeaRunning) {
	window.deepSeaRunning = true;

	const canvas = document.getElementById("deep-sea-bg");
	const ctx = canvas.getContext("2d");

	// THE RESCUE: If Quarto trapped the canvas inside a container,
	// rip it out and attach it directly to the <body> so Swup never deletes it.
	if (canvas && canvas.parentElement !== document.body) {
		document.body.prepend(canvas);
		console.log("[Deep Sea] Canvas rescued from Swup's blast radius!");
	}

	// --- 1. CONFIGURATION & STATE ---
	let width = (canvas.width = window.innerWidth);
	let height = (canvas.height = window.innerHeight);

	const CONFIG = {
		descentTime: 5000,
		focalLength: 300,
		maxZ: 1000,

		// Snow Configuration
		snowDensity: 150, // Total number of marine snow particles
		snowBaseSpeed: 0.5,
		descentSpeedMultiplier: 8,

		// Animal Configuration
		animalSpawnRate: 0.005, // Chance per frame (0.005 is roughly 1 animal every 3-4 seconds at 60fps)

		// Image Paths (Update these with your actual file names)
		snowPaths: ["/assets/bg/snow1.png", "/assets/bg/snow2.png"],
		animalPaths: ["/assets/bg/fish1.png"],
	};

	const STATE = {
		startTime: performance.now(),
		isDescending: true,
		progress: 0,
	};

	const shallowColor = { r: 30, g: 59, b: 112 };
	const deepColor = { r: 10, g: 17, b: 40 };

	// Asset Storage
	const assets = {
		snow: [],
		animals: [],
	};
	let animalsArray = []; // Stores active animals

	// --- 2. ASSET PRELOADER ---
	function preloadImages(paths, storageArray, callback) {
		let loadedCount = 0;
		if (paths.length === 0) return callback();

		paths.forEach((path) => {
			const img = new Image();
			img.src = path;

			// If image loads successfully
			img.onload = () => {
				storageArray.push(img);
				checkDone();
			};

			// If image is missing or path is wrong (CRITICAL FIX)
			img.onerror = () => {
				console.warn(
					`[Deep Sea] Missing image: ${path}. Falling back to default shapes.`,
				);
				checkDone(); // Continue the animation anyway!
			};

			function checkDone() {
				loadedCount++;
				if (loadedCount === paths.length) callback();
			}
		});
	}

	// --- 3. CLASSES ---
	class MarineSnow {
		constructor() {
			this.reset(true);
		}
		reset(randomizeY = false) {
			this.x = (Math.random() - 0.5) * width * 3;
			this.y = randomizeY ? Math.random() * height : height + 100;
			this.z = Math.random() * CONFIG.maxZ;

			// Randomly assign one of the loaded snow PNGs to this particle
			if (assets.snow.length > 0) {
				this.img =
					assets.snow[Math.floor(Math.random() * assets.snow.length)];
				// Size based on image natural width, scaled down
				this.baseSize = (Math.random() * 0.5 + 0.2) * this.img.width;
			} else {
				this.baseSize = Math.random() * 3 + 2; // Fallback circle
			}

			this.driftX = (Math.random() - 0.5) * 0.5;
		}
		update(speedMultiplier) {
			this.scale = CONFIG.focalLength / (CONFIG.focalLength + this.z);
			const currentSpeed = CONFIG.snowBaseSpeed * speedMultiplier;
			this.y -= currentSpeed * this.scale * 2;
			this.x += this.driftX * this.scale;

			if (this.y < -100) this.reset(false);
		}
		draw() {
			const screenX = width / 2 + this.x * this.scale;
			const screenY = this.y;
			const size = this.baseSize * this.scale;

			if (this.img) {
				// Draw PNG (Centered)
				ctx.drawImage(
					this.img,
					screenX - size / 2,
					screenY - size / 2,
					size,
					size,
				);
			} else {
				// Fallback if no images loaded
				ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
				ctx.beginPath();
				ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}

	class Animal {
		constructor() {
			// Random Z depth
			this.z = Math.random() * CONFIG.maxZ;
			this.scale = CONFIG.focalLength / (CONFIG.focalLength + this.z);

			// Pick random animal image
			this.img =
				assets.animals[
					Math.floor(Math.random() * assets.animals.length)
				];
			this.size = this.img
				? this.img.width * this.scale
				: 50 * this.scale;

			// 50% chance to start on left or right
			this.isMovingRight = Math.random() > 0.5;

			// Start completely off-screen
			this.x = this.isMovingRight
				? -(width / 2) - this.size
				: width / 2 + this.size;
			this.y = Math.random() * height; // Random height

			// Speed (adjusted by depth scale so distant animals move slower)
			const baseSpeed = Math.random() * 2 + 1;
			this.speedX =
				(this.isMovingRight ? baseSpeed : -baseSpeed) * this.scale;

			this.markForDeletion = false;
		}
		update() {
			this.x += this.speedX;

			// If it goes completely off the opposite side, mark it for deletion
			if (
				this.isMovingRight &&
				width / 2 + this.x * this.scale > width + this.size
			) {
				this.markForDeletion = true;
			} else if (
				!this.isMovingRight &&
				width / 2 + this.x * this.scale < -this.size
			) {
				this.markForDeletion = true;
			}
		}
		draw() {
			const screenX = width / 2 + this.x * this.scale;

			if (this.img) {
				// If moving left, we need to flip the image horizontally
				if (!this.isMovingRight) {
					ctx.save();
					ctx.translate(screenX, this.y);
					ctx.scale(-1, 1);
					ctx.drawImage(
						this.img,
						-this.size / 2,
						-this.size / 2,
						this.size,
						this.size,
					);
					ctx.restore();
				} else {
					ctx.drawImage(
						this.img,
						screenX - this.size / 2,
						this.y - this.size / 2,
						this.size,
						this.size,
					);
				}
			}
		}
	}

	// --- 4. HELPER FUNCTIONS (BUG FIXED) ---
	// Returns an OBJECT, not a string
	function interpolateColorObj(color1, color2, factor) {
		return {
			r: Math.round(color1.r + (color2.r - color1.r) * factor),
			g: Math.round(color1.g + (color2.g - color1.g) * factor),
			b: Math.round(color1.b + (color2.b - color1.b) * factor),
		};
	}
	// Converts color object to CSS string
	function toRGB(c) {
		return `rgb(${c.r}, ${c.g}, ${c.b})`;
	}

	window.addEventListener("resize", () => {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
	});

	let particles = [];

	// --- 5. MAIN ANIMATION LOOP ---
	function animate(currentTime) {
		if (STATE.isDescending) {
			const elapsed = currentTime - STATE.startTime;
			STATE.progress = Math.min(elapsed / CONFIG.descentTime, 1);
			if (STATE.progress >= 1) STATE.isDescending = false;
		}

		ctx.clearRect(0, 0, width, height);

		// 1. Draw Background Gradient (BUG FIXED)
		const currentColorObj = interpolateColorObj(
			shallowColor,
			deepColor,
			STATE.progress,
		);
		const darkerBottomObj = interpolateColorObj(
			currentColorObj,
			{ r: 0, g: 0, b: 0 },
			0.3,
		); // 30% darker at bottom

		const gradient = ctx.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(0, toRGB(currentColorObj));
		gradient.addColorStop(1, toRGB(darkerBottomObj));

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		const speedMultiplier = STATE.isDescending
			? CONFIG.descentSpeedMultiplier
			: 1;

		// 2. Spawn Animals
		if (
			assets.animals.length > 0 &&
			Math.random() < CONFIG.animalSpawnRate
		) {
			animalsArray.push(new Animal());
		}

		// 3. Update and Draw Snow
		particles.forEach((p) => {
			p.update(speedMultiplier);
			p.draw();
		});

		// 4. Update and Draw Animals
		animalsArray.forEach((a) => {
			a.update();
			a.draw();
		});

		// Remove animals that have left the screen
		animalsArray = animalsArray.filter((a) => !a.markForDeletion);

		requestAnimationFrame(animate);
	}

	// --- 6. STARTUP SEQUENCE ---
	// Load snow, then load animals, then start animation
	preloadImages(CONFIG.snowPaths, assets.snow, () => {
		preloadImages(CONFIG.animalPaths, assets.animals, () => {
			// Initialize particles only after images are loaded
			particles = Array.from(
				{ length: CONFIG.snowDensity },
				() => new MarineSnow(),
			);

			// Reset start time so descent starts precisely when loading finishes
			STATE.startTime = performance.now();
			requestAnimationFrame(animate);
		});
	});
}
