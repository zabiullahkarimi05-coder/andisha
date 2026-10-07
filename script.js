/* =========================================================
   ANDISHA — GLOBAL UI + MEMBERSHIP ENGINE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       THEME
       ===================================================== */

    const themeButtons = document.querySelectorAll(
        "#darkModeToggle, #darkModeBtn, .premium-theme, .article-theme-btn"
    );

    function syncThemeButtons() {

        const isDark =
            document.body.classList.contains("dark-mode");

        themeButtons.forEach(function (button) {

            button.textContent =
                isDark ? "☀" : "◐";

            button.setAttribute(
                "aria-label",
                isDark
                    ? "فعال کردن حالت روشن"
                    : "فعال کردن حالت تاریک"
            );

            button.setAttribute(
                "aria-pressed",
                String(isDark)
            );
        });
    }

    function setTheme(theme) {

        const isDark =
            theme === "dark";

        document.body.classList.toggle(
            "dark-mode",
            isDark
        );

        localStorage.setItem(
            "andisha-theme",
            isDark ? "dark" : "light"
        );

        syncThemeButtons();
    }

    const savedTheme =
        localStorage.getItem("andisha-theme");

    if (savedTheme === "dark") {

        setTheme("dark");

    } else if (savedTheme === "light") {

        setTheme("light");

    } else if (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
    ) {

        setTheme("dark");

    } else {

        setTheme("light");
    }

    themeButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const isDark =
                    document.body.classList.contains(
                        "dark-mode"
                    );

                setTheme(
                    isDark
                        ? "light"
                        : "dark"
                );
            }
        );
    });

    window.toggleDarkMode = function () {

        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );

        setTheme(
            isDark
                ? "light"
                : "dark"
        );
    };


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const mobileButton =
        document.querySelector(".premium-mobile");

    const mainNav =
        document.querySelector(".premium-nav") ||
        document.querySelector(".main-nav");

    function closeMobileMenu() {

        if (!mainNav) return;

        mainNav.classList.remove(
            "mobile-open"
        );

        document.body.classList.remove(
            "menu-open"
        );

        if (mobileButton) {

            mobileButton.classList.remove(
                "is-open"
            );

            mobileButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }

    function openMobileMenu() {

        if (!mainNav) return;

        mainNav.classList.add(
            "mobile-open"
        );

        document.body.classList.add(
            "menu-open"
        );

        if (mobileButton) {

            mobileButton.classList.add(
                "is-open"
            );

            mobileButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    }

    window.toggleMobileMenu = function () {

        if (!mainNav) return;

        if (
            mainNav.classList.contains(
                "mobile-open"
            )
        ) {

            closeMobileMenu();

        } else {

            openMobileMenu();
        }
    };

    if (mobileButton) {

        mobileButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                window.toggleMobileMenu();
            }
        );
    }

    if (mainNav) {

        mainNav
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    closeMobileMenu
                );
            });
    }

    document.addEventListener(
        "click",
        function (event) {

            if (
                !mainNav ||
                !mainNav.classList.contains(
                    "mobile-open"
                )
            ) {
                return;
            }

            if (
                !mainNav.contains(event.target) &&
                !mobileButton?.contains(event.target)
            ) {
                closeMobileMenu();
            }
        }
    );

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {
                closeMobileMenu();
            }
        }
    );


    /* =====================================================
       ARTICLE SEARCH
       ===================================================== */

    const searchInput =
        document.getElementById(
            "articleSearchInput"
        ) ||
        document.getElementById(
            "searchInput"
        );

    const clearSearch =
        document.getElementById(
            "clearArticleSearch"
        );

    const searchInfo =
        document.getElementById(
            "articleSearchInfo"
        );

    const emptyState =
        document.getElementById(
            "articleEmptyState"
        );

    const articleCards =
        document.querySelectorAll(
            ".article-card"
        );

    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .replace(/ي/g, "ی")
            .replace(/ك/g, "ک")
            .trim();
    }

    function searchArticles() {

        if (
            !searchInput ||
            !articleCards.length
        ) {
            return;
        }

        const query =
            normalizeText(
                searchInput.value
            );

        let visibleCount = 0;

        articleCards.forEach(
            function (card) {

                const text =
                    normalizeText(
                        card.textContent
                    );

                const matches =
                    !query ||
                    text.includes(query);

                card.style.display =
                    matches
                        ? ""
                        : "none";

                if (matches) {
                    visibleCount++;
                }
            }
        );

        if (searchInfo) {

            searchInfo.textContent =
                query
                    ? `${visibleCount} مقاله پیدا شد`
                    : "";
        }

        if (emptyState) {

            emptyState.style.display =
                query &&
                visibleCount === 0
                    ? ""
                    : "none";
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

                if (searchInput) {

                    searchInput.value = "";

                    searchInput.focus();
                }

                searchArticles();
            }
        );
    }


    /* =====================================================
       CATEGORY FILTER
       ===================================================== */

    const filters =
        document.querySelectorAll(
            ".article-filter"
        );

    if (filters.length) {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const selectedCategory =
            params.get("category");

        function applyCategory(category) {

            document
                .querySelectorAll(
                    ".article-card"
                )
                .forEach(function (card) {

                    const cardCategory =
                        card.dataset.category ||
                        "";

                    const visible =
                        !category ||
                        category === "all" ||
                        cardCategory ===
                            category;

                    card.style.display =
                        visible
                            ? ""
                            : "none";
                });

            filters.forEach(
                function (filter) {

                    filter.classList.toggle(
                        "active",
                        filter.dataset.category ===
                            category ||
                        (
                            !category &&
                            filter.dataset.category ===
                                "all"
                        )
                    );
                }
            );
        }

        filters.forEach(
            function (filter) {

                filter.addEventListener(
                    "click",
                    function () {

                        const category =
                            filter.dataset.category ||
                            "all";

                        const url =
                            new URL(
                                window.location.href
                            );

                        if (
                            category === "all"
                        ) {

                            url.searchParams.delete(
                                "category"
                            );

                        } else {

                            url.searchParams.set(
                                "category",
                                category
                            );
                        }

                        history.pushState(
                            {},
                            "",
                            url
                        );

                        applyCategory(
                            category === "all"
                                ? null
                                : category
                        );
                    }
                );
            }
        );

        applyCategory(
            selectedCategory
        );
    }


    /* =====================================================
       SHARE BUTTONS
       ===================================================== */

    document
        .querySelectorAll(".share-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                async function () {

                    const url =
                        button.dataset.url ||
                        window.location.href;

                    const title =
                        document.title;

                    if (navigator.share) {

                        try {

                            await navigator.share({
                                title: title,
                                url: url
                            });

                        } catch (error) {

                            // Sharing cancelled.
                        }

                    } else {

                        try {

                            await navigator.clipboard
                                .writeText(url);

                            const oldText =
                                button.textContent;

                            button.textContent =
                                "کپی شد ✓";

                            setTimeout(
                                function () {

                                    button.textContent =
                                        oldText;

                                },
                                1800
                            );

                        } catch (error) {

                            console.warn(
                                "Could not copy link."
                            );
                        }
                    }
                }
            );
        });


    /* =====================================================
       COPY LINK
       ===================================================== */

    document
        .querySelectorAll(".copy-link")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                async function () {

                    try {

                        await navigator.clipboard
                            .writeText(
                                window.location.href
                            );

                        const oldText =
                            button.textContent;

                        button.textContent =
                            "لینک کپی شد ✓";

                        setTimeout(
                            function () {

                                button.textContent =
                                    oldText;

                            },
                            1800
                        );

                    } catch (error) {

                        console.warn(
                            "Clipboard unavailable."
                        );
                    }
                }
            );
        });


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const currentPath =
        window.location.pathname
            .replace(/\/+$/, "");

    document
        .querySelectorAll(
            ".premium-nav a, .main-nav a"
        )
        .forEach(function (link) {

            const href =
                link.getAttribute("href");

            if (
                !href ||
                href.startsWith("#")
            ) {
                return;
            }

            try {

                const linkUrl =
                    new URL(
                        href,
                        window.location.origin
                    );

                const linkPath =
                    linkUrl.pathname
                        .replace(/\/+$/, "");

                if (
                    linkPath === currentPath ||
                    (
                        currentPath.endsWith("/") &&
                        linkPath === ""
                    )
                ) {

                    link.classList.add(
                        "active"
                    );
                }

            } catch (error) {

                // Ignore invalid links.
            }
        });


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    document
        .querySelectorAll(
            "[data-current-year]"
        )
        .forEach(function (element) {

            element.textContent =
                new Date().getFullYear();
        });


    /* =====================================================
       EXTERNAL LINK SECURITY
       ===================================================== */

    document
        .querySelectorAll(
            'a[target="_blank"]'
        )
        .forEach(function (link) {

            const rel =
                link.getAttribute("rel") ||
                "";

            const values =
                new Set(
                    rel
                        .split(/\s+/)
                        .filter(Boolean)
                );

            values.add("noopener");
            values.add("noreferrer");

            link.setAttribute(
                "rel",
                [...values].join(" ")
            );
        });


    /* =====================================================
       SMOOTH INTERNAL LINKS
       ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            );
        });


    /* =====================================================
       MEMBERSHIP HELPERS
       ===================================================== */

    function getCurrentUser() {

        const raw =
            sessionStorage.getItem(
                "andisha-current-user"
            );

        if (!raw) {
            return null;
        }

        try {

            const user =
                JSON.parse(raw);

            if (
                !user ||
                !user.email
            ) {
                return null;
            }

            return user;

        } catch (error) {

            return null;
        }
    }

    function normalizeEmail(email) {

        return String(email || "")
            .trim()
            .toLowerCase();
    }

    function getUserKey(user) {

        if (!user || !user.email) {
            return null;
        }

        return encodeURIComponent(
            normalizeEmail(user.email)
        );
    }

    function getSavedKey(user) {

        const key =
            getUserKey(user);

        return key
            ? `andisha-saved-articles-${key}`
            : null;
    }

    function getHistoryKey(user) {

        const key =
            getUserKey(user);

        return key
            ? `andisha-reading-history-${key}`
            : null;
    }

    function readArray(key) {

        if (!key) return [];

        try {

            const raw =
                localStorage.getItem(key);

            if (!raw) {
                return [];
            }

            const value =
                JSON.parse(raw);

            return Array.isArray(value)
                ? value
                : [];

        } catch (error) {

            return [];
        }
    }

    function writeArray(key, value) {

        if (!key) return;

        localStorage.setItem(
            key,
            JSON.stringify(
                Array.isArray(value)
                    ? value
                    : []
            )
        );
    }

    function getArticleId() {

        const file =
            window.location.pathname
                .split("/")
                .pop();

        if (
            !file ||
            !/^article\d*\.html$/i.test(file)
        ) {
            return null;
        }

        return file.toLowerCase();
    }

    function getArticleTitle() {

        const title =
            document.querySelector(
                ".article-header h1"
            );

        if (title) {

            return title.textContent
                .replace(/\s+/g, " ")
                .trim();
        }

        return document.title
            .replace(/\s*\|\s*اندیشه.*$/i, "")
            .trim();
    }


    /* =====================================================
       SAVE ARTICLE
       ===================================================== */

    function isArticleSaved(
        user,
        articleId
    ) {

        const items =
            readArray(
                getSavedKey(user)
            );

        return items.some(
            function (item) {
                return item.id === articleId;
            }
        );
    }

    function saveArticle(
        user,
        articleId,
        title,
        url
    ) {

        const key =
            getSavedKey(user);

        if (!key) return;

        const items =
            readArray(key);

        const existing =
            items.find(
                function (item) {
                    return item.id === articleId;
                }
            );

        if (existing) {
            return;
        }

        items.unshift({
            id: articleId,
            title: title,
            url: url,
            savedAt:
                new Date().toISOString()
        });

        writeArray(
            key,
            items.slice(0, 100)
        );
    }

    function removeSavedArticle(
        user,
        articleId
    ) {

        const key =
            getSavedKey(user);

        if (!key) return;

        const items =
            readArray(key);

        writeArray(
            key,
            items.filter(
                function (item) {
                    return item.id !== articleId;
                }
            )
        );
    }


    /* =====================================================
       READING HISTORY
       ===================================================== */

    function addReadingHistory(
        user,
        articleId,
        title,
        url
    ) {

        const key =
            getHistoryKey(user);

        if (!key) return;

        let items =
            readArray(key);

        items =
            items.filter(
                function (item) {
                    return item.id !== articleId;
                }
            );

        items.unshift({
            id: articleId,
            title: title,
            url: url,
            readAt:
                new Date().toISOString()
        });

        writeArray(
            key,
            items.slice(0, 100)
        );
    }


    /* =====================================================
       ARTICLE MEMBERSHIP UI
       ===================================================== */

    function initializeArticleMembership() {

        const articleId =
            getArticleId();

        if (!articleId) {
            return;
        }

        const article =
            document.querySelector(
                ".article-page"
            );

        if (!article) {
            return;
        }

        const title =
            getArticleTitle();

        const url =
            window.location.href;

        const existing =
            document.getElementById(
                "andishaSaveArticle"
            );

        if (existing) {
            return;
        }

        const section =
            document.createElement(
                "section"
            );

        section.className =
            "andisha-membership-tools";

        section.innerHTML = `
            <div class="andisha-save-panel">

                <div class="andisha-save-content">

                    <span class="andisha-save-kicker">
                        کتابخانه شخصی
                    </span>

                    <strong>
                        این مقاله را برای مطالعه بعدی ذخیره کنید
                    </strong>

                    <small>
                        مقاله‌های ذخیره‌شده در حساب کاربری شما نگهداری می‌شوند.
                    </small>

                </div>

                <button
                    type="button"
                    id="andishaSaveArticle"
                    class="andisha-save-button">
                    ♡ ذخیره مقاله
                </button>

            </div>
        `;

        const shareSection =
            article.querySelector(
                ".article-share"
            );

        if (shareSection) {

            shareSection.parentNode.insertBefore(
                section,
                shareSection
            );

        } else {

            article.appendChild(
                section
            );
        }

        const button =
            document.getElementById(
                "andishaSaveArticle"
            );

        function refreshSaveButton() {

            const user =
                getCurrentUser();

            if (!user) {

                button.textContent =
                    "♡ ورود برای ذخیره";

                button.classList.remove(
                    "is-saved"
                );

                return;
            }

            const saved =
                isArticleSaved(
                    user,
                    articleId
                );

            if (saved) {

                button.textContent =
                    "♥ ذخیره شده";

                button.classList.add(
                    "is-saved"
                );

            } else {

                button.textContent =
                    "♡ ذخیره مقاله";

                button.classList.remove(
                    "is-saved"
                );
            }
        }

        button.addEventListener(
            "click",
            function () {

                const user =
                    getCurrentUser();

                if (!user) {

                    window.location.href =
                        "login.html";

                    return;
                }

                if (
                    isArticleSaved(
                        user,
                        articleId
                    )
                ) {

                    removeSavedArticle(
                        user,
                        articleId
                    );

                } else {

                    saveArticle(
                        user,
                        articleId,
                        title,
                        url
                    );
                }

                refreshSaveButton();
            }
        );

        refreshSaveButton();

        const user =
            getCurrentUser();

        if (user) {

            addReadingHistory(
                user,
                articleId,
                title,
                url
            );
        }
    }


    /* =====================================================
       ACCOUNT HEADER
       ===================================================== */

    function initializeAccountHeader() {

        const actions =
            document.querySelector(
                ".premium-actions"
            );

        if (!actions) {
            return;
        }

        const currentUser =
            getCurrentUser();

        const themeButton =
            actions.querySelector(
                ".premium-theme"
            );

        actions
            .querySelectorAll(
                ".premium-account, .premium-register, .premium-user, .premium-logout"
            )
            .forEach(
                function (element) {
                    element.remove();
                }
            );

        if (currentUser) {

            const accountLink =
                document.createElement("a");

            accountLink.href =
                "account.html";

            accountLink.className =
                "premium-account premium-user";

            accountLink.textContent =
                currentUser.name ||
                "حساب من";

            accountLink.setAttribute(
                "aria-label",
                "حساب کاربری"
            );

            const logoutButton =
                document.createElement(
                    "button"
                );

            logoutButton.type =
                "button";

            logoutButton.className =
                "premium-register premium-logout";

            logoutButton.textContent =
                "خروج";

            logoutButton.addEventListener(
                "click",
                function () {

                    sessionStorage.removeItem(
                        "andisha-current-user"
                    );

                    window.location.reload();
                }
            );

            if (themeButton) {

                actions.insertBefore(
                    accountLink,
                    themeButton
                );

                actions.insertBefore(
                    logoutButton,
                    themeButton
                );

            } else {

                actions.appendChild(
                    accountLink
                );

                actions.appendChild(
                    logoutButton
                );
            }

        } else {

            const loginLink =
                document.createElement(
                    "a"
                );

            loginLink.href =
                "login.html";

            loginLink.className =
                "premium-account";

            loginLink.textContent =
                "ورود";

            const registerLink =
                document.createElement(
                    "a"
                );

            registerLink.href =
                "register.html";

            registerLink.className =
                "premium-register";

            registerLink.textContent =
                "عضویت";

            if (themeButton) {

                actions.insertBefore(
                    loginLink,
                    themeButton
                );

                actions.insertBefore(
                    registerLink,
                    themeButton
                );

            } else {

                actions.appendChild(
                    loginLink
                );

                actions.appendChild(
                    registerLink
                );
            }
        }
    }


    /* =====================================================
       INITIALIZE MEMBERSHIP
       ===================================================== */

    initializeAccountHeader();

    initializeArticleMembership();


    /* =====================================================
       OPTIONAL BACK-TO-TOP
       ===================================================== */

    if (
        typeof updateBackTop ===
        "function"
    ) {
        updateBackTop();
    }


    console.log(
        "ANDISHA MEMBERSHIP ENGINE READY"
    );

});