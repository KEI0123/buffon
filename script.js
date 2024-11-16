const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const loopRange = document.getElementById('loopRange');
const loopValue = document.getElementById('loopValue');
const runButton = document.getElementById('runButton');
const piValueElem = document.getElementById('pi-value');

// 解像度の向上
canvas.width = 1600;  // 実際の描画解像度
canvas.height = 1600; // 実際の描画解像度
canvas.style.width = '800px';  // 表示サイズ
canvas.style.height = '800px'; // 表示サイズ

const NUM_LINES = 12;
const LINE_SPACING = 120; // スケールを保つために倍率も同時に調整
const MAG = LINE_SPACING / 2;

loopRange.addEventListener('input', function () {
    loopValue.textContent = loopRange.value;
});

runButton.addEventListener('click', function () {
    simulate();
});

// ラインを描画
function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    for (let i = 0; i <= NUM_LINES; i++) {
        const y = i * LINE_SPACING + LINE_SPACING;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// ランダムな針を描画
function drawNeedle(midX, midY, endX, endY, collides) {
    ctx.strokeStyle = collides ? 'red' : 'black';
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

// ランダムな数を生成
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

// シミュレーション実行
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

    // 多倍長浮動小数点数で計算
    const Decimal = window.Decimal;
    const lengthDecimal = new Decimal(length);
    const loopDecimal = new Decimal(LOOP);
    const hitsDecimal = new Decimal(hits);
    const lineSpacingDecimal = new Decimal(LINE_SPACING);

    const piEstimate = lengthDecimal.times(2).times(loopDecimal).dividedBy(hitsDecimal.times(lineSpacingDecimal));
    piValueElem.innerText = `Estimated π value: ${piEstimate.toFixed(10)}`;
}

// 初回読み込み時にシミュレーションを実行する
simulate();
