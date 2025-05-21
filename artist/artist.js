// ► HÄMTAR REFERENSER TILL ALLA VIKTIGA ELEMENT
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const floorFilter = document.getElementById("floorFilter");
const timeSort = document.getElementById("timeSort");
const artistsContainer = document.getElementById("artists");

const modal = document.getElementById("modal");
const modalName = document.getElementById("modalName");
const modalDesc = document.getElementById("modalDesc");
const modalTime = document.getElementById("modalTime");
const modalImg = document.getElementById("modalImg");
const modalSpotify = document.getElementById("modalSpotify");
const spotifyLink = document.getElementById("spotifyLink");
const instagramLink = document.getElementById("instagramLink");
const ticketLink = document.getElementById("ticketLink");
const addCalBtn = document.getElementById("addCalBtn");
const modalClose = document.getElementById("modalClose");

let filteredList = []; // Behåll aktuell filtrerad lista för timeline

/**
 * Renderer alla artistkort i en grid.
 * @param {Array} data – Lista med artist-objekt.
 */
function renderArtists(data) {
  artistsContainer.innerHTML = ""; // Rensa eventuella gamla kort
  filteredList = data; // Spara för timeline

  // Om inga artister kvar efter filtrering, visa meddelande
  if (data.length === 0) {
    artistsContainer.innerHTML =
      '<p style="color:#f00;text-align:center;">Inga artister matchar sökningen.</p>';
    return;
  }

  // Skapa ett kort per artist
  data.forEach((artist) => {
    const card = document.createElement("div");
    card.className = "artist-card";
    card.tabIndex = 0; // Gör tabbbar

    // Sätt data-attribut för senare användning i modal
    card.dataset.name = artist.name;
    card.dataset.desc = artist.desc;
    card.dataset.time = artist.time;
    card.dataset.genre = artist.genre;
    card.dataset.floor = artist.floor;
    card.dataset.img = artist.img;
    card.dataset.spotifyEmbed = artist.spotifyEmbed;
    card.dataset.spotify = artist.social.spotify;
    card.dataset.instagram = artist.social.instagram;
    card.dataset.ticket = artist.ticketLink;

    // Bygg kortets HTML
    card.innerHTML = `
      <img src="${artist.img}" alt="${artist.name}" />
      <h3>${artist.name}</h3>
      <p>${artist.time} — ${artist.floor}</p>
    `;

    // Lägg till i DOM
    artistsContainer.appendChild(card);

    // Klick & tangentryck → öppna modal
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });
  });
}

/**
 * Filtrerar och sorterar artister baserat på kontrollerna.
 */
function filterArtists() {
  const term = searchInput.value.toLowerCase();
  const genre = genreFilter.value;
  const floor = floorFilter.value;
  const order = timeSort.value;

  // Grundfilter: sök + genre + floor
  let result = artistsData.filter((a) => {
    const m1 = a.name.toLowerCase().includes(term);
    const m2 = !genre || a.genre === genre;
    const m3 = !floor || a.floor === floor;
    return m1 && m2 && m3;
  });

  // Sortera efter tid om vald
  if (order) {
    result.sort((a, b) => {
      // Räkna om "Lördag HH:MM" → minuter sedan midnatt
      const ta = parseTime(a.time),
        tb = parseTime(b.time);
      return order === "asc" ? ta - tb : tb - ta;
    });
  }

  renderArtists(result);
  renderTimeline(result);
}

/**
 * Omvandlar en sträng "Dag HH:MM" → antal minuter sedan midnatt.
 */
function parseTime(str) {
  const hhmm = str.split(" ")[1]; // ta "HH:MM"
  const [hh, mm] = hhmm.split(":").map((n) => parseInt(n, 10));
  return hh * 60 + mm;
}

/**
 * Öppnar modalen och fyller på med data från kortet.
 */
function openModal(card) {
  modalName.textContent = card.dataset.name;
  modalDesc.textContent = card.dataset.desc;
  modalTime.textContent = card.dataset.time;
  modalImg.src = card.dataset.img;
  modalSpotify.src = card.dataset.spotifyEmbed;
  spotifyLink.href = card.dataset.spotify;
  instagramLink.href = card.dataset.instagram;
  ticketLink.href = card.dataset.ticket;

  modal.style.display = "flex";
  modalClose.focus();
}

/**
 * Stänger modalen och återställer fokus.
 */
function closeModal() {
  modal.style.display = "none";
  const first = document.querySelector(".artist-card");
  if (first) first.focus();
}

/**
 * Renderar den interaktiva tidslinjen.
 * @param {Array} data – Lista med artistobjekt.
 */
function renderTimeline(data) {
  const tl = document.getElementById("timeline");
  tl.innerHTML = ""; // töm tidigare

  // Sortera kronologiskt
  data.sort((a, b) => parseTime(a.time) - parseTime(b.time));

  // Skapa tidslinje-element per artist
  data.forEach((art) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <h4>${art.name}</h4>
      <time>${art.time} — ${art.floor}</time>
    `;
    tl.appendChild(item);
  });
}

/**
 * Genererar och laddar ner en .ics-fil för kalenderpåminnelse.
 */
function setupCalendar() {
  addCalBtn.addEventListener("click", () => {
    const title = modalName.textContent;
    // Förenklat: använd dagens datum + tid i modalTime
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      ...modalTime.textContent.split(" ")[1].split(":")
    );
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    // Bygg ics-format
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    // Ladda ner som fil
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

/**
 * Hjälp för att formattera Date → YYYYMMDDThhmmssZ
 */
function formatDate(d) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

// ► EVENT-LYSSNARE
modalClose.addEventListener("click", closeModal);
modalClose.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") closeModal();
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.display === "flex") closeModal();
});

// Koppla filter-workflow
searchInput.addEventListener("input", filterArtists);
genreFilter.addEventListener("change", filterArtists);
floorFilter.addEventListener("change", filterArtists);
timeSort.addEventListener("change", filterArtists);

// Initial rendering
renderArtists(artistsData);
renderTimeline(artistsData);
setupCalendar();
