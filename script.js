// ANDISHA WEBSITE

document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // DARK MODE
    // =========================

    const darkButton = document.createElement("button");

    darkButton.id = "darkModeButton";
    darkButton.innerHTML = "☾";
    darkButton.title = "حالت تاریک";

    document.body.appendChild(darkButton);

    darkButton.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("andisha-theme", "dark");
            darkButton.innerHTML = "☀";
        } else {
            localStorage.setItem("andisha-theme", "light");
            darkButton.innerHTML = "☾";
        }

    });


    // ذخیره حالت انتخاب‌شده
    const savedTheme = localStorage.getItem("andisha-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        darkButton.innerHTML = "☀";
    }


    // =========================
    // SEARCH
    // =========================

    const searchBox = document.createElement("div");

    searchBox.className = "search-box";

    searchBox.innerHTML = `
        <input
            type="text"
            id="articleSearch"
            placeholder="جست‌وجوی مقاله..."
        >
        <button id="searchButton">
            🔎
        </button>
    `;

    const header = document.querySelector("header");

    if (header) {
        header.appendChild(searchBox);
    }


    const searchInput = document.getElementById("articleSearch");
    const searchButton = document.getElementById("searchButton");


    function searchArticles() {

        const query = searchInput.value.trim().toLowerCase();

        const articles = document.querySelectorAll("main article");

        if (articles.length === 0) {
            return;
        }

        articles.forEach(function (article) {

            const text = article.innerText.toLowerCase();

            if (query === "" || text.includes(query)) {
                article.style.display = "";
            } else {
                article.style.display = "none";
            }

        });

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


    // =========================
    // ENTER SEARCH
    // =========================

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