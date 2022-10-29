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

window.addEventListener('DOMContentLoaded', () => {
    let game = new Game();
    game.init();
	$resetBTN.addEventListener('click', () => game.init());
})

$body.appendChild($gameBoard);
$body.appendChild($resetBTN);

let arr = [], ei,ej;

const swap = (arr,i1,j1,i2,j2) => {				
    let temp = arr[i1][j1];
	arr[i1][j1] = arr[i2][j2];
	arr[i2][j2] = temp;
}

function makeTimer() {
    let $timer = (!document.querySelector('.timer')) ? makeElem('div', 'timer') : document.querySelector('.timer');
    $body.appendChild($timer);
    //console.log(timer);
    let constDate = Date.parse(new Date());
    $timer.innerHTML = constDate;

    //console.log(constDate)
    return function(constDate){
        console.log('work')
        let dateNow = Date.parse(new Date());
        let time = String(dateNow - constDate);
        $timer.innerHTML = time.replace(/$0{3}/);

        console.log(time);
        setTimeout(makeTimer, 1000);
    }

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

let testcell = new Cell(0, 0, 2);
console.log(testcell);

class Game {
    init() {
        let $wrapper = makeElem('div', 'wrapper');
        $gameBoard.innerHTML = '';
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
                let $cell = makeElem('div', 'cell', arr[i][j]);
                    $cell.id = `${i} ${j}`;
                    $cell.onclick = this.moveCell;

                    $row.appendChild($cell);
                    if (arr[i][j] === '') $cell.classList.add('empty');
                    this.dragNDrop($cell, $row);
            }
            $wrapper.appendChild($row);					
        }
        if($gameBoard.childNodes.length == 1)
        $gameBoard.removeChild($gameBoard.firstChild);	
        $gameBoard.appendChild($wrapper);	

        let date = Date.parse(new Date());
        makeTimer(date);
    }

    moveCell(e) {
        let event = e || window.e,
		el = event.srcElement || event.target,
		i = el.id.charAt(0),
        j = el.id.charAt(2);
    console.log(ei)
        if((i == ei && Math.abs(j - ej) == 1) || (j == ej && Math.abs(i - ei) == 1))
    {					
		document.getElementById(`${ei} ${ej}`).innerHTML = el.innerHTML;
		el.innerHTML = "";
		ei = i;
		ej = j;
		let q = true;
		for(i = 0; i < 4; ++i)
			for(j = 0; j < 4; ++j)
                if(i + j != 6 && document.getElementById(`${i} ${j}`).innerHTML != i*4 + j + 1)
                {
					q = false;
					break;
				}
				if(q) alert("Victory!");
	}
    }

    dragNDrop(cell, row) {

        let currentDroppable = null;
        cell.onmousedown = function(event) {
    
          let shiftX = event.clientX - cell.getBoundingClientRect().left;
          let shiftY = event.clientY - cell.getBoundingClientRect().top;
    
          cell.style.position = 'absolute';
          cell.style.zIndex = 1000;
          row.append(cell);
    
          moveAt(event.pageX, event.pageY);
    
          function moveAt(pageX, pageY) {
            cell.style.left = pageX - cell.offsetWidth / 2 + 'px';
            cell.style.top = pageY - cell.offsetHeight / 2 + 'px';
          }
    
          function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
    
            cell.hidden = true;
            let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            cell.hidden = false;
    
            if (!elemBelow) return;
    
            let droppableBelow = elemBelow.closest('.empty');
            if (currentDroppable != droppableBelow) {
              if (currentDroppable) { 
                leaveDroppable(currentDroppable);
              }
              currentDroppable = droppableBelow;
              if (currentDroppable) { 
                enterDroppable(currentDroppable);
              }
            }
          }
    
          document.addEventListener('mousemove', onMouseMove);
    
          cell.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            cell.onmouseup = null;
          };
    
        };
    
        const enterDroppable = (elem) => elem.style.background = 'pink';
        const leaveDroppable = (elem) => elem.style.background = '';
    
        cell.ondragstart = () => false;
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
}
