document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       DARK MODE
    ========================== */

    const darkToggle = document.getElementById("darkModeToggle");

    if (darkToggle) {
        const savedTheme = localStorage.getItem("andisha-theme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
            darkToggle.textContent = "☀️";
        }

        darkToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            const isDark = document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "andisha-theme",
                isDark ? "dark" : "light"
            );

            darkToggle.textContent = isDark ? "☀️" : "🌙";
        });
    }


    /* =========================
       MOBILE MENU
    ========================== */

    const menuButton = document.querySelector(".mobile-menu");
    const nav = document.querySelector(".main-nav");

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            nav.classList.toggle("mobile-open");
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("mobile-open");
            });
        });
    }


    /* =========================
       ARTICLE SEARCH
    ========================== */

    const searchInput =
        document.getElementById("articleSearchInput") ||
        document.getElementById("searchInput");

    const clearSearch =
        document.getElementById("clearArticleSearch");

    const searchInfo =
        document.getElementById("articleSearchInfo");

    const emptyState =
        document.getElementById("articleEmptyState");

    const articleCards =
        Array.from(document.querySelectorAll(".article-card"));

    function normalizeText(text) {
        return text
            .toLowerCase()
            .replace(/ي/g, "ی")
            .replace(/ك/g, "ک")
            .replace(/\s+/g, " ")
            .trim();
    }

    function updateSearch() {

        if (!articleCards.length) return;

        const query = searchInput
            ? normalizeText(searchInput.value)
            : "";

        let visibleCount = 0;

        articleCards.forEach(card => {

            const text = normalizeText(card.innerText);

            const matches =
                !query ||
                text.includes(query);

            const category =
                card.dataset.category || "";

            const selectedCategory =
                new URLSearchParams(window.location.search)
                    .get("category");

            const categoryMatches =
                !selectedCategory ||
                selectedCategory === "all" ||
                category === selectedCategory;

            if (matches && categoryMatches) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (searchInfo) {

            if (query) {
                searchInfo.textContent =
                    `نتیجه جستجو: ${visibleCount} مقاله`;
            } else {
                searchInfo.textContent =
                    `تعداد مقالات: ${visibleCount}`;
            }
        }

        if (emptyState) {
            emptyState.style.display =
                visibleCount === 0 ? "block" : "none";
        }

        if (clearSearch) {
            clearSearch.style.display =
                query ? "inline-flex" : "none";
        }
    }


    if (searchInput) {
        searchInput.addEventListener(
            "input",
            updateSearch
        );
    }


    if (clearSearch) {
        clearSearch.addEventListener("click", () => {

            if (searchInput) {
                searchInput.value = "";
                searchInput.focus();
            }

            updateSearch();
        });
    }


    /* =========================
       CATEGORY FILTERS
    ========================== */

    const filterButtons =
        document.querySelectorAll(".article-filter");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const category =
                button.dataset.category;

            const url =
                new URL(window.location.href);

            if (!category || category === "all") {
                url.searchParams.delete("category");
            } else {
                url.searchParams.set(
                    "category",
                    category
                );
            }

            window.history.pushState(
                {},
                "",
                url
            );

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            updateSearch();
        });
    });


    /* =========================
       SELECT CORRECT CATEGORY
    ========================== */

    const currentCategory =
        new URLSearchParams(window.location.search)
            .get("category");

    if (filterButtons.length) {

        filterButtons.forEach(button => {

            if (
                currentCategory &&
                button.dataset.category === currentCategory
            ) {
                button.classList.add("active");
            }

            if (
                !currentCategory &&
                button.dataset.category === "all"
            ) {
                button.classList.add("active");
            }
        });
    }


    updateSearch();


    /* =========================
       SMOOTH SCROLL
    ========================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (targetId === "#") return;

            const target =
                document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    /* =========================
       ARTICLE SHARE
    ========================== */

    const shareButtons =
        document.querySelectorAll(".share-btn");

    shareButtons.forEach(button => {

        button.addEventListener("click", async () => {

            const shareData = {
                title: document.title,
                text: "این مقاله را در مجله اندیشه بخوانید.",
                url: window.location.href
            };

            try {

                if (navigator.share) {

                    await navigator.share(
                        shareData
                    );

                } else {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    alert(
                        "لینک مقاله کپی شد."
                    );
                }

            } catch (error) {
                console.log(
                    "اشتراک‌گذاری لغو شد."
                );
            }
        });
    });


    /* =========================
       COPY LINK
    ========================== */

    const copyButtons =
        document.querySelectorAll(".copy-link");

    copyButtons.forEach(button => {

        button.addEventListener("click", async () => {

            try {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                const oldText =
                    button.textContent;

                button.textContent =
                    "✓ لینک کپی شد";

                setTimeout(() => {
                    button.textContent =
                        oldText;
                }, 2000);

            } catch (error) {

                alert(
                    "کپی لینک انجام نشد."
                );
            }
        });
    });


    /* =========================
       CURRENT YEAR
    ========================== */

    document.querySelectorAll(
        "[data-current-year]"
    ).forEach(element => {
        element.textContent =
            new Date().getFullYear();
    });


    /* =========================
       EXTERNAL LINKS SECURITY
    ========================== */

    document.querySelectorAll(
        'a[target="_blank"]'
    ).forEach(link => {

        const rel =
            link.getAttribute("rel") || "";

        if (!rel.includes("noopener")) {
            link.setAttribute(
                "rel",
                `${rel} noopener noreferrer`.trim()
            );
        }
    });

});