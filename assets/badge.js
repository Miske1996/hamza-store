class Badge extends HTMLElement {
    constructor() {
        super();
        this.scrollContainer = null;
        this.isSnapping = false;
        this.scrollInterval = null;
        this.scrollDuration = 3000; // 3 seconds

        // Bind event listener methods
        this.handleScroll = this.handleScroll.bind(this);
        this.snapToBadge = this.snapToBadge.bind(this);
    }

    connectedCallback() {
        // Get the scroll container element
        this.scrollContainer = this.querySelector('.badges_section');

        // Add event listener for scroll
        this.scrollContainer.addEventListener('scroll', this.handleScroll);

        // Set up the auto scroll interval
        this.scrollInterval = setInterval(this.snapToBadge, this.scrollDuration);
    }

    disconnectedCallback() {
        // Clean up when the element is removed
        this.scrollContainer.removeEventListener('scroll', this.handleScroll);
        clearInterval(this.scrollInterval);
    }

    handleScroll() {
        // Check if snapping is in progress, if so, ignore the scroll event
        if (this.isSnapping) {
            return;
        }

        // Calculate the scroll width of each badge container
        const badgeWidth = this.scrollContainer.offsetWidth;

        // Calculate the index of the currently visible badge
        const currentBadgeIndex = Math.round(this.scrollContainer.scrollLeft / badgeWidth);

        // Calculate the target scroll position based on the current index
        const targetScrollLeft = currentBadgeIndex * badgeWidth;

        // Snap to the target position with a smooth scroll
        this.isSnapping = true;
        this.scrollContainer.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth',
        });

        // Reset the snapping flag after a short delay to prevent interference with manual scrolling
        setTimeout(() => {
            this.isSnapping = false;
        }, 300);
    }

    snapToBadge() {
        // Calculate the next badge index
        const nextBadgeIndex = (Math.round(this.scrollContainer.scrollLeft / this.scrollContainer.offsetWidth) + 1) % this.scrollContainer.childElementCount;

        // Snap to the next badge with a smooth scroll
        this.isSnapping = true;
        this.scrollContainer.scrollTo({
            left: nextBadgeIndex * this.scrollContainer.offsetWidth,
            behavior: 'smooth',
        });

        // Reset the snapping flag after a short delay to prevent interference with manual scrolling
        setTimeout(() => {
            this.isSnapping = false;
        }, 300);
    }
    
}

customElements.define('badge-section', Badge);
