// ► HÄMTAR REFERENSER
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const floorFilter = document.getElementById("floorFilter");
const timeSort = document.getElementById("timeSort");
const artistsContainer = document.getElementById("artists");

const modal = document.getElementById("modal");
const modalName = document.getElementById("modalName");
const modalStyle = document.getElementById("modalStyle");
const modalDesc = document.getElementById("modalDesc");
const modalTime = document.getElementById("modalTime");
const modalImg = document.getElementById("modalImg");
const modalSpotify = document.getElementById("modalSpotify");
const spotifyLink = document.getElementById("spotifyLink");
const instagramLink = document.getElementById("instagramLink");
const ticketLink = document.getElementById("ticketLink");
const addCalBtn = document.getElementById("addCalBtn");
const modalClose = document.getElementById("modalClose");

let filteredList = []; // för timeline

/** RENDERAR ARTISTKORT */
function renderArtists(data) {
  artistsContainer.innerHTML = "";
  filteredList = data;
  if (!data.length) {
    artistsContainer.innerHTML =
      '<p style="color:#f00;text-align:center;">Inga artister matchar sökningen.</p>';
    return;
  }
  data.forEach((artist) => {
    const c = document.createElement("div");
    c.className = "artist-card";
    c.tabIndex = 0;
    // data-atribut
    c.dataset.name = artist.name;
    c.dataset.style = artist.style;
    c.dataset.desc = artist.desc;
    c.dataset.time = artist.time;
    c.dataset.genre = artist.genre;
    c.dataset.floor = artist.floor;
    c.dataset.img = artist.img;
    c.dataset.track = artist.track;
    c.dataset.spotifyEmbed = artist.spotifyEmbed;
    c.dataset.spotify = artist.social.spotify;
    c.dataset.instagram = artist.social.instagram;
    c.dataset.ticket = artist.ticketLink;

    c.innerHTML = `
      <img src="${artist.img}" alt="${artist.name}" />
      <h3>${artist.name}</h3>
      <p>${artist.time} — ${artist.floor}</p>
    `;
    artistsContainer.appendChild(c);
    c.addEventListener("click", () => openModal(c));
    c.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(c);
      }
    });
  });
}

/** FILTRERA + SORTERA */
function filterArtists() {
  const term = searchInput.value.toLowerCase();
  const genre = genreFilter.value;
  const floor = floorFilter.value;
  const ord = timeSort.value;

  let res = artistsData.filter((a) => {
    const m1 = a.name.toLowerCase().includes(term);
    const m2 = !genre || a.genre === genre;
    const m3 = !floor || a.floor === floor;
    return m1 && m2 && m3;
  });
  if (ord) {
    res.sort((a, b) => parseTime(a.time) - parseTime(b.time));
    if (ord === "desc") res.reverse();
  }
  renderArtists(res);
  renderTimeline(res);
}

/** TID→min sedan midnatt */
function parseTime(str) {
  const hhmm = str.split("–")[0] || str;
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  return h * 60 + m;
}

/** ÖPPNA MODAL */
function openModal(card) {
  modalName.textContent = card.dataset.name;
  modalStyle.textContent = card.dataset.style;
  modalDesc.textContent = card.dataset.desc;
  modalTime.textContent = card.dataset.time;
  modalImg.src = card.dataset.img;
  modalSpotify.src = card.dataset.track;
  spotifyLink.href = card.dataset.spotifyEmbed;
  instagramLink.href = "https://instagram.com/" + card.dataset.instagram;
  ticketLink.href = card.dataset.ticket;

  modal.style.display = "flex";
  modalClose.focus();
}

/** STÄNG MODAL */
function closeModal() {
  modal.style.display = "none";
  const f = document.querySelector(".artist-card");
  if (f) f.focus();
}

/** RENDERAR TIDSLINJE */
function renderTimeline(data) {
  const tl = document.getElementById("timeline");
  tl.innerHTML = "";
  data.sort((a, b) => parseTime(a.time) - parseTime(b.time));
  data.forEach((art) => {
    const it = document.createElement("div");
    it.className = "timeline-item";
    it.innerHTML = `
      <h4>${art.name}</h4>
      <time>${art.time} — ${art.floor}</time>
    `;
    tl.appendChild(it);
  });
}

/** KALENDER-ICS */
function setupCalendar() {
  addCalBtn.addEventListener("click", () => {
    const title = modalName.textContent;
    const [h, m] = modalTime.textContent
      .split("–")[0]
      .split(":")
      .map((n) => parseInt(n, 10));
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      h,
      m
    );
    const end = new Date(start.getTime() + 60 * 60 * 1000);
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
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
function formatDate(d) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

// ► EVENT
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

searchInput.addEventListener("input", filterArtists);
genreFilter.addEventListener("change", filterArtists);
floorFilter.addEventListener("change", filterArtists);
timeSort.addEventListener("change", filterArtists);

// ► INIT
renderArtists(artistsData);
renderTimeline(artistsData);
setupCalendar();
