let letters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let digits: string[] = [];
let gameState: string = "ukladanie";
let tableP: HTMLTableElement = <HTMLTableElement>document.getElementById("playerTable");
let tableComputer: HTMLTableElement = <HTMLTableElement>document.getElementById("computerTable");
let playerShips: Ship[] = [];

class Cell {
    id: string;
    x: number;
    y: number;
    state: string;

    constructor(id: string, x: number, y: number, state: string) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.state = state;
    }
}

class Ship {
    startId: number;
    horizontal: boolean;
    length: number;
    x: number;
    y: number;
    constructor(id: number, x: number, y: number) {
        this.startId = id;
        this.x = x;
        this.y = y;
    }
    public check(x: number, y: number, isHorizontal: boolean, length: number, board: Cell[]): boolean {
        if (isHorizontal) {
            if (+x + +length < 11) {
                for (var i = 0; i < length; i++) {
                    if (checkCells(x, y, board)) {
                        board.forEach(c => {
                            if (c.x == (+x + +i) && c.y == y) {
                                c.state = "ship";
                            }
                        });
                    }
                }
                return true;
            }
        }
    }
}

function checkCells(x: number, y: number, board: Cell[]): boolean {
    let cells: Cell[] = board.filter(c => {
        c.x == x - 1 || c.x == x + 1 || c.y == y - 1 || c.y == y + 1;
    });
    var l = cells.filter(c => {
        c.state == "ship";
    }).length;
    if (l > 0){
        console.log(l);
     return false;
    }
    return true;
}

let playerBoard: Cell[] = [];
let computerBoard: Cell[] = [];
let position: string = "none";
let shipsLength = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
let actualShip = 0;

function klik(x: number, y: number, source: string) {
    if(getGameState() == "ukladanie"){
            placeShip(1234, x, y, true);
    }
    else if(getGameState() == "game" && source == "c"){
            shoot(x,y,computerBoard);       
    }
}


function reloadScreen(reload: boolean) {
    if (reload) {
        playerBoard.forEach(cell => {
            if (cell.state == "ship") {
                document.getElementById(cell.x.toString() + cell.y.toString()).setAttribute("onclick", undefined);
                document.getElementById(cell.x.toString() + cell.y.toString()).setAttribute("class", "ship");
            }
        })
        computerBoard.forEach(cell => {
         
            if(cell.state == "hit"){
                document.getElementById("c" + cell.x.toString() + cell.y.toString()).setAttribute("class", "hit");
            }
            if(cell.state == "marked"){
                document.getElementById("c" + cell.x.toString() + cell.y.toString()).setAttribute("class", "marked");
            }
        })
    }
}

function getGameState() {
    return gameState;
}

function placeShip(id: number, x: number, y: number, horizontal: boolean) {
    let tempShip: Ship = new Ship(id, x, y);
    if (tempShip.check(x, y, horizontal, shipsLength[actualShip], playerBoard)) {
        reloadScreen(true);
        actualShip++;
    }
    if(actualShip >9){
        removeClickable();
        gameState = "game";
        alert("Ustawiono wszystkie statki");
    }
}
function removeClickable(){
    playerBoard.forEach(cell =>{
        document.getElementById(cell.x.toString() + cell.y.toString()).setAttribute("onclick", "");
    })
}

function shoot(x: number, y: number, board: Cell[]){
    let cell;
    board.forEach(c =>{
        if(c.x == x && c.y == y) cell = c;
    });
    if(cell.state == "ship"){
        cell.state = "hit";
    }
    else{
        cell.state = "marked";
    }
    reloadScreen(true);
}

function getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function placeComputerShips() {
    alert("COMPUTER");
    let placedShips = 0;
    while (placedShips <= 9) {
        let x = getRandomInt(0, 10);
        let y = getRandomInt(0, 10);
        let tempShip: Ship = new Ship(4321, x, y);
        if (tempShip.check(x, y, true, shipsLength[actualShip], computerBoard)) {
            console.log("ustawiono statek o dlugosci: " + shipsLength[actualShip]);
            reloadScreen(true);
            actualShip++;
            placedShips++;
        }
        
    }
    if(placedShips > 9){
        actualShip = 0;
    } 
}


init();



function init() {
    for (let i = 1; i <= 10; i++) {
        digits.push(i.toString());
    }
    let row = tableP.insertRow();
    let rowC = tableComputer.insertRow();
    row.insertCell();
    rowC.insertCell();
    for (let a = 0; a < 10; a++) {
        let cell = row.insertCell();
        cell.innerText = letters[a];
        let cellC = rowC.insertCell();
        cellC.innerText = letters[a];

    }
    for (var j = 0; j < 10; j++) {
        let row = tableP.insertRow();
        let rowComputer = tableComputer.insertRow();

        let cell = row.insertCell();
        cell.innerText = digits[j];
        let cellC = rowComputer.insertCell();
        cellC.innerText = digits[j];
        for (var i = 0; i < 10; i++) {
            let cell = row.insertCell();
            cell.setAttribute("id", + i + "" + j);
            cell.setAttribute("x", i.toString());
            cell.setAttribute("y", j.toString());
            cell.setAttribute("onclick", "klik(\"" + i + "\",\"" + j + "\",\"p\")");
            let cellComputer = rowComputer.insertCell();
            cellComputer.setAttribute("id", "c" + i + "" + j)
            cellComputer.setAttribute("onclick", "klik(\"" + i + "\",\"" + j + "\",\"c\")");
            console.log(i + " " + j);
            playerBoard.push(new Cell(i + "" + j, i, j, "new"));
            computerBoard.push(new Cell(i + "" + j, i, j, "new"));
        }
    }
    placeComputerShips();
} 