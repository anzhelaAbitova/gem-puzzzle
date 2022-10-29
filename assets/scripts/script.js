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
let $wrapper = makeElem('div', 'wrapper');

window.addEventListener('DOMContentLoaded', () => {
	newGame();				
	$resetBTN.addEventListener('click', () => newGame);
})

$body.appendChild($gameBoard);
$body.appendChild($resetBTN);

let arr = [], ei,ej;

const swap = (arr,i1,j1,i2,j2) => {				
    let temp = arr[i1][j1];
	arr[i1][j1] = arr[i2][j2];
	arr[i2][j2] = temp;
}

const cellClick = (e) => {

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
const newGame = () => {			
	for(i = 0; i < 4; ++i){
		arr[i] = []
		for(j = 0; j < 4; ++j){
            arr[i][j] = (i + j != 6) ? i*4 + j + 1 : '';
		}
    }
    console.log(arr)
	ei = 3;
	ej = 3;
	for(i = 0; i < 1600; ++i)
		switch(Math.round(3*Math.random())){
			case 0: if(ei != 0) swap(arr,ei,ej,--ei,ej); break; // up
			case 1: if(ej != 3) swap(arr,ei,ej,ei, ++ej); break; // right
			case 2: if(ei != 3) swap(arr,ei,ej,++ei,ej); break; // down
			case 3: if(ej != 0) swap(arr,ei,ej,ei,--ej); // left
		}
	for(i = 0; i < 4; ++i){
		let $row = makeElem('div', 'row');
		for(j = 0; j < 4; ++j){
			let $cell = makeElem('div', 'cell', arr[i][j]);
				$cell.id = `${i} ${j}`;
				$cell.onclick = cellClick;
                //let newCell = new Cell();
                //console.log(newCell)
				$row.appendChild($cell);
		}
		$wrapper.appendChild($row);					
	}
	if($gameBoard.childNodes.length == 1)
    $gameBoard.removeChild($gameBoard.firstChild);	
	$gameBoard.appendChild($wrapper);	
}

class Cell {
    constructor(arr, i, j) {
        this.id = `${i} ${j}`;
        this.innerHTML = arr[i][j];
    }
}

class Game {
    init() {

    }
}