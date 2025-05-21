
const input = document.getElementById('commandInput');
const output = document.getElementById('output');
const terminal = document.getElementById('terminal');

const audio = new Audio("noise.mp3");
audio.loop = true;
audio.volume = 0.3;
audio.play();

function triggerErrorEffect() {
    terminal.classList.add("glitch-error");
    setTimeout(() => terminal.classList.remove("glitch-error"), 400);
}

input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const cmd = input.value.trim().toLowerCase();
        output.innerHTML += `> ${cmd}<br>`;
        input.value = "";

        if (cmd === "ono") {
            output.innerHTML += "<span class='blink'>[LOADING]</span><br>";
            setTimeout(() => {
                window.location.href = "unlocked.html";
            }, 2000);
        } else {
            output.innerHTML += "<span style='color:red;'>ERROR: Unknown command</span><br><br>";
            triggerErrorEffect();
        }

        output.scrollTop = output.scrollHeight;
    }
});
