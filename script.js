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
    darkButton.setAttribute(
        "aria-label",
        "تغییر حالت تاریک"
    );

    document.body.appendChild(darkButton);


    function updateThemeButton() {

        if (
            document.body.classList.contains("dark-mode")
        ) {

            darkButton.innerHTML = "☀";
            darkButton.title = "حالت روشن";

        } else {

            darkButton.innerHTML = "☾";
            darkButton.title = "حالت تاریک";

        }

    }


    darkButton.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );


            const theme =
                document.body.classList.contains(
                    "dark-mode"
                )
                    ? "dark"
                    : "light";


            localStorage.setItem(
                "andisha-theme",
                theme
            );


            updateThemeButton();

        }
    );


    const savedTheme =
        localStorage.getItem(
            "andisha-theme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

    }


    updateThemeButton();



    // ========================================
    // ARTICLE CONTAINER
    // ========================================

    const articlesContainer =
        document.querySelector(".articles");


    if (!articlesContainer) {
        return;
    }



    // ========================================
    // SEARCH BOX
    // ========================================

    const searchBox =
        document.createElement("div");


    searchBox.className =
        "search-box";


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


    const header =
        document.querySelector("header");


    if (header) {

        header.appendChild(searchBox);

    }


    const searchInput =
        document.getElementById(
            "articleSearch"
        );


    const searchButton =
        document.getElementById(
            "searchButton"
        );



    // ========================================
    // SEARCH RESULT
    // ========================================

    const searchResult =
        document.createElement("div");


    searchResult.className =
        "search-result";


    articlesContainer.parentNode.insertBefore(
        searchResult,
        articlesContainer
    );



    // ========================================
    // CATEGORY SYSTEM
    // ========================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const selectedCategory =
        params.get("category");


    const categoryTitle =
        document.getElementById(
            "categoryTitle"
        );


    const categoryDescription =
        document.getElementById(
            "categoryDescription"
        );


    const categoryEmpty =
        document.getElementById(
            "categoryEmpty"
        );


    const showAllBox =
        document.getElementById(
            "showAllBox"
        );


    const categoryNames = {

        "philosophy":
            "فلسفه و اندیشه",

        "islam":
            "اسلام و ادیان",

        "social-science":
            "علوم اجتماعی",

        "psychology":
            "روان‌شناسی",

        "culture":
            "جامعه و فرهنگ",

        "history":
            "تاریخ و تمدن",

        "politics":
            "سیاست و حکومت",

        "economy":
            "اقتصاد و کسب‌وکار",

        "law":
            "حقوق و عدالت",

        "science":
            "علم و دانش",

        "health":
            "پزشکی و سلامت",

        "technology":
            "تکنولوژی و آینده",

        "education":
            "آموزش و دانشگاه",

        "literature":
            "ادبیات و شعر",

        "art":
            "هنر و سینما",

        "language":
            "زبان و زبان‌شناسی",

        "media":
            "رسانه و ارتباطات",

        "environment":
            "محیط‌زیست و طبیعت",

        "geography":
            "جغرافیا و جهان",

        "afghanistan":
            "افغانستان",

        "family":
            "زنان و خانواده",

        "ethics":
            "اخلاق و ارزش‌های انسانی",

        "review":
            "نقد و بررسی",

        "books":
            "کتاب و معرفی آثار",

        "opinions":
            "یادداشت و دیدگاه"

    };



    // ========================================
    // FILTER ARTICLES BY CATEGORY
    // ========================================

    function filterByCategory() {

        const articles =
            document.querySelectorAll(
                ".articles article"
            );


        let found = 0;


        articles.forEach(
            function (article) {

                const articleCategory =
                    article.dataset.category;


                if (
                    !selectedCategory ||
                    articleCategory ===
                    selectedCategory
                ) {

                    article.style.display =
                        "";

                    found++;

                } else {

                    article.style.display =
                        "none";

                }

            }
        );


        // ------------------------------
        // No category selected
        // ------------------------------

        if (!selectedCategory) {

            if (categoryTitle) {

                categoryTitle.textContent =
                    "تازه‌ترین مقاله‌ها";

            }


            if (categoryDescription) {

                categoryDescription.textContent =
                    "نوشته‌هایی درباره انسان، اندیشه، جامعه، فرهنگ و جهان.";

            }


            if (showAllBox) {

                showAllBox.style.display =
                    "none";

            }


            if (categoryEmpty) {

                categoryEmpty.style.display =
                    "none";

            }


            return;

        }



        // ------------------------------
        // Category exists
        // ------------------------------

        const readableName =
            categoryNames[
                selectedCategory
            ] || selectedCategory;


        if (categoryTitle) {

            categoryTitle.textContent =
                "موضوع: " + readableName;

        }


        if (categoryDescription) {

            categoryDescription.textContent =
                "مقاله‌های منتشرشده در بخش " +
                readableName +
                ".";

        }


        if (showAllBox) {

            showAllBox.style.display =
                "block";

        }


        if (found === 0) {

            if (categoryEmpty) {

                categoryEmpty.style.display =
                    "block";

            }

        } else {

            if (categoryEmpty) {

                categoryEmpty.style.display =
                    "none";

            }

        }

    }



    // اجرای فیلتر دسته‌بندی

    filterByCategory();



    // ========================================
    // ARTICLE SEARCH
    // ========================================

    function searchArticles() {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        const articles =
            document.querySelectorAll(
                ".articles article"
            );


        let found = 0;


        articles.forEach(
            function (article) {


                // اگر مقاله قبلاً توسط
                // دسته‌بندی مخفی شده باشد
                if (
                    selectedCategory &&
                    article.dataset.category !==
                    selectedCategory
                ) {

                    article.style.display =
                        "none";

                    return;

                }


                const text =
                    article.innerText
                        .toLowerCase();


                if (
                    query === "" ||
                    text.includes(query)
                ) {

                    article.style.display =
                        "";

                    found++;

                } else {

                    article.style.display =
                        "none";

                }

            }
        );



        // ====================================
        // SEARCH RESULT MESSAGE
        // ====================================

        if (query === "") {

            searchResult.innerHTML =
                "";

            return;

        }


        if (found === 0) {

            searchResult.innerHTML = `

                <div class="no-results">

                    <strong>
                        مقاله‌ای پیدا نشد.
                    </strong>

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



    // ========================================
    // SEARCH EVENTS
    // ========================================

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

                if (
                    event.key === "Enter"
                ) {

                    searchArticles();

                }

            }
        );

    }



    // ========================================
    // CATEGORY LINK SMOOTH SCROLL
    // ========================================

    if (selectedCategory) {

        setTimeout(
            function () {

                const articles =
                    document.getElementById(
                        "articles"
                    );


                if (articles) {

                    articles.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            },
            300
        );

    }

});