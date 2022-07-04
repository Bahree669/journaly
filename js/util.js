export function makeId() {
    const id = [];
    const text = "qwertyuiopasdfghjklzxcvbnm_+1234567890-?&QWERTYUIOPASDFGHJKLZXCVBNM".split("");
    for (let i = 0; i < 12; i++) {
        id.push(text[random(0, text.length)]);
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min) + 1);
    }

    return id.join("");
}
