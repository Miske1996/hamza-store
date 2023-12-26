if (!customElements.get('collection-list-filter')) {
    customElements.define(
      'collection-list-filter',
class CollectionListFilter extends HTMLElement {
    constructor() {
      super();
      
      this.initScrollButtons();

      this.products =   JSON.parse(this.querySelector('script[type="application/json"]').innerHTML);
      // Extract unique colors from products
      this.uniqueColorsFilter = [...new Set(this.products.map(product => product.color))];

      // Extract types from products
      this.uniqueTypesFilter = [...new Set(this.products.map(product => product.type))];
      console.log(this.products)
      this.initColorFilter();
      this.initTypeFilter();

      this.colorFilter();
      this.typeCollectionTabs();

      this.chosen_type = ""
      this.chosen_color = ""

      this.initCardsProducts();

    }

    initColorFilter(){
        const colorContainerWrapper = this.querySelector('.colors_picker_wrapper');
 
        // Create color containers dynamically
        this.uniqueColorsFilter.forEach(color => {
          const colorContainer = document.createElement('div');
          colorContainer.classList.add('color_container');
          colorContainer.innerHTML = '<div class="color" style="background-color: ' + color + '"></div>';
          colorContainerWrapper.appendChild(colorContainer);
        });
    }

    initTypeFilter(){
        const collection_tabs_container = this.querySelector('.collection_tabs_container');
 
        // Create color containers dynamically
        this.uniqueTypesFilter.forEach(t => {
          const type = document.createElement('div');
          type.classList.add('collection_tab');
          type.innerHTML = t;
          collection_tabs_container.appendChild(type);
        });
    }

    typeCollectionTabs() {
    let collection_tabs = this.querySelectorAll(".collection_tab");
    collection_tabs.forEach((collection_tab, key) => {
        collection_tab.addEventListener('click', () => {
            this.chosen_type = this.uniqueTypesFilter[key];

            // Filter products based on chosen type and color
            const filteredProducts = this.products.filter(product => {
                return (this.chosen_color === "" || product.color === this.chosen_color) && (this.chosen_type === "" || product.type === this.chosen_type);
            });

            // Clear previous products
            const productsContainer = this.querySelector('.products_container');
            productsContainer.innerHTML = '';

            // Group filtered products by variant ID
            const productsByVariant = {};
            filteredProducts.forEach(product => {
                const variantId = product.variant;
                if (!productsByVariant[variantId]) {
                    productsByVariant[variantId] = [];
                }
                productsByVariant[variantId].push(product);
            });

            // Create product cards dynamically for the filtered products
            for (const variantId in productsByVariant) {
                const variantProducts = productsByVariant[variantId];
                const productCard = document.createElement('div');
                productCard.classList.add('product_card');
                productCard.innerHTML = `
                    <div class="product_images_container">
                        <img src="${variantProducts[0].front_image}"  alt="" class="top">
                        <img src="${variantProducts[0].back_image}" alt="" class="bottom">
                    </div>
                    <span class="product_badge">BEST SELLER</span>
                    <a class="product_title">${variantProducts[0].title}</a>
                    <div class="bottom_container">
                        ${variantProducts.map(product => `<a class="color_product" href="${product.url}" style="background-color: ${product.color}"></a>`).join('')}
                        <span class="see_more">See more</span>
                        <span class="price_product">${variantProducts[0].price}</span>
                    </div>
                `;
                productsContainer.appendChild(productCard);
            }

            // Update borders for collection tabs
            collection_tabs.forEach((c, index) => {
                c.style.borderBottom = index === key ? '2px solid #152f4e' : 'none';
            });
        });
    });
    }

    colorFilter() {
    let color_container = this.querySelectorAll(".color_container");
    color_container.forEach((color, key) => {
        color.addEventListener('click', () => {
            let title_section = this.querySelector(".title_section");
            title_section.style.color = this.uniqueColorsFilter[key];
            this.chosen_color = this.uniqueColorsFilter[key];

            // Filter products based on chosen color and type
            const filteredProducts = this.products.filter(product => {
                return product.color === this.chosen_color && (this.chosen_type === "" || product.type === this.chosen_type);
            });

            // Clear previous products
            const productsContainer = this.querySelector('.products_container');
            productsContainer.innerHTML = '';

            // Group filtered products by variant ID
            const productsByVariant = {};
            filteredProducts.forEach(product => {
                const variantId = product.variant;
                if (!productsByVariant[variantId]) {
                    productsByVariant[variantId] = [];
                }
                productsByVariant[variantId].push(product);
            });

            // Create product cards dynamically for the filtered products
            for (const variantId in productsByVariant) {
                const variantProducts = productsByVariant[variantId];
                const productCard = document.createElement('div');
                productCard.classList.add('product_card');
                productCard.innerHTML = `
                    <div class="product_images_container">
                        <img src="${variantProducts[0].front_image}"  alt="" class="top">
                        <img src="${variantProducts[0].back_image}" alt="" class="bottom">
                    </div>
                    <span class="product_badge">BEST SELLER</span>
                    <a class="product_title">${variantProducts[0].title}</a>
                    <div class="bottom_container">
                        ${variantProducts.map(product => `<a class="color_product" href="${product.url}" style="background-color: ${product.color}"></a>`).join('')}
                        <span class="see_more">See more</span>
                        <span class="price_product">${variantProducts[0].price}</span>
                    </div>
                `;
                productsContainer.appendChild(productCard);
            }

            // Update borders for color containers
            color_container.forEach((c, index) => {
                c.style.border = index === key ? `1px solid ${this.uniqueColorsFilter[key]}` : 'none';
            });
        });
    });
    }



    initCardsProducts(){
        const productsContainer = this.querySelector('.products_container');

        // Group products by variant ID
        const productsByVariant = {};
        this.products.forEach(product => {
            const variantId = product.variant;
            if (!productsByVariant[variantId]) {
                productsByVariant[variantId] = [];
            }
            productsByVariant[variantId].push(product);
        });
    
        // Create product cards dynamically
        for (const variantId in productsByVariant) {
            const variantProducts = productsByVariant[variantId];
            const productCard = document.createElement('div');
            productCard.classList.add('product_card');
            productCard.innerHTML = `
                <div class="product_images_container">
                    <img src="${variantProducts[0].front_image}"  alt="" class="top">
                    <img src="${variantProducts[0].back_image}" alt="" class="bottom">
                </div>
                <span class="product_badge">BEST SELLER</span>
                <a class="product_title">${variantProducts[0].title}</a>
                <div class="bottom_container">
                    ${variantProducts.map(product => `<a class="color_product" href="${product.url}" style="background-color: ${product.color}"></a>`).join('')}
                    <span class="see_more">See more</span>
                    <span class="price_product">${variantProducts[0].price}</span>
                </div>
            `;
            productsContainer.appendChild(productCard);
        }
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
)}