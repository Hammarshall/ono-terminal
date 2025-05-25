// schedule.js
// 1) Se till att artistsData är globalt inläst
// <script src="artistsData.js"></script> i HTML:n

document.addEventListener("DOMContentLoaded", () => {
  const scheduleRoot = document.getElementById("schedule");

  // 2) Hjälpfunktion för att sortera "HH:MM–HH:MM"
  function startMinutes(timeRange) {
    const hhmm = timeRange.split("–")[0];
    const [hh, mm] = hhmm.split(":").map((n) => +n);
    return hh * 60 + mm;
  }

  // 3) Sortera hela listan efter starttid
  const sorted = [...artistsData].sort((a, b) => {
    return startMinutes(a.time) - startMinutes(b.time);
  });

  // 4) Gruppera efter floor
  const sections = {};
  sorted.forEach((artist) => {
    const floor = artist.floor;
    if (!sections[floor]) sections[floor] = [];
    sections[floor].push(artist);
  });

  // 5) Rendera varje sektion
  for (const [floor, list] of Object.entries(sections)) {
    // Rubrik för sektionen
    const h3 = document.createElement("h3");
    h3.textContent = floor;
    scheduleRoot.appendChild(h3);

    // Ev. beskrivning (här kan du lägga in Genre/Vibe om du vill)
    // t.ex. <p class="venue">…</p>

    // Lista
    const ul = document.createElement("ul");
    ul.className = "setlist";

    list.forEach((art) => {
      const li = document.createElement("li");

      const timeEl = document.createElement("time");
      timeEl.textContent = art.time;
      li.appendChild(timeEl);

      const span = document.createElement("span");
      span.textContent = art.name;
      li.appendChild(span);

      ul.appendChild(li);
    });

    scheduleRoot.appendChild(ul);
  }
});
