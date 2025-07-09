
    // --- DATOS Y RUEDA ---
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
    const radius = 190;
    const textRadius = 160;

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

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`;
        path.setAttribute("d", d);
        path.setAttribute("fill", color);
        svg.appendChild(path);

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

    // --- TABLA DE APUESTAS HORIZONTAL ---
    const betTable = document.getElementById('bet-table');
    betTable.innerHTML = '';

    // Botón 0 (una sola celda a la izquierda)
    const btn0 = document.createElement('button');
    btn0.className = 'bet-cell';
    btn0.dataset.type = 'number';
    btn0.dataset.value = 0;
    btn0.textContent = '0';
    btn0.style.gridRow = '1 / span 3';
    btn0.style.gridColumn = '1';
    btn0.style.background = 'green';
    btn0.style.color = 'white';
    betTable.appendChild(btn0);

    // Números 1-36 en 3 filas y 12 columnas (horizontal)
    let num = 1;
    for (let row = 1; row <= 3; row++) {
      for (let col = 2; col <= 13; col++) {
        if (num > 36) break;
        const btn = document.createElement('button');
        btn.className = 'bet-cell';
        btn.dataset.type = 'number';
        btn.dataset.value = num;
        btn.textContent = num;
        btn.style.gridRow = row;
        btn.style.gridColumn = col;
        btn.style.background = red.includes(num) ? 'red' : black.includes(num) ? 'black' : 'white';
        btn.style.color = red.includes(num) ? 'white' : black.includes(num) ? 'white' : 'black';
        betTable.appendChild(btn);
        num++;
      }
    }

    // Docenas y otras apuestas especiales (debajo de los números)
    const specials = [
      { type: 'dozen', value: '1ra docena', text: '1st 12', row: 4, col: 2, span: 4 },
      { type: 'dozen', value: '2da docena', text: '2nd 12', row: 4, col: 6, span: 4 },
      { type: 'dozen', value: '3ra docena', text: '3rd 12', row: 4, col: 10, span: 4 },
      { type: 'low', value: '1-18', text: '1-18', row: 5, col: 2, span: 2 },
      { type: 'parity', value: 'par', text: 'Even', row: 5, col: 4, span: 2 },
      { type: 'color', value: 'rojo', text: '🔴', row: 5, col: 6, span: 2 },
      { type: 'color', value: 'negro', text: '⚫', row: 5, col: 8, span: 2 },
      { type: 'parity', value: 'impar', text: 'Odd', row: 5, col: 10, span: 2 },
      { type: 'high', value: '19-36', text: '19-36', row: 5, col: 12, span: 2 }
    ];
    specials.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'bet-cell';
      btn.dataset.type = s.type;
      btn.dataset.value = s.value;
      btn.textContent = s.text;
      btn.style.gridRow = s.row;
      btn.style.gridColumn = `${s.col} / span ${s.span}`;
      betTable.appendChild(btn);
    });

    // --- FICHAS ---
    let selectedChipValue = 10;
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', function() {
        selectedChipValue = parseInt(this.dataset.value);
        document.getElementById('selected-chip').innerHTML = `Ficha seleccionada: <b>${selectedChipValue}</b>`;
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
      });
    });
    document.querySelector('.chip').classList.add('selected');

    // --- APUESTAS Y SALDO ---
    let saldo = 300;
    document.getElementById("saldo").innerHTML = `Saldo: $<b>${saldo}</b>`;
    let selectedBets = [];
    let history = [];
    let currentRotation = 0;

    betTable.addEventListener('click', function(e) {
      if (e.target.classList.contains('bet-cell')) {
        if (saldo < selectedChipValue) {
          alert("No tienes saldo suficiente para esa apuesta.");
          return;
        }
        saldo -= selectedChipValue;
        document.getElementById("saldo").innerHTML = `Saldo: $<b>${saldo}</b>`;

        const type = e.target.dataset.type;
        const value = e.target.dataset.value;
        let bet = selectedBets.find(b => b.type === type && b.value === value);
        if (bet) {
          bet.amount += selectedChipValue;
        } else {
          bet = { type, value, amount: selectedChipValue };
          selectedBets.push(bet);
        }
        // Mostrar la cantidad apostada en el botón (siempre el monto acumulado)
        e.target.querySelector('.bet-amount')?.remove();
        const span = document.createElement('span');
        span.className = 'bet-amount';
        span.textContent = bet.amount;
        e.target.appendChild(span);

        // Mostrar apuestas seleccionadas
        document.getElementById("result").textContent =
          selectedBets.length
            ? "Apuestas: " + selectedBets.map(b => `${b.type}: ${b.value} ($${b.amount})`).join(" | ")
            : "Selecciona tus apuestas";
      }
    });

    // --- GIRO Y RESULTADOS ---
    function spin() {
      const resultP = document.getElementById("result");
      const vueltas = 6;
      const randomAngle = Math.floor(Math.random() * 360);
      currentRotation += 360 * vueltas + randomAngle;
      svg.style.transform = `rotate(${currentRotation}deg)`;

      const degreesPerSector = 360 / total;
      const finalAngle = (360 - (currentRotation % 360) - 90 + 360) % 360;
      const index = Math.floor(finalAngle / degreesPerSector);
      const landedNumber = numbers[index];

      setTimeout(() => {
        const color = red.includes(landedNumber)
          ? "rojo"
          : black.includes(landedNumber)
          ? "negro"
          : "verde";
        const parity = landedNumber === 0 ? null : landedNumber % 2 === 0 ? "par" : "impar";
        let dozen = '';
        if (landedNumber >= 1 && landedNumber <= 12) dozen = '1ra docena';
        else if (landedNumber >= 13 && landedNumber <= 24) dozen = '2da docena';
        else if (landedNumber >= 25 && landedNumber <= 36) dozen = '3ra docena';

        let messages = [];
        let totalGanado = 0;
        if (selectedBets.length === 0) {
          messages.push(`Salió el ${landedNumber}`);
        } else {
          messages = selectedBets.map(bet => {
            let win = false, pago = 0;
            switch (bet.type) {
              case "number":
                win = parseInt(bet.value) === landedNumber;
                pago = 36;
                break;
              case "color":
                win = bet.value === color;
                pago = 2;
                break;
              case "parity":
                win = landedNumber !== 0 && bet.value === parity;
                pago = 2;
                break;
              case "dozen":
                win = bet.value === dozen;
                pago = 3;
                break;
              case "low":
                win = landedNumber >= 1 && landedNumber <= 18;
                pago = 2;
                break;
              case "high":
                win = landedNumber >= 19 && landedNumber <= 36;
                pago = 2;
                break;
              case "column":
                let colNum = parseInt(bet.value.replace('col',''));
                win = (landedNumber !== 0) && ((landedNumber - 1) % 3 === (colNum - 1));
                pago = 3;
                break;
            }
            if (win) {
              saldo += bet.amount * pago;
              totalGanado += bet.amount * pago;
            }
            return win
              ? `✅ ${bet.type} ${bet.value} ($${bet.amount}): ¡Ganaste $${bet.amount * pago}!`
              : `❌ ${bet.type} ${bet.value} ($${bet.amount}): Perdiste.`;
          });
        }
        resultP.innerHTML = messages.join("<br>");
        document.getElementById("saldo").innerHTML = `Saldo: $<b>${saldo}</b>`;

        // Agregar resultado al historial
        addToHistory(landedNumber);

        // Limpiar montos visuales y apuestas
        document.querySelectorAll('.bet-amount').forEach(el => el.remove());
        selectedBets = [];
      }, 4200);
    }

    // --- HISTORIAL ---
    function addToHistory(landedNumber) {
      const historyPile = document.getElementById("history-pile");
      const colorClass = red.includes(landedNumber)
        ? "red"
        : black.includes(landedNumber)
        ? "black"
        : "green";
      const chip = document.createElement("div");
      chip.className = `history-chip ${colorClass}`;
      chip.textContent = landedNumber;
      historyPile.prepend(chip);
      while (historyPile.childElementCount > 10) {
        historyPile.lastChild.remove();
      }
    }
