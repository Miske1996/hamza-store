class CollectionListFilter extends HTMLElement {
    constructor() {
      super();
      this.typeCollectionTabs();
      this.colorFilter();
      this.initScrollButtons();
    }
    typeCollectionTabs(){
        let collection_tabs = this.querySelectorAll(".collection_tab");
        collection_tabs.forEach((collection_tab) => {
            collection_tab.addEventListener('click',() => {
                if(!collection_tab.classList.contains("collection_tab_active")){
                    collection_tabs.forEach((collection_tab) => {
                        collection_tab.classList.remove("collection_tab_active")
                    })
                    collection_tab.classList.add("collection_tab_active");
                }
            })
        })
    }

    colorFilter(){
        let color_container = this.querySelectorAll(".color_container");
        color_container.forEach((color) => {
            color.addEventListener('click',() => {
                if(!color.classList.contains("color_active")){
                    color_container.forEach((c) => {
                        c.classList.remove("color_active")
                    })
                    color.classList.add("color_active");
                }
            })
        })
    }
    initScrollButtons() {
        const buttonPrevious = this.querySelector(".button_previous");
        const buttonNext = this.querySelector(".button_next");
        const productsContainer = this.querySelector(".products_container");

        // Function to update arrow visibility based on scroll position
        const updateArrowVisibility = () => {
            const isAtStart = productsContainer.scrollLeft === 0;
            const isAtEnd = productsContainer.scrollLeft + productsContainer.clientWidth === productsContainer.scrollWidth;

            buttonPrevious.style.opacity = isAtStart ? 0 : 1;
            buttonNext.style.opacity = isAtEnd ? 0 : 1;
        };

        // Event listener for scroll changes
        productsContainer.addEventListener("scroll", updateArrowVisibility);

        // Event listeners for arrow clicks
        buttonPrevious.addEventListener("click", () => {
            const scrollAmount = -productsContainer.offsetWidth;
            productsContainer.scrollTo({
                left: productsContainer.scrollLeft + scrollAmount,
                behavior: "smooth"
            });
        });

        buttonNext.addEventListener("click", () => {
            const scrollAmount = productsContainer.offsetWidth;
            productsContainer.scrollTo({
                left: productsContainer.scrollLeft + scrollAmount,
                behavior: "smooth"
            });
        });

        // Initial check for arrow visibility
        updateArrowVisibility();
    }
}
customElements.define('collection-list-filter', CollectionListFilter);