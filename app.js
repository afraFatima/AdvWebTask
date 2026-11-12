// CampusMart listings
const listings = [
    { id: 1, title: "Casio fx-991EX Calculator", price: 4500, category: "Electronics", condition: "Good" },
    { id: 2, title: "Introduction to Algorithms (CLRS)", price: 3500, category: "Books", condition: "Like new" },
    { id: 3, title: "Logitech Wireless Mouse", price: 1800, category: "Electronics", condition: "Good" },
    { id: 4, title: "Discrete Mathematics by Rosen", price: 2200, category: "Books", condition: "Fair" },
    { id: 5, title: "Study Table with Drawer", price: 6000, category: "Furniture", condition: "Good" },
    { id: 6, title: "Geometry Box Set", price: 600, category: "Stationery", condition: "Like new" }
];

// Load favourites saved in the browser
const savedFavourites = JSON.parse(localStorage.getItem("favs") || "[]");
const favorites = new Set(savedFavourites);

const grid = document.querySelector("#listing-grid");
const searchInput = document.querySelector("#search");
const categoryInput = document.querySelector("#category");
const sortInput = document.querySelector("#sort");
const resultCount = document.querySelector("#result-count");
const emptyMessage = document.querySelector("#empty-message");
const favCount = document.querySelector("#fav-count");
const savedTotal = document.querySelector("#saved-total");
const themeToggle = document.querySelector("#theme-toggle");

const formatPrice = (amount) => `Rs ${amount.toLocaleString("en-PK")}`;

function createCard(listing) {
    const article = document.createElement("article");
    article.className = "listing-card card";
    article.dataset.id = listing.id;

    const image = document.createElement("img");
    image.src = `https://placehold.co/600x420?text=${encodeURIComponent(listing.category)}`;
    image.alt = listing.title;
    image.width = 600;
    image.height = 420;

    const content = document.createElement("div");
    content.className = "listing-content";

    const category = document.createElement("p");
    category.className = "listing-category";
    category.textContent = `${listing.category} · ${listing.condition}`;

    const title = document.createElement("h3");
    title.textContent = listing.title;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(listing.price);

    const favButton = document.createElement("button");
    favButton.className = "fav-btn";
    favButton.type = "button";
    favButton.setAttribute("aria-pressed", favorites.has(listing.id));
    favButton.textContent = favorites.has(listing.id) ? "❤️ Saved" : "🤍 Save";

    content.append(category, title, price, favButton);
    article.append(image, content);
    return article;
}

function render(items) {
    grid.replaceChildren(...items.map(createCard));
    resultCount.textContent = `${items.length} item(s) found`;
    emptyMessage.hidden = items.length !== 0;
    favCount.textContent = favorites.size;

    const total = listings
        .filter((item) => favorites.has(item.id))
        .reduce((sum, item) => sum + item.price, 0);
    savedTotal.textContent = formatPrice(total);
}

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categoryInput.value;
    const sort = sortInput.value;

    let filtered = listings.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query);
        const matchesCategory = category === "All" || item.category === category;
        return matchesSearch && matchesCategory;
    });

    if (sort === "low-high") {
        filtered = filtered.toSorted((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
        filtered = filtered.toSorted((a, b) => b.price - a.price);
    } else {
        filtered = filtered.toSorted((a, b) => b.id - a.id);
    }
    render(filtered);
}

// One function is used by all three controls
searchInput.addEventListener("input", applyFilters);
categoryInput.addEventListener("change", applyFilters);
sortInput.addEventListener("change", applyFilters);

// Event delegation for favourite buttons
grid.addEventListener("click", (event) => {
    const button = event.target.closest(".fav-btn");
    if (!button) return;

    const id = Number(button.closest(".card").dataset.id);
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);

    localStorage.setItem("favs", JSON.stringify([...favorites]));
    applyFilters();
});

// Dark-mode toggle
 themeToggle.addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme === "dark";
    root.dataset.theme = isDark ? "light" : "dark";
    themeToggle.textContent = isDark ? "🌙" : "☀️";
});

applyFilters();
console.log("Original listings:", listings);
