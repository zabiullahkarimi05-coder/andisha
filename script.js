/* =========================================================
   ANDISHA MAGAZINE
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. DARK MODE
       ===================================================== */

    const darkModeButtons = document.querySelectorAll(".dark-mode-btn");

    function applyTheme(theme) {
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }

        localStorage.setItem("andisha-theme", theme);
        updateDarkModeButtons(theme);
    }

    function updateDarkModeButtons(theme) {
        darkModeButtons.forEach(function (button) {
            button.setAttribute(
                "aria-label",
                theme === "dark" ? "فعال کردن حالت روشن" : "فعال کردن حالت تاریک"
            );

            button.textContent = theme === "dark" ? "☀" : "☾";
        });
    }

    const savedTheme = localStorage.getItem("andisha-theme");

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }

    darkModeButtons.forEach(function (button) {
        button.onclick = function (event) {
            event.preventDefault();

            const isDark = document.body.classList.contains("dark-mode");

            applyTheme(isDark ? "light" : "dark");
        };
    });


    /* =====================================================
       2. MOBILE MENU
       ===================================================== */

    const headerInner = document.querySelector(".header-inner");
    const mainNav = document.querySelector(".main-nav");

    if (headerInner && mainNav) {

        let mobileButton = document.querySelector(".mobile-menu-btn");

        if (!mobileButton) {

            mobileButton = document.createElement("button");

            mobileButton.className = "mobile-menu-btn";
            mobileButton.type = "button";
            mobileButton.setAttribute("aria-label", "باز کردن منو");
            mobileButton.setAttribute("aria-expanded", "false");

            mobileButton.innerHTML = "☰";

            headerInner.insertBefore(mobileButton, mainNav);

        }

        mobileButton.addEventListener("click", function () {

            const opened = mainNav.classList.toggle("mobile-open");

            mobileButton.setAttribute(
                "aria-expanded",
                opened ? "true" : "false"
            );

            mobileButton.innerHTML = opened ? "×" : "☰";

        });

        mainNav.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                if (window.innerWidth <= 900) {

                    mainNav.classList.remove("mobile-open");

                    mobileButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    mobileButton.innerHTML = "☰";

                }

            });

        });

    }


    /* =====================================================
       3. ARTICLE SEARCH
       ===================================================== */

    const articlesContainer = document.querySelector(".articles");

    if (articlesContainer) {

        const articleCards =
            Array.from(
                articlesContainer.querySelectorAll(".article-card")
            );

        if (articleCards.length > 0) {

            let searchBox =
                document.querySelector(".article-search");

            if (!searchBox) {

                searchBox = document.createElement("div");

                searchBox.className = "article-search";

                searchBox.innerHTML = `
                    <div class="search-wrapper">
                        <span class="search-icon">⌕</span>
                        <input
                            type="search"
                            id="articleSearchInput"
                            placeholder="جست‌وجو در مقالات..."
                            autocomplete="off"
                            aria-label="جست‌وجو در مقالات"
                        >
                        <button
                            type="button"
                            id="clearSearch"
                            class="clear-search"
                            aria-label="پاک کردن جست‌وجو"
                        >
                            ×
                        </button>
                    </div>
                    <div
                        id="searchResultInfo"
                        class="search-result-info"
                    ></div>
                `;

                articlesContainer.parentNode.insertBefore(
                    searchBox,
                    articlesContainer
                );
            }

            const searchInput =
                document.getElementById("articleSearchInput");

            const clearSearch =
                document.getElementById("clearSearch");

            const resultInfo =
                document.getElementById("searchResultInfo");

            function searchArticles() {

                if (!searchInput) return;

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();

                let visibleCount = 0;

                articleCards.forEach(function (card) {

                    const text =
                        card.textContent.toLowerCase();

                    const matches =
                        query === "" ||
                        text.includes(query);

                    card.style.display =
                        matches ? "" : "none";

                    if (matches) {
                        visibleCount++;
                    }

                });

                if (resultInfo) {

                    if (query === "") {

                        resultInfo.textContent = "";

                    } else {

                        resultInfo.textContent =
                            visibleCount +
                            " مقاله پیدا شد";

                    }

                }

                if (clearSearch) {

                    clearSearch.style.display =
                        query ? "block" : "none";

                }

            }

            if (searchInput) {

                searchInput.addEventListener(
                    "input",
                    searchArticles
                );

            }

            if (clearSearch) {

                clearSearch.addEventListener(
                    "click",
                    function () {

                        searchInput.value = "";

                        searchArticles();

                        searchInput.focus();

                    }
                );

            }

        }

    }


    /* =====================================================
       4. CATEGORY FILTER
       ===================================================== */

    const categoryCards =
        document.querySelectorAll(".article-card");

    const params =
        new URLSearchParams(window.location.search);

    const selectedCategory =
        params.get("category");

    if (
        selectedCategory &&
        categoryCards.length > 0
    ) {

        let visibleCount = 0;

        categoryCards.forEach(function (card) {

            const cardCategory =
                card.dataset.category;

            if (
                cardCategory === selectedCategory ||
                cardCategory === "all"
            ) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });

        const categoryNames = {

            "philosophy": "فلسفه و اندیشه",
            "islam": "اسلام و ادیان",
            "social-science": "علوم اجتماعی",
            "psychology": "روان‌شناسی",
            "culture": "جامعه و فرهنگ",
            "history": "تاریخ و تمدن",
            "politics": "سیاست و حکومت",
            "economy": "اقتصاد و کسب‌وکار",
            "law": "حقوق و عدالت",
            "science": "علم و دانش",
            "health": "پزشکی و سلامت",
            "technology": "تکنولوژی و آینده",
            "education": "آموزش و دانشگاه",
            "literature": "ادبیات و شعر",
            "art": "هنر و سینما",
            "language": "زبان و زبان‌شناسی",
            "media": "رسانه و ارتباطات",
            "environment": "محیط‌زیست و طبیعت",
            "geography": "جغرافیا و جهان",
            "afghanistan": "افغانستان",
            "family": "زنان و خانواده",
            "ethics": "اخلاق و ارزش‌های انسانی",
            "review": "نقد و بررسی",
            "books": "کتاب و معرفی آثار",
            "opinions": "یادداشت و دیدگاه"

        };

        const categoryTitle =
            categoryNames[selectedCategory];

        const sectionHeading =
            document.querySelector(".section-heading h2");

        if (
            sectionHeading &&
            categoryTitle
        ) {

            sectionHeading.textContent =
                "مقالات " + categoryTitle;

        }

        if (visibleCount === 0) {

            showEmptyCategoryMessage(
                categoryTitle || "این دسته"
            );

        }

    }


    /* =====================================================
       5. EMPTY CATEGORY MESSAGE
       ===================================================== */

    function showEmptyCategoryMessage(categoryName) {

        const articlesSection =
            document.querySelector(".articles");

        if (!articlesSection) return;

        const oldMessage =
            document.querySelector(".empty-category");

        if (oldMessage) {
            oldMessage.remove();
        }

        const message =
            document.createElement("div");

        message.className = "empty-category";

        message.innerHTML = `
            <div class="empty-category-icon">📖</div>
            <h3>هنوز مقاله‌ای در این دسته منتشر نشده است</h3>
            <p>
                در بخش «${categoryName}» به‌زودی
                مطالب تازه منتشر خواهد شد.
            </p>
            <a href="categories.html" class="btn btn-primary">
                مشاهده همه دسته‌ها
            </a>
        `;

        articlesSection.appendChild(message);

    }


    /* =====================================================
       6. SMOOTH SCROLL
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        this.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(targetId);

                    if (target) {

                        event.preventDefault();

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        }
    );


    /* =====================================================
       7. NEWSLETTER DEMO
       ===================================================== */

    const newsletterForm =
        document.querySelector(".newsletter-form");

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const emailInput =
                    newsletterForm.querySelector(
                        'input[type="email"]'
                    );

                if (!emailInput) return;

                const email =
                    emailInput.value.trim();

                if (!email) return;

                alert(
                    "عضویت شما با موفقیت ثبت شد.\n\n" +
                    "این بخش در نسخه آزمایشی سایت قرار دارد."
                );

                emailInput.value = "";

            }
        );

    }


    /* =====================================================
       8. CURRENT YEAR
       ===================================================== */

    document.querySelectorAll(".current-year").forEach(
        function (element) {

            element.textContent =
                new Date().getFullYear();

        }
    );


    /* =====================================================
       9. ARTICLE SHARE
       ===================================================== */

    const shareButtons =
        document.querySelectorAll("[data-share]");

    shareButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            async function () {

                const url =
                    window.location.href;

                const title =
                    document.title;

                if (
                    navigator.share
                ) {

                    try {

                        await navigator.share({
                            title: title,
                            url: url
                        });

                    } catch (error) {

                        // کاربر پنجره اشتراک را بسته است.

                    }

                } else {

                    try {

                        await navigator.clipboard.writeText(url);

                        alert(
                            "لینک مقاله کپی شد."
                        );

                    } catch (error) {

                        alert(
                            "کپی لینک انجام نشد."
                        );

                    }

                }

            }
        );

    });


    /* =====================================================
       10. COPY LINK
       ===================================================== */

    const copyButtons =
        document.querySelectorAll("[data-copy-link]");

    copyButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            async function () {

                try {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    const oldText =
                        button.textContent;

                    button.textContent =
                        "✓ لینک کپی شد";

                    setTimeout(function () {

                        button.textContent =
                            oldText;

                    }, 2000);

                } catch (error) {

                    alert(
                        "امکان کپی لینک وجود ندارد."
                    );

                }

            }
        );

    });


    /* =====================================================
       11. EXTERNAL LINKS
       ===================================================== */

    document.querySelectorAll(
        'a[target="_blank"]'
    ).forEach(function (link) {

        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );

    });

});