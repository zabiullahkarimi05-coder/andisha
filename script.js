// ==========================================
// ANDISHA - Main JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // --------------------------------------
    // DARK MODE
    // --------------------------------------

    const savedTheme = localStorage.getItem("andisha-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    const darkButtons = document.querySelectorAll(".dark-mode-btn");

    darkButtons.forEach(function (button) {
        button.addEventListener("click", toggleDarkMode);
    });


    // --------------------------------------
    // MOBILE MENU
    // --------------------------------------

    const nav = document.querySelector(".main-nav");

    if (nav && !document.querySelector(".mobile-menu-btn")) {

        const menuButton = document.createElement("button");

        menuButton.className = "mobile-menu-btn";
        menuButton.innerHTML = "☰";
        menuButton.setAttribute("aria-label", "باز کردن منو");

        const navWrap = document.querySelector(".nav-wrap");

        if (navWrap) {
            navWrap.appendChild(menuButton);

            menuButton.addEventListener("click", function () {
                nav.classList.toggle("mobile-open");

                if (nav.classList.contains("mobile-open")) {
                    menuButton.innerHTML = "✕";
                } else {
                    menuButton.innerHTML = "☰";
                }
            });
        }
    }


    // --------------------------------------
    // SEARCH
    // --------------------------------------

    const articles = document.querySelectorAll(".article-card");

    if (articles.length > 0) {

        const searchContainer = document.createElement("div");

        searchContainer.className = "professional-search";

        searchContainer.innerHTML = `
            <div class="search-inner">
                <span class="search-icon">⌕</span>
                <input
                    type="search"
                    id="articleSearch"
                    placeholder="جستجو در مقالات اندیشه..."
                    aria-label="جستجو در مقالات"
                >
                <button id="clearSearch" type="button">×</button>
            </div>
            <div id="searchResultText" class="search-result-text"></div>
        `;

        const articlesSection = document.querySelector(".articles");

        if (articlesSection) {
            articlesSection.parentNode.insertBefore(
                searchContainer,
                articlesSection
            );
        }

        const searchInput = document.getElementById("articleSearch");
        const clearButton = document.getElementById("clearSearch");
        const resultText = document.getElementById("searchResultText");

        if (searchInput) {

            searchInput.addEventListener("input", function () {

                const query = searchInput.value.trim().toLowerCase();

                let visibleCount = 0;

                articles.forEach(function (article) {

                    const text = article.textContent.toLowerCase();

                    if (query === "" || text.includes(query)) {

                        article.style.display = "";

                        visibleCount++;

                    } else {

                        article.style.display = "none";

                    }

                });

                if (query === "") {
                    resultText.textContent = "";
                } else {
                    resultText.textContent =
                        visibleCount + " نتیجه پیدا شد";
                }
            });
        }

        if (clearButton) {

            clearButton.addEventListener("click", function () {

                searchInput.value = "";

                articles.forEach(function (article) {
                    article.style.display = "";
                });

                resultText.textContent = "";

                searchInput.focus();
            });
        }
    }


    // --------------------------------------
    // SMOOTH SCROLL
    // --------------------------------------

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    // --------------------------------------
    // NEWSLETTER
    // --------------------------------------

    const newsletterForm =
        document.querySelector(".newsletter-form");

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const emailInput =
                newsletterForm.querySelector("input[type='email']");

            if (!emailInput || !emailInput.value) {
                return;
            }

            alert(
                "عضویت شما با موفقیت ثبت شد. به‌زودی خبرهای اندیشه را دریافت خواهید کرد."
            );

            emailInput.value = "";
        });
    }


    // --------------------------------------
    // CURRENT YEAR
    // --------------------------------------

    document.querySelectorAll(".copyright").forEach(function (element) {

        const year = new Date().getFullYear();

        element.innerHTML =
            element.innerHTML.replace(/\d{4}/, year);
    });

});


// ==========================================
// DARK MODE FUNCTION
// ==========================================

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "andisha-theme",
        isDark ? "dark" : "light"
    );
}


// ==========================================
// ARTICLE SHARE
// ==========================================

function copyArticleLink() {

    navigator.clipboard.writeText(window.location.href)
        .then(function () {

            alert("لینک مقاله کپی شد.");

        })
        .catch(function () {

            alert("کپی لینک انجام نشد.");

        });
}


function shareArticle() {

    if (navigator.share) {

        navigator.share({
            title: document.title,
            url: window.location.href
        });

    } else {

        copyArticleLink();

    }
}