const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const loopRange = document.getElementById('loopRange');
const loopValue = document.getElementById('loopValue');
const runButton = document.getElementById('runButton');
const piValueElem = document.getElementById('pi-value');

const NUM_LINES = 12;
const LINE_SPACING = 120;
const MAG = LINE_SPACING / 2;

// 解像度の向上
canvas.width = LINE_SPACING * (NUM_LINES + 1);  // 実際の描画解像度
canvas.height = LINE_SPACING * (NUM_LINES + 1); // 実際の描画解像度
canvas.style.width = '780px';  // 表示サイズ
canvas.style.height = '780px'; // 表示サイズ

loopRange.addEventListener('input', function () {
    loopValue.textContent = loopRange.value;
});

runButton.addEventListener('click', function () {
    simulate();
});

// スクロールイベントリスナーを追加
loopRange.addEventListener('wheel', function (event) {
    event.preventDefault();
    const step = Math.sign(event.deltaY);
    let newValue = parseInt(loopRange.value) + step * -100;
    newValue = Math.max(loopRange.min, Math.min(loopRange.max, newValue));
    loopRange.value = newValue;
    loopValue.textContent = loopRange.value;
});

function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    for (let i = 0; i < NUM_LINES; i++) {
        const y = i * LINE_SPACING + LINE_SPACING;
        ctx.beginPath();
        ctx.moveTo(LINE_SPACING, y);
        ctx.lineTo(canvas.width - LINE_SPACING, y);
        ctx.stroke();
    }
}

function drawNeedle(midX, midY, endX, endY, collides) {
    ctx.strokeStyle = collides ? 'red' : 'black';
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function simulate() {
    const LOOP = parseInt(loopRange.value);
    drawLines();
    let hits = 0;

    for (let i = 0; i < LOOP; i++) {
        const midX = getRandom(LINE_SPACING, canvas.width - LINE_SPACING);
        const midY = getRandom(LINE_SPACING, canvas.height - LINE_SPACING);
        const angle = getRandom(0, 2 * Math.PI);
        const length = LINE_SPACING / 2;
        const endX = midX + Math.cos(angle) * length;
        const endY = midY + Math.sin(angle) * length;

        const minY = Math.min(midY, endY);
        const maxY = Math.max(midY, endY);

        let collides = false;
        for (let j = 0; j <= NUM_LINES; j++) {
            const lineY = j * LINE_SPACING + LINE_SPACING;
            if (minY <= lineY && maxY >= lineY) {
                collides = true;
                hits++;
                break;
            }
        }

        drawNeedle(midX, midY, endX, endY, collides);
    }

    if (hits === 0) {
        piValueElem.innerText = `No hits detected, unable to calculate π.`;
        return;
    }

    const piEstimate = LOOP / hits;
    piValueElem.innerText = `π : ${piEstimate.toFixed(15)}`;
}

// 初回読み込み時にシミュレーションを実行する
simulate();
