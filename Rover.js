fs = require('fs');

function calculateRoverPath(map) {
    let inputMap = map;

    var errorMessage = "";

    if (inputMap[0][0] === "X" || inputMap[0][0] === "x") {
        errorMessage = " Rover can't start form X position!";
        outputTxt(errorMessage);
        return;
    }

    if (inputMap[inputMap.length - 1][inputMap[0].length - 1] === "X" || inputMap[inputMap.length - 1][inputMap[0].length - 1] === "x") {
        errorMessage = " Rover can't find the end of the path!";
        outputTxt(errorMessage);
        return;
    }

    for (let i = 0; i < inputMap.length; i++) {
        for (let j = 0; j < inputMap[0].length; j++) {
            if (inputMap[i][j] === "") {
                errorMessage = "Something wrong with map data! One or more elements are empty";
                outputTxt(errorMessage);
                return;
            }
            if (inputMap[i][j] === "X" || inputMap[i][j] === "x") {
                inputMap[i][j] = NaN
            } else {
                inputMap[i][j] = parseInt(inputMap[i][j], 10);
            }
        }
    } // x -> nan 


    let n = inputMap[0].length * inputMap.length;
    let weight = 0;
    let adjacencyMatrix = [];

    for (let i = 0; i <= n - 1; i++) {
        adjacencyMatrix[i] = [];

    }

    for (let i = 0; i < inputMap.length; i++) {
        for (let j = 0; j < inputMap[0].length; j++) {
            let currV = i * inputMap[0].length + j
            if (i + 1 < inputMap.length && !(isNaN(i + 1))) { // hod vniz
                destV = (i + 1) * inputMap.length + j
                adjacencyMatrix[currV].push([destV, Math.abs(inputMap[i][j] - inputMap[i + 1][j]) + 1])
            }
            if (i - 1 >= 0 && !(isNaN(i - 1))) { // hod verh
                destV = (i - 1) * inputMap.length + j
                adjacencyMatrix[currV].push([destV, Math.abs(inputMap[i][j] - inputMap[i - 1][j]) + 1])
            }
            if (j + 1 < inputMap[0].length && !(isNaN(j + 1))) { // hod pravo
                destV = i * inputMap.length + j + 1
                adjacencyMatrix[currV].push([destV, Math.abs(inputMap[i][j] - inputMap[i][j + 1]) + 1])
            }
            if (j - 1 >= 0 && !(isNaN(j - 1))) { // hod levo
                destV = i * inputMap.length + j - 1
                adjacencyMatrix[currV].push([destV, Math.abs(inputMap[i][j] - inputMap[i][j - 1]) + 1])
            }
            if (i + 1 < inputMap.length) { // hod vniz 
                if (j + 1 < inputMap[0].length && !(isNaN(j + 1))) { //pravo
                    destV = (i + 1) * inputMap.length + j + 1
                    adjacencyMatrix[currV].push([destV, Math.abs(inputMap[i][j] - inputMap[i + 1][j + 1]) + 1])
                }
                if (j - 1 >= 0 && !(isNaN(j + 1))) { //levo
                    destV = (i + 1) * inputMap.length + j - 1
                    adjacencyMatrix[currV].push([destV, Math.abs(inputMap[i][j] - inputMap[i + 1][j - 1]) + 1])
                }
            }
            if (i - 1 >= 0) { // hod verh
                if (j + 1 < inputMap[0].length && !(isNaN(j + 1))) { //pravo
                    destV = (i - 1) * inputMap.length + j + 1
                    adjacencyMatrix[currV].push([destV, Math.abs(inputMap[i][j] - inputMap[i - 1][j + 1]) + 1])
                }
                if (j - 1 >= 0 && !(isNaN(j - 1))) { //levo
                    destV = (i - 1) * inputMap.length + j - 1
                    adjacencyMatrix[currV].push([destV, Math.abs(inputMap[i][j] - inputMap[i - 1][j - 1]) + 1])
                }
            }
        }
    }

    n = adjacencyMatrix.length;
    let s = 0; //start point 

    let d = [];
    for (let i = 0; i < n; i++) {
        d[i] = Infinity;
    }

    let p = [];
    let u = [];

    for (let i = 0; i < n; i++) {
        u[i] = false;
    }

    d[s] = 0

    for (let i = 0; i < n; i++) {
        let v = -1;
        for (let j = 0; j < n; j++) {
            if (!u[j] && (v === -1 || d[j] < d[v])) {
                v = j;
            }
        }

        if (v === -1 || d[v] === Infinity) {
            break
        }

        u[v] = true;

        for (let j = 0; j < adjacencyMatrix[v].length; j++) {
            let to = adjacencyMatrix[v][j][0]
            let len = adjacencyMatrix[v][j][1];
            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                p[to] = v;
            }
        }
    }

    if (d[d.length - 1] === Infinity) {
        errorMessage = "There is no way through the map!";
        outputTxt(errorMessage);
        return;
    }

    let path = [];
    v = n - 1;

    while (v != 0) {
        path.push(v);
        v = p[v];
    }

    path.push(0);
    path.reverse();

    let mapPath = [];

    for (let i = 0; i < path.length; i++) {
        v = path[i];
        let j = v % (inputMap[0].length);
        let k = (v - j) / (inputMap[0].length);
        mapPath.push(`[${k}][${j}]`);
    }

    let steps = mapPath.length - 1;
    let fuel = d[inputMap.length * inputMap[0].length - 1];
    mapPath = mapPath.toString().split(",").join("->");
    var text = `${mapPath} \n fuel: ${fuel} \n steps: ${steps}`;
    outputTxt(text);
}

function outputTxt(text) {
    fs.open('path-plan.txt', 'w', (err) => {
        if (err) throw err;
        fs.writeFile("path-plan.txt", text, function() {});
    });;
}

module.exports = {
    calculateRoverPath,
};