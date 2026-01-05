// assets/js/roulette.js

class ImageRoulette {
    constructor(element) {
        this.container = element;
        this.images = JSON.parse(element.dataset.images);
        this.currentIndex = 0;
        
        // Setup DOM
        const stage = element.querySelector('.roulette-stage');
        
        // Double Buffers for Cross-fade
        this.imgA = document.createElement('img');
        this.imgA.className = 'roulette-main-img visible';
        this.imgA.src = this.images[0].url;
        
        this.imgB = document.createElement('img');
        this.imgB.className = 'roulette-main-img';
        
        stage.appendChild(this.imgB);
        stage.appendChild(this.imgA);

        this.activeImgElement = this.imgA;
        this.nextImgElement = this.imgB;

        // UI Refs
        this.captionText = element.querySelector('.caption-text');
        this.thumbWrapper = element.querySelector('.roulette-thumbnails');
        
        // Track Setup
        // Check if R created track, otherwise create it (backward compatibility)
        this.track = element.querySelector('.r-track');
        if(!this.track) {
            this.track = document.createElement('div');
            this.track.className = 'r-track';
            this.thumbWrapper.appendChild(this.track);
        }

        // State
        this.isAnimating = false;
        this.currentTrackX = 0; // Tracks the CSS transform value
        this.peekWidth = 0;

        // Drag/Scroll State
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragCurrentX = 0;
        this.lastDragTime = 0;
        this.scrollCooldown = false;

        this.init();
    }

    init() {
        // 1. Build Triple Buffer Track
        const sets = [this.images, this.images, this.images];
        sets.flat().forEach((imgData, index) => {
            let thumb = document.createElement('img');
            thumb.src = imgData.url;
            thumb.className = 'r-thumb';
            // Prevent default drag behavior on images (ghost image)
            thumb.ondragstart = () => false; 
            
            thumb.addEventListener('click', (e) => {
                // Only trigger if we weren't dragging
                if(this.isDragging) return; 
                this.jumpToTrackIndex(index);
            });
            
            this.track.appendChild(thumb);
        });

        // 2. Initial Align
        const startTrackIndex = this.images.length;
        const peekStyle = getComputedStyle(this.container).getPropertyValue('--r-thumb-peek');
        this.peekWidth = parseInt(peekStyle) || 50;

        setTimeout(() => {
            this.highlightThumbnail(startTrackIndex);
            this.alignTrack(false);
            this.setupInteractions();
        }, 100);
        
        window.addEventListener('resize', () => this.alignTrack(false));
    }

    setupInteractions() {
        // --- A. Scroll Wheel ---
        this.thumbWrapper.addEventListener('wheel', (e) => {
            e.preventDefault(); // Stop page scroll
            if (this.isAnimating || this.scrollCooldown) return;

            // Threshold to prevent hyper-scrolling
            if (Math.abs(e.deltaY) > 10 || Math.abs(e.deltaX) > 10) {
                // Downroll (pos Y) -> Move Right (Next)
                const direction = (e.deltaY > 0 || e.deltaX > 0) ? 1 : -1;
                this.navigate(direction);
                
                // Cooldown
                this.scrollCooldown = true;
                setTimeout(() => this.scrollCooldown = false, 150);
            }
        }, { passive: false });

        // --- B. Drag / Swipe (Pointer Events) ---
        // Works for Mouse and Touch
        this.thumbWrapper.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.thumbWrapper.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.thumbWrapper.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.thumbWrapper.addEventListener('pointerleave', this.onPointerUp.bind(this));
    }

    onPointerDown(e) {
        if (this.isAnimating) return;
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragCurrentX = this.currentTrackX; // Capture where we are now
        
        this.track.style.transition = 'none'; // Instant movement
        this.track.setPointerCapture(e.pointerId);
        this.thumbWrapper.style.cursor = 'grabbing';
    }

    onPointerMove(e) {
        if (!this.isDragging) return;
        
        const diff = e.clientX - this.dragStartX;
        
        // 1:1 sliding feedback
        // We limit drag distance slightly to avoid dragging off screen entirely
        const dampedDiff = diff; 
        this.track.style.transform = `translateX(${this.dragCurrentX + dampedDiff}px)`;
    }

    onPointerUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.thumbWrapper.style.cursor = ''; // Revert to CSS default (grab)
        this.track.releasePointerCapture(e.pointerId);

        const diff = e.clientX - this.dragStartX;
        const threshold = 50; // Pixels to trigger change

        if (diff < -threshold) {
            // Dragged Left -> Next
            this.navigate(1);
        } else if (diff > threshold) {
            // Dragged Right -> Prev
            this.navigate(-1);
        } else {
            // Snap back (was a tap or small drag)
            // Restore transition for smooth snap back
            this.track.style.transition = ''; 
            this.alignTrack(true);
        }
    }

    navigate(direction) {
        if (this.isAnimating) return;
        
        const len = this.images.length;
        this.currentIndex = (this.currentIndex + direction + len) % len;
        
        this.updateMainDisplay();
        this.slideTrack(direction);
    }

    // Standard Logic from here down
    jumpToTrackIndex(trackIndex) {
        const currentTrackIndex = this.getCurrentTrackIndex();
        const diff = trackIndex - currentTrackIndex;
        if (diff === 0) return;
        
        const len = this.images.length;
        this.currentIndex = (this.currentIndex + diff + (len * 10)) % len;

        this.updateMainDisplay();
        
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
        
        // Restore transition if it was removed by drag
        this.track.style.transition = ''; 
        
        this.alignTrack(true);
        this.cleanupLoop(nextTrackIndex);
    }

    cleanupLoop(targetIndex) {
        const transitionDuration = getComputedStyle(this.track).transitionDuration;
        const ms = parseFloat(transitionDuration) * 1000 || 600;

        setTimeout(() => {
            const len = this.images.length;
            let newIndex = targetIndex;
            let didTeleport = false;

            if (targetIndex < len) {
                newIndex = targetIndex + len;
                didTeleport = true;
            } else if (targetIndex >= len * 2) {
                newIndex = targetIndex - len;
                didTeleport = true;
            }

            if (didTeleport) {
                this.highlightThumbnail(newIndex);
                this.alignTrack(false);
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

        if (animate === false) {
             this.track.style.transition = 'none';
        }

        const thumbLeft = activeThumb.offsetLeft;
        const targetX = -(thumbLeft - this.peekWidth);
        
        // Store this for drag logic calculations
        this.currentTrackX = targetX;

        this.track.style.transform = `translateX(${targetX}px)`;
        
        if (!animate) void this.track.offsetWidth;
    }

    updateMainDisplay() {
        const currentData = this.images[this.currentIndex];
        const imgToLoad = this.nextImgElement;
        const imgToHide = this.activeImgElement;

        imgToLoad.src = currentData.url;
        
        const reveal = () => {
            imgToLoad.classList.add('visible');
            imgToHide.classList.remove('visible');
            
            this.captionText.classList.add('fade-text');
            setTimeout(() => {
                this.captionText.innerHTML = currentData.caption || ""; 
                this.captionText.classList.remove('fade-text');
            }, 200);

            this.activeImgElement = imgToLoad;
            this.nextImgElement = imgToHide;
        };

        if (imgToLoad.complete) reveal();
        else imgToLoad.onload = reveal;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const roulettes = document.querySelectorAll('.roulette-container');
    roulettes.forEach(el => new ImageRoulette(el));
});