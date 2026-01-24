// =======================
// DOM References
// =======================
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resetBtn = document.getElementById("reset-btn");
const resultDiv = document.getElementById("result");

// =======================
// Config
// =======================
const API_URL = "travel_recommendation_api.json";

// =======================
// App State
// =======================
let appData = null;

// =======================
// Data Layer
// =======================
async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API fetch failed");
    appData = await res.json();
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

// =======================
// UI Layer
// =======================
function clearResults() {
  resultDiv.innerHTML = "";
}

function renderItem({ imageUrl, name, description }) {
  const div = document.createElement("div");
  div.classList.add("search-item");
  div.innerHTML = `
    <img src="${imageUrl}" alt="${name}">
    <h2>${name}</h2>
    <p>${description}</p>
    <button>Visit</button>
  `;
  return div;
}

function renderList(list) {
  const fragment = document.createDocumentFragment();
  list.forEach((item) => fragment.appendChild(renderItem(item)));
  resultDiv.appendChild(fragment);
}

function renderNotFound() {
  resultDiv.innerHTML = `<p class="not-found">Destination not found!</p>`;
}

// =======================
// Business Logic
// =======================
function handleSearch() {
  const keyword = searchInput.value.trim().toLowerCase();
  clearResults();

  if (!appData || !keyword) return;

  const routes = {
    beach: () => renderList(appData.beaches),
    beaches: () => renderList(appData.beaches),

    temple: () => renderList(appData.temples),
    temples: () => renderList(appData.temples),

    country: () => {
      const cities = appData.countries.flatMap((c) => c.cities);
      renderList(cities);
    },

    countries: () => {
      const cities = appData.countries.flatMap((c) => c.cities);
      renderList(cities);
    },
  };

  routes[keyword] ? routes[keyword]() : renderNotFound();
}

// =======================
// Events
// =======================
searchBtn.addEventListener("click", handleSearch);

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearResults();
});

// =======================
// Init
// =======================
fetchData(API_URL);
