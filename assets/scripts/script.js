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

let $fieldSize = makeElem('select', 'field-size', 'Choose size of the field');
for (let i=3;i<9;i++) {
    let option = new Option(`${i}x${i}`, `${i}x${i}`);
    $fieldSize.appendChild(option);
    if (i===4){option.selected = true}
}

window.addEventListener('DOMContentLoaded', () => {
    let game = new Game();
    game.init();
    $resetBTN.addEventListener('click', () => game.init());
    let cellsArr = game.init();
    $saveGameBTN.addEventListener('click', ()=>{
        game.saveGame(cellsArr)
    });
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
    constructor(posX, posY, value) {
        this.posX = posX;
        this.posY = posY;
        this.value = value;
        this.dom = this.makeCell();
    }

    makeCell() {
        let el = makeElem('div', 'cell', this.value);
        el.id = `${this.posX} ${this.posY}`;
        if (this.value === '') el.classList.add('empty');

        return el;
    }
}


class Game {
    init() {
        let $wrapper = makeElem('div', 'wrapper');
        $gameBoard.innerHTML = '';
        let cells = [];
        for(let i = 0; i < 4; ++i){
            arr[i] = []
            for(let j = 0; j < 4; ++j){
                arr[i][j] = (i + j != 6) ? i*4 + j + 1 : '';
            }
        }
        ei = 3;
        ej = 3;
        for(let i = 0; i < 1600; ++i)
            switch(Math.round(3*Math.random())){
                case 0: if(ei != 0) swap(arr,ei,ej,--ei,ej); break; // up
                case 1: if(ej != 3) swap(arr,ei,ej,ei, ++ej); break; // right
                case 2: if(ei != 3) swap(arr,ei,ej,++ei,ej); break; // down
                case 3: if(ej != 0) swap(arr,ei,ej,ei,--ej); // left
            }
        for(let i = 0; i < 4; ++i){
            let $row = makeElem('div', 'row');
            for(let j = 0; j < 4; ++j){
                let cell = new Cell(i, j, arr[i][j]);
                cell.dom.addEventListener('click', this.moveCell);
                cell.dom.setAttribute('draggable', true);

                this.drag(cell.dom, $row);
                cells.push(cell);
                $row.appendChild(cell.dom);
            }
            $wrapper.appendChild($row);					
        }

        $gameBoard.appendChild($wrapper);	
        
        this.sizeField();
        makeTimer();
        return cells;
    }

    moveCell(e) {
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
		for(i = 0; i < 4; ++i)
			for(j = 0; j < 4; ++j)
                if(i + j != 6 && document.getElementById(`${i} ${j}`).innerHTML != i*4 + j + 1)
                {
					victory = false;
					break;
				}
				if(victory) alert("Victory!");
	}
    }

    drag(cellDrag, cellDrop) {
        cellDrag.addEventListener('drag', this.moveCell);
        cellDrop.addEventListener('dragover', (e)=>e.preventDefault());
        cellDrop.addEventListener('drop', function() {this.appendChild(cellDrag)});
    }

    saveGame(cells) {
        set('gameState', JSON.stringify(cells));
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
        $fieldSize.addEventListener('change', ()=>{
            console.log($fieldSize.value);

        })
    }
}
