const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const blackNumbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
const greenNumbers = [0];
const allNumbers = [...greenNumbers, ...redNumbers, ...blackNumbers];

function spin() {
  const wheel = document.getElementById('wheel');
  const resultP = document.getElementById('result');
  const betType = document.getElementById('bet-type').value;
  const betValue = document.getElementById('bet-value').value.toLowerCase();

  const angle = 360 * 5 + Math.floor(Math.random() * 360);
  const number = Math.floor(Math.random() * 37); // 0-36

  wheel.style.transform = `rotate(${angle}deg)`;

  setTimeout(() => {
    const landed = number;
    let outcome = '';

    switch (betType) {
      case 'number':
        outcome = betValue == landed ? '¡Ganaste!' : `Perdiste. Salió ${landed}`;
        break;
      case 'color':
        const color = redNumbers.includes(landed)
          ? 'rojo'
          : blackNumbers.includes(landed)
          ? 'negro'
          : 'verde';
        outcome = betValue === color ? `¡Ganaste! Salió ${color} (${landed})` : `Perdiste. Salió ${color} (${landed})`;
        break;
      case 'parity':
        if (landed === 0) {
          outcome = `Perdiste. Salió 0 (ni par ni impar)`;
        } else {
          const parity = landed % 2 === 0 ? 'par' : 'impar';
          outcome = betValue === parity ? `¡Ganaste! Salió ${landed} (${parity})` : `Perdiste. Salió ${landed} (${parity})`;
        }
        break;
      case 'dozen':
        let dozen = '';
        if (landed >= 1 && landed <= 12) dozen = '1ra docena';
        else if (landed >= 13 && landed <= 24) dozen = '2da docena';
        else if (landed >= 25 && landed <= 36) dozen = '3ra docena';
        else dozen = 'fuera de docena';

        outcome = betValue.includes(dozen.split(' ')[0]) ? `¡Ganaste! Salió ${landed} (${dozen})` : `Perdiste. Salió ${landed} (${dozen})`;
        break;
      default:
        outcome = 'Apuesta no válida.';
    }

    resultP.textContent = outcome;
  }, 4200);
}
