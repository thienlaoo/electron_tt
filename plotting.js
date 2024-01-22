function generateRandomArray(rows, cols) {
    const z_data = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(Math.random() * 10);
        }
        z_data.push(row);
    }
    return z_data;
}
function createLayout() {
    return {
        title: 'Dynamic 3D Plot',
        scene: {
            xaxis: { title: 'X Axis' },
            yaxis: { title: 'Y Axis' },
            zaxis: { title: 'Z Axis' }
        },
        autosize: false,
        width: 800,
        height: 600,
        margin: {
            l: 65,
            r: 50,
            b: 65,
            t: 90
        }
    };
}

function createData(zData) {
    return [{
        z: zData,
        type: 'surface'
    }];
}
function updatePlot(data, zData, layout) {
    data[0].z.push(zData);

    if (data[0].z.length > 10) {
        data[0].z.shift();
    }

    Plotly.newPlot('myDiv', data, layout);
}

function resetPlot(rows, cols) {
    const zeroData = Array.from({ length: rows }, () => Array(cols).fill(0));
    Plotly.update('myDiv', { z: [zeroData] });
}

function generateNewPlot(rows, cols) {
    const newData = generateRandomArray(rows, cols);
    Plotly.update('myDiv', { z: [newData] });
}

function toggleAnimationButton(animationRunning, data, layout) {
    const button = document.getElementById('toggleAnimationButton');
    const resetButton = document.getElementById('resetButton');
    const generateButton = document.getElementById('generateButton');

    let animationIteration = 0;
    const maxIterations = 16;

    animationRunning = !animationRunning;

    if (animationRunning) {
        button.textContent = 'Stop Animation';
        resetButton.disabled = true;
        generateButton.disabled = true;

        const animationInterval = setInterval(() => {
            const newData = generateRandomArray(20, 20);
            updatePlot(data, newData, layout);

            animationIteration++;

            if (animationIteration >= maxIterations) {
                clearInterval(animationInterval);
                button.textContent = 'Start Animation';
                resetButton.disabled = false;
                generateButton.disabled = false;
            }
        }, 1000);

        return animationInterval;
    } else {
        button.textContent = 'Start Animation';
        resetButton.disabled = false;
        generateButton.disabled = false;
        clearInterval(animationInterval);
        return null;
    }
}

const initialData = generateRandomArray(20, 20);
const initialLayout = createLayout();
const initialDataArray = createData(initialData);

Plotly.newPlot('myDiv', initialDataArray, initialLayout);

let animationInterval;
let animationRunning = false;

document.getElementById('toggleAnimationButton').addEventListener('click', function () {
    animationInterval = toggleAnimationButton(animationRunning, initialDataArray, initialLayout);
    animationRunning = !animationRunning;
});

document.getElementById('resetButton').addEventListener('click', function () {
    resetPlot(20, 20);
});

document.getElementById('generateButton').addEventListener('click', function () {
    generateNewPlot(20, 20);
});