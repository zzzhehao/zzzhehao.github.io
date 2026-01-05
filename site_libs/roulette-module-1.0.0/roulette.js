// assets/js/roulette.js

class ImageRoulette {
    constructor(element) {
        this.container = element;
        this.id = element.id;
        this.images = JSON.parse(element.dataset.images);
        this.currentIndex = 0;
        
        // --- 1. SETUP DOM FOR CROSS-FADE ---
        // We need two image elements to cross-fade smoothly.
        const stage = element.querySelector('.roulette-stage');
        // Clear existing static img if any (from R generation)
        const existingImg = stage.querySelector('.roulette-main-img');
        if(existingImg) existingImg.remove();

        // Create Double Buffers
        this.imgA = document.createElement('img');
        this.imgA.className = 'roulette-main-img visible'; // Start visible
        this.imgA.src = this.images[0].url;
        
        this.imgB = document.createElement('img');
        this.imgB.className = 'roulette-main-img'; // Start hidden
        
        // Append (Order matters for z-index stacking context)
        stage.insertBefore(this.imgB, stage.querySelector('.r-next'));
        stage.insertBefore(this.imgA, stage.querySelector('.r-next'));

        // Pointers to keep track of who is who
        this.activeImgElement = this.imgA;
        this.nextImgElement = this.imgB;

        // --- 2. REST OF DOM ---
        this.captionText = element.querySelector('.caption-text');
        this.thumbWrapper = element.querySelector('.roulette-thumbnails');
        this.prevBtn = element.querySelector('.r-prev');
        this.nextBtn = element.querySelector('.r-next');
        
        // Create Track
        this.track = document.createElement('div');
        this.track.className = 'r-track';
        this.thumbWrapper.appendChild(this.track);

        this.isAnimating = false;
        this.init();
    }

    init() {
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));
        
        this.container.addEventListener('mouseenter', () => {
            document.addEventListener('keydown', this.handleKey.bind(this));
        });
        this.container.addEventListener('mouseleave', () => {
            document.removeEventListener('keydown', this.handleKey.bind(this));
        });

        // Build Triple Buffer Track
        const sets = [this.images, this.images, this.images];
        sets.flat().forEach((imgData, index) => {
            let thumb = document.createElement('img');
            thumb.src = imgData.url;
            thumb.className = 'r-thumb';
            
            // Calculate logical index (0 to Length)
            const logicalIndex = index % this.images.length;
            
            thumb.addEventListener('click', () => {
                if(this.isAnimating) return;
                // We jump to the specific track index of THIS thumbnail
                this.jumpToTrackIndex(index);
            });
            
            this.track.appendChild(thumb);
        });

        // Initial Align
        // Start in the Middle Set (Index = Length)
        const startTrackIndex = this.images.length;
        this.currentIndex = 0;
        
        // Helper to get CSS variable for peek width (e.g. 50px)
        const peekStyle = getComputedStyle(this.container).getPropertyValue('--r-thumb-peek');
        this.peekWidth = parseInt(peekStyle) || 50;

        setTimeout(() => {
            this.highlightThumbnail(startTrackIndex);
            this.alignTrack(false);
        }, 100);
        
        window.addEventListener('resize', () => this.alignTrack(false));
    }

    handleKey(e) {
        if (e.key === 'ArrowLeft') this.navigate(-1);
        if (e.key === 'ArrowRight') this.navigate(1);
    }

    navigate(direction) {
        if (this.isAnimating) return;
        
        const len = this.images.length;
        this.currentIndex = (this.currentIndex + direction + len) % len;
        
        this.updateMainDisplay();
        this.slideTrack(direction);
    }

    // Jump when clicking a specific thumbnail in the track
    jumpToTrackIndex(trackIndex) {
        // Calculate direction relative to current active thumbnail
        const currentTrackIndex = this.getCurrentTrackIndex();
        const diff = trackIndex - currentTrackIndex;
        
        if (diff === 0) return;
        
        // Update logical index
        const len = this.images.length;
        this.currentIndex = (this.currentIndex + diff + (len * 10)) % len;

        this.updateMainDisplay();
        
        // Trigger Slide
        this.isAnimating = true;
        this.highlightThumbnail(trackIndex);
        this.alignTrack(true);
        
        this.cleanupLoop(trackIndex);
    }

    getCurrentTrackIndex() {
        const thumbs = Array.from(this.track.children);
        return thumbs.findIndex(t => t.classList.contains('active'));
    }

    slideTrack(direction) {
        this.isAnimating = true;
        const currentTrackIndex = this.getCurrentTrackIndex();
        const nextTrackIndex = currentTrackIndex + direction;
        
        this.highlightThumbnail(nextTrackIndex);
        this.alignTrack(true);
        
        this.cleanupLoop(nextTrackIndex);
    }

    cleanupLoop(targetIndex) {
        const transitionDuration = getComputedStyle(this.track).transitionDuration;
        const ms = parseFloat(transitionDuration) * 1000;

        setTimeout(() => {
            const len = this.images.length;
            let newIndex = targetIndex;
            let didTeleport = false;

            // Teleport if we are in Buffer Zones
            if (targetIndex < len) {
                // Left buffer -> Jump to Middle
                newIndex = targetIndex + len;
                didTeleport = true;
            } else if (targetIndex >= len * 2) {
                // Right buffer -> Jump to Middle
                newIndex = targetIndex - len;
                didTeleport = true;
            }

            if (didTeleport) {
                this.highlightThumbnail(newIndex);
                this.alignTrack(false); // Instant jump
            }
            
            this.isAnimating = false;
        }, ms);
    }

    highlightThumbnail(index) {
        const thumbs = Array.from(this.track.children);
        thumbs.forEach(t => t.classList.remove('active'));
        if(thumbs[index]) thumbs[index].classList.add('active');
    }

    alignTrack(animate) {
        const activeThumb = this.track.querySelector('.active');
        if (!activeThumb) return;

        this.track.style.transition = animate ? '' : 'none';

        // --- FIXED ALIGNMENT LOGIC ---
        // Goal: The active thumb's left edge should always be at 'this.peekWidth' pixels.
        
        // 1. Where is the thumb currently relative to the track start?
        const thumbLeft = activeThumb.offsetLeft;
        
        // 2. We want to pull the track leftwards (-) by that amount, 
        //    but push it back right (+) by the fixed peek width.
        const targetX = -(thumbLeft - this.peekWidth);

        this.track.style.transform = `translateX(${targetX}px)`;
        
        if (!animate) void this.track.offsetWidth;
    }

    updateMainDisplay() {
        const currentData = this.images[this.currentIndex];
        const imgToLoad = this.nextImgElement;
        const imgToHide = this.activeImgElement;

        // 1. Load new image into the hidden element
        imgToLoad.src = currentData.url;
        
        const reveal = () => {
            imgToLoad.classList.add('visible');
            imgToHide.classList.remove('visible');
            
            // Update Caption
            this.captionText.classList.add('fade-text');
            setTimeout(() => {
                this.captionText.textContent = currentData.caption || "";
                this.captionText.classList.remove('fade-text');
            }, 200);

            // Swap references for next time
            this.activeImgElement = imgToLoad;
            this.nextImgElement = imgToHide;
        };

        if (imgToLoad.complete) {
            reveal();
        } else {
            imgToLoad.onload = reveal;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const roulettes = document.querySelectorAll('.roulette-container');
    roulettes.forEach(el => new ImageRoulette(el));
});