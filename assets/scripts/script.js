'use strict';

const $body = document.querySelector('body');

const makeElem = (type, className, text= '') => {
    let el = document.createElement(type);
    el.classList.add(className);
    let textNode = document.createTextNode(text);
    el.appendChild(textNode);
    return el;
}

let $gameBoard = makeElem('div', 'game-board');
let $resetBTN = makeElem('button', 'reset-btn', 'New game');
let $saveGameBTN = makeElem('button', 'savegame-btn', 'Save game');

let counter = 0;
let $movesCount = makeElem('div', 'moves-count', String(counter));

let $fieldSize = makeElem('select', 'field-size');
for (let i=3;i<9;i++) {
    let option = new Option(`${i}x${i}`, `${i}x${i}`);
    $fieldSize.appendChild(option);
    if (i===4){option.selected = true}
}

window.addEventListener('DOMContentLoaded', () => {
    let game = new Game();
    game.init(4);
    $resetBTN.addEventListener('click', () => game.init(4));
    let cellsArr = game.init(4);
    $saveGameBTN.addEventListener('click', ()=>{
        game.saveGame(cellsArr)
    });
    $fieldSize.addEventListener('change', () =>{
        game.init($fieldSize.value.slice(0,1));
    })
})


$body.appendChild($gameBoard);
$body.appendChild($resetBTN);
$body.appendChild($saveGameBTN);
$body.appendChild($movesCount);
$body.appendChild($fieldSize);

let arr = [], ei,ej;


const swap = (arr,i1,j1,i2,j2) => {				
    let temp = arr[i1][j1];
	arr[i1][j1] = arr[i2][j2];
	arr[i2][j2] = temp;
}

const countMoves = () => {
    return counter++;

}

const get = (name, subst = null) => JSON.parse(window.localStorage.getItem(name) || subst);
const set =  (name, value) => window.localStorage.setItem(name, JSON.stringify(value));

function manhattan(pos0, pos1) {
    let d1 = Math.abs(pos1.x - pos0.x);
    let d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
}



function makeTimer() {
    let $timer = (!document.querySelector('.timer')) ? makeElem('div', 'timer') : document.querySelector('.timer');
    $body.appendChild($timer);
    let constDate = Date.parse(new Date());

    const checkTime = () => {
        let dateNow = Date.parse(new Date());
        let time = dateNow - constDate;
        time = time / 1000;
        
        $timer.innerHTML = `${String(Math.floor(time / 60))}:${String(Math.floor(time % 60))}`;

        setTimeout(checkTime, 1000);
    };
    setTimeout(checkTime, 1000);
}

class Cell {
    constructor(posX, posY, value, gridSize) {
        this.posX = posX;
        this.posY = posY;
        this.value = value;
        this.dom = this.makeCell();
        this.gridSize = gridSize;
    }

    makeCell() {
        let el = makeElem('div', 'cell', this.value);
        el.id = `${this.posX} ${this.posY}`;
        if (this.value === '') el.classList.add('empty');

        return el;
    }

    moveCell(e) {
        console.log(this);
        let event = e || window.e,
		emptyPrev = event.srcElement || event.target,
		i = emptyPrev.id.charAt(0),
        j = emptyPrev.id.charAt(2);

        if((i == ei && Math.abs(j - ej) == 1) || (j == ej && Math.abs(i - ei) == 1))
    {					
        let emptyNow = document.getElementById(`${ei} ${ej}`);

        emptyNow.innerHTML = emptyPrev.innerHTML;
        emptyNow.classList.remove('empty');

        emptyPrev.innerHTML = "";
        emptyPrev.classList.add('empty');
        countMoves();
        $movesCount.innerHTML = String(counter);
		ei = i;
		ej = j;
		let victory = true;
		for(i = 0; i < this.gridSize; ++i)
			for(j = 0; j < this.gridSize; ++j)
                if(i + j != (this.gridSize+2) && document.getElementById(`${i} ${j}`).innerHTML != i*(this.gridSize) + j + 1)
                {
					victory = false;
					break;
				}
				//if(victory) alert("Victory!");
	}
    }

    drag(cellDrag, cellDrop) {
        cellDrag.addEventListener('drag', this.moveCell);
        cellDrop.addEventListener('dragover', (e)=>e.preventDefault());
        cellDrop.addEventListener('drop', function() {this.appendChild(cellDrag)});
    }
}


class Game {
    init(size) {
        let $wrapper = makeElem('div', 'wrapper');

        $gameBoard.innerHTML = '';
        let cells = [];
        for(let i = 0; i < size; ++i){
            arr[i] = []
            for(let j = 0; j < size; ++j){
                arr[i][j] = (i + j != (size+2)) ? i*size + j + 1 : '';
            }
        }
        ei = size-1;
        ej = size-1;
        for(let i = 0; i < 1600; ++i)
            switch(Math.round((size-1)*Math.random())){
                case 0: if(ei != 0) swap(arr,ei,ej,--ei,ej); break; // up
                case 1: if(ej != (size-1)) swap(arr,ei,ej,ei, ++ej); break; // right
                case 2: if(ei != (size-1)) swap(arr,ei,ej,++ei,ej); break; // down
                case 3: if(ej != 0) swap(arr,ei,ej,ei,--ej); // left
            }
        for(let i = 0; i < size; ++i){
            let $row = makeElem('div', 'row');
            for(let j = 0; j < size; ++j){
                let cell = new Cell(i, j, arr[i][j], size);
                cell.dom.addEventListener('click', cell.moveCell);
                cell.dom.setAttribute('draggable', true);

                cell.drag(cell.dom, $row);
                cells.push(cell);
                $row.appendChild(cell.dom);
            }
            $wrapper.appendChild($row);					
        }

        $gameBoard.appendChild($wrapper);	
        
        //this.sizeField();
        makeTimer();
        this.solvePuzzle(cells);
        return cells;
    }

    saveGame(cells) {
        set('gameState', JSON.stringify(cells));
    }

    solvePuzzle(arrCells) {
        let arrSP = [];
        arrCells.forEach(item => {
            arrSP.push(item.value);
        });
        console.log(arrSP);
    }

    makeTimer() {       
        let timer = (!document.querySelector('.timer')) ? makeElem('div', 'timer') : document.querySelector('.timer');
        $body.appendChild(timer);
        console.log(timer);
        let date = new Date().toLocaleTimeString();
        let text = document.createTextNode(date);
        timer.innerHTML = date;
        setTimeout(this.makeTimer, 1000);
    }

    sizeField() {

           // game.init($fieldSize.value.slice(0,1));

    }
}
