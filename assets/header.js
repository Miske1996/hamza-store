class StickyHeader extends HTMLElement {
    constructor() {
      super();
      this.image_more_header = this.querySelectorAll(".left_menu_header_container .more_button_container img");
      this.image_search_header = this.querySelectorAll(".left_menu_header_container .search_button_container img");
      this.img_location = this.querySelectorAll(".right_menu_header_container .img_location img");
      this.img_user = this.querySelectorAll(".right_menu_header_container .img_user img");
      this.img_bag = this.querySelectorAll(".right_menu_header_container .img_bag img");
      this.link_items = this.querySelectorAll(".link_item");
    }

    connectedCallback() {
      this.header = document.querySelector('.section-header');
      this.headerIsAlwaysSticky = true;
      this.headerBounds = {};
    //   this.setHeaderHeight();
      
    //   window.matchMedia('(max-width: 990px)').addEventListener('change', this.setHeaderHeight.bind(this));

      if (this.headerIsAlwaysSticky) {
        this.header.classList.add('shopify-section-header-sticky');
      };

      this.currentScrollTop = 0;
      this.preventReveal = false;

      this.onScrollHandler = this.onScroll.bind(this);
      this.hideHeaderOnScrollUp = () => this.preventReveal = true;

      this.addEventListener('preventHeaderReveal', this.hideHeaderOnScrollUp);
      window.addEventListener('scroll', this.onScrollHandler, false);

      this.createObserver();
    }

    // setHeaderHeight() {

    //   document.documentElement.style.setProperty('--header-height', `${
    //     this.header.offsetHeight
    //   }px`);
    // }

    disconnectedCallback() {
      this.removeEventListener('preventHeaderReveal', this.hideHeaderOnScrollUp);
      window.removeEventListener('scroll', this.onScrollHandler);
    }

    createObserver() {
      let observer = new IntersectionObserver((entries, observer) => {
        this.headerBounds = entries[0].intersectionRect;
        observer.disconnect();
      });

      observer.observe(this.header);
    }

    onScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    
      

      if (scrollTop > this.currentScrollTop && scrollTop > this.headerBounds.bottom) {
        this.image_more_header[0].style.display = "none"
        this.image_more_header[1].style.display = "block"

        this.image_search_header[0].style.display = "none"
        this.image_search_header[1].style.display = "block"

        this.img_location[0].style.display = "none"
        this.img_location[1].style.display = "block"

        this.img_user[0].style.display = "none"
        this.img_user[1].style.display = "block"

        this.img_bag[0].style.display = "none"
        this.img_bag[1].style.display = "block"

        this.link_items.forEach((link_i) => { 
          link_i.style.color = "#152F4E"
        })

        this.header.classList.add('scrolled-past-header');
        if (this.preventHide) return;
        
        requestAnimationFrame(this.hide.bind(this)); 
      } else if (scrollTop < this.currentScrollTop && scrollTop > this.headerBounds.bottom) {       
        // this.image_more_header.src = `{{ 'more_dark.png' |  file_url }}`
        this.image_more_header[0].style.display = "none"
        this.image_more_header[1].style.display = "block"

        this.image_search_header[0].style.display = "none"
        this.image_search_header[1].style.display = "block"

        this.img_location[0].style.display = "none"
        this.img_location[1].style.display = "block"

        this.img_user[0].style.display = "none"
        this.img_user[1].style.display = "block"

        this.img_bag[0].style.display = "none"
        this.img_bag[1].style.display = "block"

        this.link_items.forEach((link_i) => {
          link_i.style.color = "#152F4E"
        })

        this.header.classList.add('scrolled-past-header');
        if (!this.preventReveal) {
          requestAnimationFrame(this.reveal.bind(this));
        } else {
          window.clearTimeout(this.isScrolling);
          this.isScrolling = setTimeout(() => {
            this.preventReveal = false;  
          }, 66);

          requestAnimationFrame(this.hide.bind(this));
        }
      } else if (scrollTop <= this.headerBounds.top) {
        // this.image_more_header.src = `{{ 'more.png' |  file_url }}`
        this.image_more_header[1].style.display = "none"
        this.image_more_header[0].style.display = "block"

        this.image_search_header[1].style.display = "none"
        this.image_search_header[0].style.display = "block"

        this.img_location[1].style.display = "none"
        this.img_location[0].style.display = "block"

        this.img_user[1].style.display = "none"
        this.img_user[0].style.display = "block"

        this.img_bag[1].style.display = "none"
        this.img_bag[0].style.display = "block"

        this.link_items.forEach((link_i) => {
          link_i.style.color = "white"
        })

        this.header.classList.remove('scrolled-past-header');
        requestAnimationFrame(this.reset.bind(this));
      }

      this.currentScrollTop = scrollTop;
    }

    hide() {
      if (this.headerIsAlwaysSticky) return;
      
      this.header.classList.add('shopify-section-header-hidden', 'shopify-section-header-sticky');
      this.closeMenuDisclosure();
      this.closeSearchModal();
    }

    reveal() {
      if (this.headerIsAlwaysSticky) return;
      
      this.header.classList.add('shopify-section-header-sticky', 'animate');
      this.header.classList.remove('shopify-section-header-hidden');
    }

    reset() {
      if (this.headerIsAlwaysSticky) return;
      
      this.header.classList.remove('shopify-section-header-hidden', 'shopify-section-header-sticky', 'animate');
    }

  }

  customElements.define('sticky-header', StickyHeader);