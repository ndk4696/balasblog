document.addEventListener("DOMContentLoaded", () => {
    // Select all essential elements
    const articlesListContainer = document.getElementById("articles-list");
    const filterButtons = document.querySelectorAll(".filter-btn");
    
    // Store data globally so we can filter it later
    let allArticlesData = [];

    console.log("Script loaded. Found buttons:", filterButtons.length);

    // --- STEP 1: SETUP BUTTONS IMMEDIATELY ---
    // We do this first so buttons are always clickable
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            console.log("Button Clicked:", button.getAttribute("data-filter"));

            // 1. Visual Update: Highlight the active button
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // 2. Filter Logic
            const category = button.getAttribute("data-filter");
            
            // Safety check: Do we have data yet?
            if (allArticlesData.length === 0) {
                console.warn("Data not loaded yet, cannot filter.");
                return;
            }

            let filteredData;
            if (category === "all") {
                filteredData = allArticlesData;
            } else {
                // Filter by Genre (Case insensitive)
                filteredData = allArticlesData.filter(article => 
                    article.genre && article.genre.toLowerCase() === category.toLowerCase()
                );
            }

            // 3. Re-draw the screen
            renderArticles(filteredData);
        });
    });

    // --- STEP 2: FETCH DATA ---
    fetch("./posts.json")
      .then((response) => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then((data) => {
        console.log("Data loaded successfully:", data.length, "articles");
        
        // Save data to our global variable
        // Sort Newest First
        allArticlesData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Render everything initially
        renderArticles(allArticlesData);
      })
      .catch((error) => {
          console.error("Error loading articles:", error);
          articlesListContainer.innerHTML = "<p style='color:red; text-align:center;'>Error loading articles. Please check the console (F12).</p>";
      });

    // --- STEP 3: RENDER FUNCTION (Draws the Grid) ---
    function renderArticles(articles) {
        articlesListContainer.innerHTML = ""; // Clear current screen

        if (articles.length === 0) {
            articlesListContainer.innerHTML = "<p style='color:#ccc; text-align:center; margin-top:3rem; font-size:1.2rem;'>No articles found for this category.</p>";
            return;
        }

        // Group by Year -> Month
        const groups = {};
        articles.forEach(article => {
            const dateObj = new Date(article.date);
            const year = dateObj.getFullYear();
            const month = dateObj.toLocaleString('default', { month: 'long' });

            if (!groups[year]) groups[year] = {};
            if (!groups[year][month]) groups[year][month] = [];
            groups[year][month].push(article);
        });

        const sortedYears = Object.keys(groups).sort((a, b) => b - a);

        sortedYears.forEach(year => {
            const yearGroup = document.createElement("div");
            yearGroup.className = "year-group";

            const yearBtn = document.createElement("button");
            yearBtn.className = "year-toggle";
            yearBtn.innerHTML = `<span class="year-text">${year}</span><span class="year-icon">–</span>`;

            const monthsContainer = document.createElement("div");
            monthsContainer.className = "months-container";
            monthsContainer.style.display = "block"; 

            yearBtn.addEventListener("click", () => {
                const isOpen = monthsContainer.style.display === "block";
                monthsContainer.style.display = isOpen ? "none" : "block";
                yearBtn.querySelector(".year-icon").textContent = isOpen ? "+" : "–";
            });

            // Sort Months Chronologically
            const monthNames = ["December", "November", "October", "September", "August", "July", "June", "May", "April", "March", "February", "January"];
            const sortedMonths = Object.keys(groups[year]).sort((a, b) => {
                return monthNames.indexOf(a) - monthNames.indexOf(b);
            });

            sortedMonths.forEach(month => {
                const monthGroup = document.createElement("div");
                monthGroup.className = "month-group";

                const monthBtn = document.createElement("button");
                monthBtn.className = "month-toggle";
                monthBtn.innerHTML = `<span class="month-text">${month}</span><span class="month-icon">–</span>`;

                const grid = document.createElement("div");
                grid.className = "articles-grid";
                grid.style.display = "grid"; 

                monthBtn.addEventListener("click", () => {
                    const isOpen = grid.style.display === "grid";
                    grid.style.display = isOpen ? "none" : "grid";
                    monthBtn.querySelector(".month-icon").textContent = isOpen ? "+" : "–";
                });

                groups[year][month].forEach(post => {
                    const card = document.createElement("a");
                    card.className = "article-row"; 
                    card.href = post.contentUrl;
                    
                    card.innerHTML = `
                        <img src="${post.image}" alt="${post.title}" class="article-thumb" onerror="this.src='/image/webicon.png'">
                        <div class="article-info">
                            <h3 class="article-title">${post.title}</h3>
                            <p class="article-excerpt">${post.excerpt}</p>
                        </div>
                    `;
                    grid.appendChild(card);
                });

                monthGroup.appendChild(monthBtn);
                monthGroup.appendChild(grid);
                monthsContainer.appendChild(monthGroup);
            });

            yearGroup.appendChild(yearBtn);
            yearGroup.appendChild(monthsContainer);
            articlesListContainer.appendChild(yearGroup);
        });
    }
});

/* =========================================
   SMART SEARCH / FILTERING ENGINE
   ========================================= */
const searchInput = document.querySelector('.articles-search');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Select all the containers we need to control
        const yearGroups = document.querySelectorAll('.year-group');

        // ----------------------------------------------------
        // SCENARIO 1: SEARCH CLEARED (Reset to default)
        // ----------------------------------------------------
        if (searchTerm === "") {
            yearGroups.forEach(year => {
                year.style.display = ""; // Reset visibility
                year.classList.remove('open'); // Collapse years
                
                const months = year.querySelectorAll('.month-group');
                months.forEach(month => {
                    month.style.display = ""; // Reset visibility
                    month.classList.remove('open'); // Collapse months
                    
                    const articles = month.querySelectorAll('.article-row');
                    articles.forEach(art => art.style.display = ""); // Show all articles
                });
            });
            return;
        }

        // ----------------------------------------------------
        // SCENARIO 2: SEARCHING (Filter Logic)
        // ----------------------------------------------------
        yearGroups.forEach(yearGroup => {
            let yearHasMatch = false;
            const monthGroups = yearGroup.querySelectorAll('.month-group');

            monthGroups.forEach(monthGroup => {
                let monthHasMatch = false;
                const articles = monthGroup.querySelectorAll('.article-row');

                articles.forEach(article => {
                    // Check Title (and optionally Genre/Meta)
                    const title = article.querySelector('.article-title').textContent.toLowerCase();
                    const isMatch = title.includes(searchTerm);

                    if (isMatch) {
                        article.style.display = "flex"; // SHOW Article
                        monthHasMatch = true;
                    } else {
                        article.style.display = "none"; // HIDE Article
                    }
                });

                // VISIBILITY LOGIC FOR MONTHS
                if (monthHasMatch) {
                    monthGroup.style.display = "block"; // Show this month
                    monthGroup.classList.add('open');   // Auto-expand it
                    yearHasMatch = true;
                } else {
                    monthGroup.style.display = "none";  // Hide empty month
                }
            });

            // VISIBILITY LOGIC FOR YEARS
            if (yearHasMatch) {
                yearGroup.style.display = "block"; // Show this year
                yearGroup.classList.add('open');   // Auto-expand it
            } else {
                yearGroup.style.display = "none";  // Hide empty year
            }
        });
    });
}