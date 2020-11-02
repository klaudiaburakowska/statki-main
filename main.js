var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
var digits = [];
var gameState = "ukladanie";
var tableP = document.getElementById("playerTable");
var tableComputer = document.getElementById("computerTable");
var playerShips = [];
var Cell = /** @class */ (function () {
    function Cell(id, x, y, state) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.state = state;
    }
    return Cell;
}());
var Ship = /** @class */ (function () {
    function Ship(id, x, y) {
        this.startId = id;
        this.x = x;
        this.y = y;
    }
    Ship.prototype.check = function (x, y, isHorizontal, length, board) {
        if (isHorizontal) {
            if (+x + +length < 11) {
                for (var i = 0; i < length; i++) {
                    if (checkCells(x, y, board)) {
                        board.forEach(function (c) {
                            if (c.x == (+x + +i) && c.y == y) {
                                c.state = "ship";
                            }
                        });
                    }
                }
                return true;
            }
        }
    };
    return Ship;
}());
function checkCells(x, y, board) {
    var cells = board.filter(function (c) {
        c.x == x - 1 || c.x == x + 1 || c.y == y - 1 || c.y == y + 1;
    });
    var l = cells.filter(function (c) {
        c.state == "ship";
    }).length;
    if (l > 0) {
        console.log(l);
        return false;
    }
    return true;
}
var playerBoard = [];
var computerBoard = [];
var position = "none";
var shipsLength = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
var actualShip = 0;
function klik(x, y, source) {
    if (getGameState() == "ukladanie") {
        placeShip(1234, x, y, true);
    }
    else if (getGameState() == "game" && source == "c") {
        shoot(x, y, computerBoard);
    }
}
function reloadScreen(reload) {
    if (reload) {
        playerBoard.forEach(function (cell) {
            if (cell.state == "ship") {
                document.getElementById(cell.x.toString() + cell.y.toString()).setAttribute("onclick", undefined);
                document.getElementById(cell.x.toString() + cell.y.toString()).setAttribute("class", "ship");
            }
        });
        computerBoard.forEach(function (cell) {
            if (cell.state == "hit") {
                document.getElementById("c" + cell.x.toString() + cell.y.toString()).setAttribute("class", "hit");
            }
            if (cell.state == "marked") {
                document.getElementById("c" + cell.x.toString() + cell.y.toString()).setAttribute("class", "marked");
            }
        });
    }
}
function getGameState() {
    return gameState;
}
function placeShip(id, x, y, horizontal) {
    var tempShip = new Ship(id, x, y);
    if (tempShip.check(x, y, horizontal, shipsLength[actualShip], playerBoard)) {
        reloadScreen(true);
        actualShip++;
    }
    if (actualShip > 9) {
        removeClickable();
        gameState = "game";
        alert("Ustawiono wszystkie statki");
    }
}
function removeClickable() {
    playerBoard.forEach(function (cell) {
        document.getElementById(cell.x.toString() + cell.y.toString()).setAttribute("onclick", "");
    });
}
function shoot(x, y, board) {
    var cell;
    board.forEach(function (c) {
        if (c.x == x && c.y == y)
            cell = c;
    });
    if (cell.state == "ship") {
        cell.state = "hit";
    }
    else {
        cell.state = "marked";
    }
    reloadScreen(true);
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function placeComputerShips() {
    alert("COMPUTER");
    var placedShips = 0;
    while (placedShips <= 9) {
        var x = getRandomInt(0, 10);
        var y = getRandomInt(0, 10);
        var tempShip = new Ship(4321, x, y);
        if (tempShip.check(x, y, true, shipsLength[actualShip], computerBoard)) {
            console.log("ustawiono statek o dlugosci: " + shipsLength[actualShip]);
            reloadScreen(true);
            actualShip++;
            placedShips++;
        }
    }
    if (placedShips > 9) {
        actualShip = 0;
    }
}
init();
function init() {
    for (var i_1 = 1; i_1 <= 10; i_1++) {
        digits.push(i_1.toString());
    }
    var row = tableP.insertRow();
    var rowC = tableComputer.insertRow();
    row.insertCell();
    rowC.insertCell();
    for (var a = 0; a < 10; a++) {
        var cell = row.insertCell();
        cell.innerText = letters[a];
        var cellC = rowC.insertCell();
        cellC.innerText = letters[a];
    }
    for (var j = 0; j < 10; j++) {
        var row_1 = tableP.insertRow();
        var rowComputer = tableComputer.insertRow();
        var cell = row_1.insertCell();
        cell.innerText = digits[j];
        var cellC = rowComputer.insertCell();
        cellC.innerText = digits[j];
        for (var i = 0; i < 10; i++) {
            var cell_1 = row_1.insertCell();
            cell_1.setAttribute("id", +i + "" + j);
            cell_1.setAttribute("x", i.toString());
            cell_1.setAttribute("y", j.toString());
            cell_1.setAttribute("onclick", "klik(\"" + i + "\",\"" + j + "\",\"p\")");
            var cellComputer = rowComputer.insertCell();
            cellComputer.setAttribute("id", "c" + i + "" + j);
            cellComputer.setAttribute("onclick", "klik(\"" + i + "\",\"" + j + "\",\"c\")");
            console.log(i + " " + j);
            playerBoard.push(new Cell(i + "" + j, i, j, "new"));
            computerBoard.push(new Cell(i + "" + j, i, j, "new"));
        }
    }
    placeComputerShips();
}
