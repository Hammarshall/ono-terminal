// Hämta element från DOM
const input = document.getElementById("commandInput");
const output = document.getElementById("output");
const terminal = document.getElementById("terminal");

const correctPassword = "ono"; // Rätt lösenord

// Funktion för glitch-effekt vid fel
function triggerErrorEffect() {
  // Lägg till en CSS-klass som triggar glitch-animationen
  terminal.classList.add("glitch-error");

  // Ta bort klassen efter 400 ms för att animationen ska kunna triggas igen
  setTimeout(() => terminal.classList.remove("glitch-error"), 400);
}

// Lyssna på Enter-tangenttryck i inputfältet
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    // Hämta och normalisera användarens input (trimma och gör små bokstäver)
    const cmd = input.value.trim().toLowerCase();

    // Visa användarens kommando i terminalen
    output.innerHTML += `> ${cmd}<br>`;

    // Rensa inputfältet efter inskickat kommando
    input.value = "";

    // Kolla om lösenordet är korrekt
    if (cmd === correctPassword) {
      // Visa laddningsindikator
      output.innerHTML += "<span class='blink'>[LOADING]</span><br>";

      // Efter 2 sekunder, navigera till den låsta sidan
      setTimeout(() => {
        window.location.href = "unlocked/unlocked.html"; // Gå till lyckat inlogg
      }, 2000);
    } else {
      // Visa felmeddelande i rött
      output.innerHTML +=
        "<span style='color:red;'>ERROR: Unknown command</span><br><br>";

      // Spela upp glitch-effekt vid fel
      triggerErrorEffect();

      // Efter 1.5 sekunder, navigera till fel-sidan
      setTimeout(() => {
        window.location.href = "error/error.html";; // Gå till fel-sida
      }, 1500);
    }

    // Scrolla terminalens output till botten för att visa senaste
    output.scrollTop = output.scrollHeight;
  }
});
