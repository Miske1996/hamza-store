if (!customElements.get('collection-list-filter')) {
    customElements.define(
        'collection-list-filter',
        class CollectionListFilter extends HTMLElement {
            constructor() {
                super();

                this.initScrollButtons();

                this.products = JSON.parse(this.querySelector('script[type="application/json"]').innerHTML);
                // Assuming this.products is an array of products with a 'tags' property
                // PRODUCT TAGS CODE  
                this.products.forEach(function (product) {
                    if (Array.isArray(product.tags) && product.tags.length > 0 && Array.isArray(product.tags) && product.tags.length < 3) {
                        // Assuming product.tags is an array with a single element
                        var tagsData = product.tags[0];

                        product.tags = tagsData
                            .filter(function (tag) {
                                return typeof tag === 'string' && tag.includes(',');
                            })
                            .map(function (tag) {
                                var tagParts = tag.split(',');
                                return {
                                    label: tagParts[0],
                                    color: tagParts[1]
                                };
                            });
                    }
                });

                
                // Specific collection type
                this.products.forEach(function (product) {
                    if (Array.isArray(product.type_tag) && product.type_tag.length > 0) {
                        // Assuming product.tags is an array with a single element
                        var tagsData = product.type_tag[0];

                        product.type_tag = tagsData
                            .filter(function (tag) {
                                return typeof tag === 'string' && tag.includes(',');
                            })
                            .map(function (tag) {
                                var tagParts = tag.split(',');
                                return {
                                    collection: tagParts[0],
                                    type: tagParts[1]
                                };
                            });
                    }
                });
                console.log(this.products)
                // Extract unique colors from products
                this.uniqueColorsFilter = [...new Set(this.products.map(product => product.color))];

                // Extract types from products
                this.uniqueTypesFilter = [...new Set(this.products.flatMap(product => {
                    if (product.type_tag && Array.isArray(product.type_tag)) {
                        const matchingTags = product.type_tag.filter(tag => tag.collection === product.collection);
                        matchingTags.map(tag => product.type = tag.type);
                        return matchingTags.map(tag => tag.type);
                    }
                    return [];
                }))];

                
                this.initColorFilter();
                this.initTypeFilter();

                this.colorFilter();
                this.typeCollectionTabs();

                this.chosen_type = ""
                this.chosen_color = ""
                //Colors global variant 
                // Group products by variant ID
                this.productsByVariant = {};
                this.products.forEach(product => {
                    let variantId = product.variant;
                
                    // If variantId is empty, set it to product title
                    if (!variantId) {
                        variantId = product.title;
                    }
                
                    if (!this.productsByVariant[variantId]) {
                        this.productsByVariant[variantId] = [];
                    }
                    this.productsByVariant[variantId].push(product);
                });
                this.initCardsProducts();

                //Code for CARD SIZE 
                // Add this code inside the constructor or initialization of your component
                this.sizeCardInit();
                window.addEventListener('resize', () => {
                    // Call the sizeCardInit method when the window is resized
                    this.sizeCardInit();
                });

            }
            sizeCardInit() {
                const productsContainer = this.querySelector('.products_container');
                const currentCardSize = productsContainer.classList.contains('compact') ? 'compact' : 'standard';

                // Check if the screen width is below 768px
                if (window.innerWidth <= 768 && window.innerWidth >= 430) {
                    // Reset styles or make adjustments as needed for smaller screens
                    productsContainer.style.height = '70vh'; // Reset height
                    productsContainer.style.gap = '3%'; // Reset gap

                    let products = productsContainer.querySelectorAll('.product_card');

                    products.forEach((product) => {
                        product.style.width = '40%'; // Reset width
                    });
                } else if (window.innerWidth < 430) {
                    // Reset styles or make adjustments as needed for smaller screens
                    productsContainer.style.height = '70vh'; // Reset height
                    productsContainer.style.gap = '3%'; // Reset gap

                    let products = productsContainer.querySelectorAll('.product_card');

                    products.forEach((product) => {
                        product.style.width = '100%'; // Reset width
                    });
                } else {
                    // Apply compact styles for larger screens
                    if (currentCardSize == 'compact') {
                        productsContainer.querySelectorAll(".product_images_container").forEach((c)=>{
                            c.style.height = 80 / 1.5 + 'vh';
                        })
                        productsContainer.style.gap = '2%';

                        let products = productsContainer.querySelectorAll('.product_card');

                        products.forEach((product) => {
                            product.style.width = '23%';
                        });
                    }
                }
            }

            initColorFilter() {
                const colorContainerWrapper = this.querySelector('.colors_picker_wrapper');

                // Create color containers dynamically
                this.uniqueColorsFilter.forEach(color => {
                    const colorContainer = document.createElement('div');
                    colorContainer.classList.add('color_container');
                    colorContainer.innerHTML = '<div class="color" style="background-color: ' + color + '"></div>';
                    colorContainerWrapper.appendChild(colorContainer);
                });
            }

            initTypeFilter() {
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
                        if (this.chosen_type == this.uniqueTypesFilter[key]) {
                            // Remove the type filter
                            this.chosen_type = "";
                            // Update borders for collection tabs
                            collection_tabs.forEach((c, index) => {
                                c.style.borderBottom = index === key ? '0px solid #152f4e' : 'none';
                            });
                        } else {
                            this.chosen_type = this.uniqueTypesFilter[key];
                            // Update borders for collection tabs
                            collection_tabs.forEach((c, index) => {
                                c.style.borderBottom = index === key ? '2px solid #152f4e' : 'none';
                            });
                        }

                        // Filter products based on chosen type and color
                        const filteredProducts = this.products.filter(product => {
                            return (this.chosen_color === "" || product.color === this.chosen_color) && (this.chosen_type === "" || product.type === this.chosen_type);
                        });

                        // Clear previous products
                        const productsContainer = this.querySelector('.products_container');
                        productsContainer.innerHTML = '';

                         // Group products by variant ID
                        const productsByVariant = {};
                        filteredProducts.forEach(product => {
                            let variantId = product.variant;
                        
                            // If variantId is empty, set it to product title
                            if (!variantId) {
                                variantId = product.title;
                            }
                        
                            if (!productsByVariant[variantId]) {
                                productsByVariant[variantId] = [];
                            }
                            productsByVariant[variantId].push(product);
                        });

                        // Create product cards dynamically for the filtered products
                        for (const variantId in productsByVariant) {
                            const variantProducts = productsByVariant[variantId];
                            variantProducts.forEach((product, index) => {
                                const productCard = document.createElement('div');
                                productCard.classList.add('product_card');
                                productCard.innerHTML = `
                                    <div class="product_images_container">
                                        <img src="${product.front_image}" alt="" class="top">
                                        <img src="${product.back_image}" alt="" class="bottom">
                                    </div>
                                    ${
                                        product.tags && product.tags.length > 0
                                            ? `<span class="product_badge">${product.tags.map((tag, index) => `<span style="color:${tag.color}; margin-left:${index === 0 ? '0' : '0.42vw'};">${tag.label}</span>`).join('')}</span>`
                                            : ''
                                    }
                                    <a class="product_title" href="${product.url}" style="text-decoration:none;">${product.title}</a>
                                    <div class="bottom_container">
                                        ${this.productsByVariant[variantId].map(product => `<a class="color_product" href="${product.url}" style="background-color: ${product.color}"></a>`).join('')}
                                        <span class="see_more">See more</span>
                                        <span class="price_product">${product.price}</span>
                                    </div>
                                `;
                                productsContainer.appendChild(productCard);
                            });

                    const currentCardSize = productsContainer.classList.contains('compact') ? 'compact' : 'standard';
                    // Apply compact styles for larger screens
                    if (currentCardSize == 'compact') {
                        productsContainer.querySelectorAll(".product_images_container").forEach((c)=>{
                            c.style.height = 80 / 1.5 + 'vh';
                        })
                        productsContainer.style.gap = '2%';

                        let products = productsContainer.querySelectorAll('.product_card');

                        products.forEach((product) => {
                            product.style.width = '23%';
                        });
                    }
                        }


                    });
                });
            }

            colorFilter() {
                let color_container = this.querySelectorAll(".color_container");
                color_container.forEach((color, key) => {
                    color.addEventListener('click', () => {
                        let title_section = this.querySelector(".title_section");
                        let buttonPrevious = this.querySelector(".button_previous");
                        let buttonNext = this.querySelector(".button_next");
                        if (this.chosen_color === this.uniqueColorsFilter[key]) {
                            // Remove the border first
                            color.style.border = '';

                            // Remove the color filter
                            this.chosen_color = "";
                            title_section.style.color = "black"; // Set back to default color or remove this line if not needed
                            buttonNext.style.backgroundColor = "black"; // Set back to default color or remove this line if not needed
                            buttonPrevious.style.backgroundColor = "black"; // Set back to default color or remove this line if not needed
                            // Update borders for color containers
                            color_container.forEach((c, index) => {
                                c.style.border = index === key ? `0px solid ${this.uniqueColorsFilter[key]}` : 'none';
                            });
                        } else {
                            // Apply the color filter
                            title_section.style.color = this.uniqueColorsFilter[key];
                            buttonNext.style.backgroundColor = this.uniqueColorsFilter[key];
                            buttonPrevious.style.backgroundColor = this.uniqueColorsFilter[key];
                            this.chosen_color = this.uniqueColorsFilter[key];
                            // Update borders for color containers
                            color_container.forEach((c, index) => {
                                c.style.border = index === key ? `1px solid ${this.uniqueColorsFilter[key]}` : 'none';
                            });
                        }


                        // Filter products based on chosen color and type
                        const filteredProducts = this.products.filter(product => {
                            const colorMatch = product.color === this.chosen_color || this.chosen_color === "";
                            const typeMatch = product.type === this.chosen_type || this.chosen_type === "";

                            return colorMatch && typeMatch;
                        });
                        // Clear previous products
                        const productsContainer = this.querySelector('.products_container');
                        productsContainer.innerHTML = '';

                        // Group filtered products by variant ID
                        const productsByVariant = {};
                        filteredProducts.forEach(product => {
                            let variantId = product.variant;
                
                            // If variantId is empty, set it to product title
                            if (!variantId) {
                                variantId = product.title;
                            }
                        
                            if (!productsByVariant[variantId]) {
                                productsByVariant[variantId] = [];
                            }
                            productsByVariant[variantId].push(product);
                        });

                        // Create product cards dynamically for the filtered products
                        for (const variantId in productsByVariant) {
                            const variantProducts = productsByVariant[variantId];
                            variantProducts.forEach((product, index) => {
                                const productCard = document.createElement('div');
                                productCard.classList.add('product_card');
                                productCard.innerHTML = `
                                    <div class="product_images_container">
                                        <img src="${product.front_image}" alt="" class="top">
                                        <img src="${product.back_image}" alt="" class="bottom">
                                    </div>
                                    ${
                                        product.tags && product.tags.length > 0
                                            ? `<span class="product_badge">${product.tags.map((tag, index) => `<span style="color:${tag.color}; margin-left:${index === 0 ? '0' : '0.42vw'};">${tag.label}</span>`).join('')}</span>`
                                            : ''
                                    }
                                    <a class="product_title" href="${product.url}" style="text-decoration:none;">${product.title}</a>
                                    <div class="bottom_container">
                                        ${this.productsByVariant[variantId].map(product => `<a class="color_product" href="${product.url}" style="background-color: ${product.color}"></a>`).join('')}
                                        <span class="see_more">See more</span>
                                        <span class="price_product">${product.price}</span>
                                    </div>
                                `;
                                productsContainer.appendChild(productCard);
                            });

                    const currentCardSize = productsContainer.classList.contains('compact') ? 'compact' : 'standard';
                    // Apply compact styles for larger screens
                    if (currentCardSize == 'compact') {
                        productsContainer.querySelectorAll(".product_images_container").forEach((c)=>{
                            c.style.height = 80 / 1.5 + 'vh';
                        })
                        productsContainer.style.gap = '2%';

                        let products = productsContainer.querySelectorAll('.product_card');

                        products.forEach((product) => {
                            product.style.width = '23%';
                        });
                    }
                        }


                    });
                });
            }

            initCardsProducts() {
                const productsContainer = this.querySelector('.products_container');

                // Group products by variant ID
                const productsByVariant = {};
                this.products.forEach(product => {
                    let variantId = product.variant;
                
                    // If variantId is empty, set it to product title
                    if (!variantId) {
                        variantId = product.title;
                    }
                
                    if (!productsByVariant[variantId]) {
                        productsByVariant[variantId] = [];
                    }
                    productsByVariant[variantId].push(product);
                });

               
                // Create product cards dynamically
                for (const variantId in productsByVariant) {
                    const variantProducts = productsByVariant[variantId];
                    variantProducts.forEach((product, index) => {
                        console.log(index)
                        const productCard = document.createElement('div');
                        productCard.classList.add('product_card');
                        productCard.innerHTML = `
                            <div class="product_images_container">
                                <img src="${product.front_image}" alt="" class="top">
                                <img src="${product.back_image}" alt="" class="bottom">
                            </div>
                            ${
                                product.tags && product.tags.length > 0
                                    ? `<span class="product_badge">${product.tags.map((tag, index) => `<span style="color:${tag.color}; margin-left:${index === 0 ? '0' : '0.42vw'};">${tag.label}</span>`).join('')}</span>`
                                    : ''
                            }
                            <a class="product_title" href="${product.url}" style="text-decoration:none;">${product.title}</a>
                            <div class="bottom_container">
                            ${this.productsByVariant[variantId].map(colorProduct => `<a class="color_product" href="${colorProduct.url}" style="background-color: ${colorProduct.color}"></a>`).join('')}
                                <span class="see_more">See more</span>
                                <span class="price_product">${product.price}</span>
                            </div>
                        `;
                        productsContainer.appendChild(productCard);
                    });
                }
            }

            initScrollButtons() {
                const buttonPrevious = this.querySelector(".button_previous");
                const buttonNext = this.querySelector(".button_next");
                const productsContainer = this.querySelector(".products_container");


                // Function to update arrow visibility based on scroll position
                const updateArrowVisibility = () => {
                    const isAtStart = productsContainer.scrollLeft === 0;
                    const isAtEnd = productsContainer.scrollLeft + productsContainer.clientWidth >= productsContainer.scrollWidth;

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
                document.addEventListener("DOMContentLoaded", function () {
                    if (productsContainer.scrollWidth > productsContainer.clientWidth) {
                        buttonNext.style.opacity = 1;
                    }
                });

            }
        }
    )
}