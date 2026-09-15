// ========================================
// ANDISHA WEBSITE JAVASCRIPT
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // DARK MODE
    // ========================================

    const darkButton = document.createElement("button");

    darkButton.id = "darkModeButton";
    darkButton.innerHTML = "☾";
    darkButton.title = "حالت تاریک";
    darkButton.setAttribute("aria-label", "تغییر حالت تاریک");

    document.body.appendChild(darkButton);


    function updateThemeButton() {

        if (document.body.classList.contains("dark-mode")) {
            darkButton.innerHTML = "☀";
            darkButton.title = "حالت روشن";
        } else {
            darkButton.innerHTML = "☾";
            darkButton.title = "حالت تاریک";
        }

    }


    darkButton.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        const theme =
            document.body.classList.contains("dark-mode")
                ? "dark"
                : "light";

        localStorage.setItem("andisha-theme", theme);

        updateThemeButton();

    });


    const savedTheme = localStorage.getItem("andisha-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeButton();


    // ========================================
    // PROFESSIONAL ARTICLE SEARCH
    // ========================================

    const articlesContainer =
        document.querySelector(".articles");

    if (!articlesContainer) {
        return;
    }


    const searchBox = document.createElement("div");

    searchBox.className = "search-box";

    searchBox.innerHTML = `
        <input
            type="search"
            id="articleSearch"
            placeholder="جست‌وجوی مقاله، موضوع یا کلمه..."
            autocomplete="off"
            aria-label="جست‌وجوی مقاله"
        >

        <button
            id="searchButton"
            type="button"
            aria-label="جست‌وجو"
        >
            🔎
        </button>
    `;


    const header = document.querySelector("header");

    if (header) {
        header.appendChild(searchBox);
    }


    const searchInput =
        document.getElementById("articleSearch");

    const searchButton =
        document.getElementById("searchButton");


    // نتیجه جست‌وجو
    const searchResult =
        document.createElement("div");

    searchResult.className = "search-result";

    articlesContainer.parentNode.insertBefore(
        searchResult,
        articlesContainer
    );


    function searchArticles() {

        const query =
            searchInput.value.trim().toLowerCase();

        const articles =
            document.querySelectorAll(
                ".articles article"
            );


        let found = 0;


        articles.forEach(function (article) {

            const text =
                article.innerText.toLowerCase();

            if (
                query === "" ||
                text.includes(query)
            ) {

                article.style.display = "";

                found++;

            } else {

                article.style.display = "none";

            }

        });


        // نمایش نتیجه
        if (query === "") {

            searchResult.innerHTML = "";

        } else if (found === 0) {

            searchResult.innerHTML = `
                <div class="no-results">
                    <strong>مقاله‌ای پیدا نشد.</strong>
                    <p>
                        کلمه دیگری را جست‌وجو کنید.
                    </p>
                </div>
            `;

        } else {

            searchResult.innerHTML = `
                <div class="results-count">
                    ${found} مقاله پیدا شد
                </div>
            `;

        }

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchArticles
        );

    }


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchArticles
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    searchArticles();

                }

            }
        );

    }

});