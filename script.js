const svg = document.getElementById("wheel");
const red = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const black = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
const numbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];
const total = numbers.length;
const centerX = 200;
const centerY = 200;
const radius = 200;
const textRadius = 170;

function drawWheel() {
  svg.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const angle = (2 * Math.PI / total) * i;
    const nextAngle = (2 * Math.PI / total) * (i + 1);
    const num = numbers[i];
    const color = red.includes(num) ? 'red' : black.includes(num) ? 'black' : 'green';

    const x1 = centerX + radius * Math.cos(angle);
    const y1 = centerY + radius * Math.sin(angle);
    const x2 = centerX + radius * Math.cos(nextAngle);
    const y2 = centerY + radius * Math.sin(nextAngle);

    // Draw sector
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`;
    path.setAttribute("d", d);
    path.setAttribute("fill", color);
    svg.appendChild(path);

    // Draw number
    const textAngle = angle + (Math.PI / total);
    const tx = centerX + textRadius * Math.cos(textAngle);
    const ty = centerY + textRadius * Math.sin(textAngle);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", tx);
    text.setAttribute("y", ty);
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "12");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");
    text.setAttribute("transform", `rotate(${(textAngle * 180 / Math.PI)}, ${tx}, ${ty})`);
    text.textContent = num;
    svg.appendChild(text);
  }
}
drawWheel();

function spin() {
  const resultP = document.getElementById("result");
  const betType = document.getElementById("bet-type").value;
  const betValue = document.getElementById("bet-value").value.toLowerCase();

  const spinDeg = 360 * 5 + Math.floor(Math.random() * 360);
  svg.style.transform = `rotate(${spinDeg}deg)`;

  const winningIndex = (total - Math.floor((spinDeg % 360) / (360 / total))) % total;
  const landedNumber = numbers[winningIndex];

  setTimeout(() => {
    let message = "";
    const color = red.includes(landedNumber)
      ? "rojo"
      : black.includes(landedNumber)
      ? "negro"
      : "verde";

    switch (betType) {
      case "number":
        message = parseInt(betValue) === landedNumber
          ? `¡Ganaste! Salió el ${landedNumber}`
          : `Perdiste. Salió el ${landedNumber}`;
        break;
      case "color":
        message = betValue === color
          ? `¡Ganaste! Salió ${landedNumber} (${color})`
          : `Perdiste. Salió ${landedNumber} (${color})`;
        break;
      case "parity":
        if (landedNumber === 0) {
          message = `Perdiste. Salió 0 (ni par ni impar)`;
        } else {
          const parity = landedNumber % 2 === 0 ? "par" : "impar";
          message = betValue === parity
            ? `¡Ganaste! Salió ${landedNumber} (${parity})`
            : `Perdiste. Salió ${landedNumber
