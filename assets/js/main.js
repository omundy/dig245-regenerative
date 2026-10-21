
const canvas = document.querySelector("#study");
const context = canvas.getContext("2d");
const offsetControl = document.querySelector("#offset");
const offsetValue = document.querySelector("#offset-value");
const paletteButton = document.querySelector("#palette-button");
const resetButton = document.querySelector("#reset-button");
const announcement = document.querySelector("#announcement");

const palettes = [
    ["#d64b2f", "#ec8d37", "#e7c85c", "#537d72"],
    ["#303f83", "#497bb4", "#e7c85c", "#d45537"],
    ["#6d315c", "#bc5262", "#e4a65c", "#62836c"],
    ["#246a68", "#76a69a", "#e5bc66", "#c65a3e"]
];

const state = {
    paletteIndex: 0,
    displacement: Number(offsetControl.value) / 100,
    pointerX: 0.5,
    pointerY: 0.5
};

function draw() {
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = Math.round(bounds.width * pixelRatio);
    canvas.height = Math.round(bounds.height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, bounds.width, bounds.height);

    const side = Math.min(bounds.width, bounds.height) * 0.84;
    const centerX = bounds.width * 0.5;
    const centerY = bounds.height * 0.5;
    const palette = palettes[state.paletteIndex];
    const sizes = [side, side * 0.76, side * 0.53, side * 0.29];

    context.fillStyle = "#d8d3c8";
    context.fillRect(0, 0, bounds.width, bounds.height);

    sizes.forEach((size, index) => {
        const maxShift = index === sizes.length - 1
            ? (sizes[index - 1] - size) / 2
            : 0;
        const shiftX = (state.pointerX - 0.5) * maxShift * 2 * state.displacement;
        const shiftY = (state.pointerY - 0.5) * maxShift * 2 * state.displacement;

        context.fillStyle = palette[index];
        context.fillRect(
            centerX - size / 2 + shiftX,
            centerY - size / 2 + shiftY,
            size,
            size
        );
    });
}

canvas.addEventListener("pointermove", (event) => {
    const bounds = canvas.getBoundingClientRect();
    state.pointerX = (event.clientX - bounds.left) / bounds.width;
    state.pointerY = (event.clientY - bounds.top) / bounds.height;
    draw();
});

canvas.addEventListener("pointerleave", () => {
    state.pointerX = 0.5;
    state.pointerY = 0.5;
    draw();
});

canvas.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 0.1 : 0.025;
    const directions = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step]
    };
    const direction = directions[event.key];

    if (!direction) return;

    event.preventDefault();
    state.pointerX = Math.min(1, Math.max(0, state.pointerX + direction[0]));
    state.pointerY = Math.min(1, Math.max(0, state.pointerY + direction[1]));
    draw();
});

offsetControl.addEventListener("input", () => {
    state.displacement = Number(offsetControl.value) / 100;
    offsetValue.value = `${offsetControl.value}%`;
    draw();
});

paletteButton.addEventListener("click", () => {
    state.paletteIndex = (state.paletteIndex + 1) % palettes.length;
    announcement.textContent = `Palette ${state.paletteIndex + 1} of ${palettes.length}`;
    draw();
});

resetButton.addEventListener("click", () => {
    state.paletteIndex = 0;
    state.displacement = 0.35;
    state.pointerX = 0.5;
    state.pointerY = 0.5;
    offsetControl.value = "35";
    offsetValue.value = "35%";
    announcement.textContent = "Study reset to the first palette and centered composition.";
    draw();
});

new ResizeObserver(draw).observe(canvas);
draw();
