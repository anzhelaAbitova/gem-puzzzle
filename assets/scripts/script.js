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
let $gameMenu = makeElem('div', 'game-menu');
let $audio = makeElem('audio', 'cells-audio');
let $lowerGameMenu = makeElem('div', 'game-menu');
let $imagesPuzzleBTN = makeElem('button', 'images-puzzle', 'Images puzzle');

let counter = 0;
let $movesCount = makeElem('div', 'moves-count', String(counter));

let $fieldSize = makeElem('select', 'field-size');

let $solvePuzzleBTN = makeElem('button', 'solve-puzzle', 'Solve puzzle');
for (let i=3;i<9;i++) {
    let option = new Option(`${i}x${i}`, `${i}x${i}`);
    $fieldSize.appendChild(option);
    if (i===4){option.selected = true}
}

$body.prepend($gameBoard);
$body.prepend($gameMenu);
$body.prepend($audio);
$audio.src = 'sound.mp3';
$body.appendChild($lowerGameMenu);

$gameMenu.appendChild($resetBTN);
$gameMenu.appendChild($saveGameBTN);
$gameMenu.appendChild($movesCount);
$gameMenu.appendChild($fieldSize);
$gameMenu.appendChild($solvePuzzleBTN);

$lowerGameMenu.appendChild($imagesPuzzleBTN);

let arr = [], ei,ej;

function makeArrDeep (arr, width){
    return arr.reduce((rows, key, index) => (index % width == 0 ? rows.push([key]) : rows[rows.length-1].push(key)) && rows, []);
};

function chunk (arr, size) {
  var res = []; 
  for(var i=0;i < arr.length;i = i+size)
  res.push(arr.slice(i,i+size));
  console.log(arr.slice(i,i+size))
  return res;
}

const playSound = (e) => {
    $audio.currentTime = 0;
    $audio.play();
}

const swap = (arr,i1,j1,i2,j2) => {		
    //console.log(i1)
		
    let temp = arr[i1][j1];
	arr[i1][j1] = arr[i2][j2];
    arr[i2][j2] = temp;
    return {i1,j1,i2,j2};
}

const unswap = (item, empty) =>{
    let temp = empty;
	empty = item;
    item = temp;
    return item;
}

const countMoves = () => {
    return counter++;
}

function getValuesCells(arr) {
    let result = [];
    arr.forEach(item => {
        result.push(item.value);
    });
    return result;
}

const get = (name, subst = null) => JSON.parse(window.localStorage.getItem(name) || subst);
const set =  (name, value) => window.localStorage.setItem(name, JSON.stringify(value));

function manhattan(pos0, pos1) {

    let d1 = Math.abs(pos1.posX - pos0.posX);
    let d2 = Math.abs(pos1.posY - pos0.posY);
    return d1 + d2;
}

function unduplicate(arr) {
    let result=[];
    for(let i=0;i<arr.length;i++) {
        if (arr[i]===arr[i+1]) {
            continue
        }
        else {
            result.push(arr[i])

        }
    }
    return result;
}


function makeTimer() {
    let $timer = (!document.querySelector('.timer')) ? makeElem('div', 'timer') : document.querySelector('.timer');
    $timer.innerHTML = '';
    $gameMenu.appendChild($timer);
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
    constructor(posX, posY, value, order, gridSize) {
        this.posX = posX;
        this.posY = posY;
        this.value = value;
        this.dom = this.makeCell();
        this.order = order;
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
		emptyPrev = this || event.srcElement || event.target,
		i = (this.posX >= 0) ? this.posX : emptyPrev.id.charAt(0),
        j = (this.posY >= 0) ? this.posY : emptyPrev.id.charAt(2);


        if((i == ei && Math.abs(j - ej) == 1) || (j == ej && Math.abs(i - ei) == 1))
    {					
        let emptyNow = document.getElementById(`${ei} ${ej}`);
        console.log(i);

        emptyNow.value = emptyPrev.value;
        emptyNow.innerHTML = emptyPrev.dom.innerHTML;
        emptyNow.classList.remove('empty');


        if (j - ej === 1 && i - ei === 0) {
            emptyNow.style.transform = 'translate(0, 0)';

        }

        emptyPrev.dom.innerHTML = "";
        emptyPrev.value = '';
        emptyPrev.dom.classList.add('empty');
        countMoves();
        playSound();
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

/**
 * Finds the shortest distance between two nodes using the A-star (A*) algorithm
 * @param graph an adjacency-matrix-representation of the graph where (x,y) is the weight of the edge or 0 if there is no edge.
 * @param heuristic an estimation of distance from node x to y that is guaranteed to be lower than the actual distance. E.g. straight-line 
 * distance
 * @param start the node to start from.
 * @param goal the node we're searching for
 * @return The shortest distance to the goal node. Can be easily modified to return the path.
 */

const aStar = function (graph, heuristic, start, goal) {

    //This contains the distances from the start node to all other nodes
    let distances = [];
    //Initializing with a distance of "Infinity"
    for (let i = 0; i < graph.length; i++) distances[i] = Number.MAX_VALUE;
    //The distance from the start node to itself is of course 0
    distances[start] = 0;

    //This contains the priorities with which to visit the nodes, calculated using the heuristic.
    let priorities = [];
    //Initializing with a priority of "Infinity"
    for (let i = 0; i < graph.length; i++) priorities[i] = Number.MAX_VALUE;
    //start node has a priority equal to straight line distance to goal. It will be the first to be expanded.
    console.log(heuristic)
    priorities[start] = heuristic[start][goal];

    //This contains whether a node was already visited
    let visited = [];

    //While there are nodes left to visit...
    while (true) {

        // ... find the node with the currently lowest priority...
        let lowestPriority = Number.MAX_VALUE;
        let lowestPriorityIndex = -1;
        for (let i = 0; i < priorities.length; i++) {
            //... by going through all nodes that haven't been visited yet
            if (priorities[i] < lowestPriority && !visited[i]) {
                lowestPriority = priorities[i];
                lowestPriorityIndex = i;
            }
        }

        if (lowestPriorityIndex === -1) {
            // There was no node not yet visited --> Node not found
            return -1;
        } else if (lowestPriorityIndex === goal) {
            // Goal node found
            // console.log("Goal node found!");
            return distances[lowestPriorityIndex];
        }

        // console.log("Visiting node " + lowestPriorityIndex + " with currently lowest priority of " + lowestPriority);

        //...then, for all neighboring nodes that haven't been visited yet....
        for (let i = 0; i < graph[lowestPriorityIndex].length; i++) {
            if (graph[lowestPriorityIndex][i] !== 0 && !visited[i]) {
                //...if the path over this edge is shorter...
                if (distances[lowestPriorityIndex] + graph[lowestPriorityIndex][i] < distances[i]) {
                    //...save this path as new shortest path
                    distances[i] = distances[lowestPriorityIndex] + graph[lowestPriorityIndex][i];
                    //...and set the priority with which we should continue with this node
                    priorities[i] = distances[i] + heuristic[i][goal];
                    // console.log("Updating distance of node " + i + " to " + distances[i] + " and priority to " + priorities[i]);
                }
            }
        }

        // Lastly, note that we are finished with this node.
        visited[lowestPriorityIndex] = true;
        //console.log("Visited nodes: " + visited);
        //console.log("Currently lowest distances: " + distances);

    }
};


class Game {
    init(size = 4) {

        $gameBoard.innerHTML = '';
        if (!size) size = $fieldSize.value;
        counter = 0;
        $movesCount.innerHTML = String(counter);

        console.log(counter);
        let cells = [];
        for(let i = 0; i < size; ++i){
            arr[i] = []
            for(let j = 0; j < size; ++j){
                arr[i][j] = (i+1==size && j+1==size) ? '' : i*size + j + 1;

            }

        }
            let sequence = this.cellsShuffle(cells, arr, size);
            let order = 0;
            this.renderCells(sequence, arr, order, size, cells)

        $solvePuzzleBTN.addEventListener('click', ()=>{
            game.solvePuzzle(cells, sequence, size);
        })
        $saveGameBTN.addEventListener('click', ()=>{
            this.saveGame(cells);
        });
        window.addEventListener('onbeforeunload', () =>{
            game.saveGame(cells);
        })
        makeTimer();
        if (get('gameState') !== '') {
            if (document.querySelectorAll('revive-game').length === 0) {
                let $reviveGame = makeElem('button', 'revive-game', 'Revive game');
                $lowerGameMenu.prepend($reviveGame);
                $reviveGame.addEventListener('click', () => {
                    game.getSavedGame(arr, size);
                })
            }
        }

        return cells;
    }

    renderCells(sequence = null, arr, order=null, size, cells) {
        for(let i = 0; i < size; ++i){
            let $row = makeElem('div', 'row');
            let tempArr = []
            for(let j = 0; j < size; ++j){
                order++;
                let cell = new Cell(i, j, arr[i][j], order, size);
                cell.dom.addEventListener('click', function(e){
                    cell.moveCell(e);
                    game.isSolved(arr, cells, size);
                });
                cell.dom.setAttribute('draggable', true);

                cell.drag(cell.dom, $row);
                tempArr.push(cell);
                $row.appendChild(cell.dom);
            }
        cells.push(tempArr);
        $gameBoard.appendChild($row);					
    }
    }

    imagePuzzle(size, arrCells) {
        
    }

    cellsShuffle(arrCells, arr, size) {

        ei = size-1;
        ej = size-1;
        let sequence = [];
        let swapMean = 0;
        for(let i = 0; i < 1600; ++i){
            if (Math.round((size-1)*Math.random()) == 0) {
                if(ei != 0) {
                    swapMean = swap(arr,ei,ej,--ei,ej); 

                }
            }
            else if (Math.round((size-1)*Math.random()) == 1) {
                if(ej != (size-1)) {
                    swapMean = swap(arr,ei,ej,ei, ++ej); 

                }
            }
            else if (Math.round((size-1)*Math.random()) == 2) {
                if(ei != (size-1)) {
                    swapMean = swap(arr,ei,ej,++ei,ej); 

                }
            }
            else if (Math.round((size-1)*Math.random()) == 3) {
                if(ej != 0) {
                    swapMean = swap(arr,ei,ej,ei,--ej);
                }
            }
            if (swapMean!==0) {
                sequence.push(swapMean);

            }
        }
        return sequence;
    }

    isSolvable(arr) {
        let arrVal = getValuesCells(arrCells);
        let S = 0;
        arrVal.forEach(item=> {
            item
        })
    }

    saveGame(cells) {
        set('gameState', JSON.stringify(cells));
    }

    getSavedGame(arr, size){
        let state = JSON.parse((get('gameState')));
        console.log(state)
        this.renderCells(arr, size, state);
    }

    solvePuzzle(arrCells, sequence, size) {
        let sequenceUni = Array.from(new Set(sequence));
        sequenceUni = sequenceUni.reverse();

        for(let i = 0; i < sequenceUni.length; ++i) {
            if (sequenceUni[i].i2){
                swap(arr,sequenceUni[i].i2,sequenceUni[i].j2,sequenceUni[i].i1,sequenceUni[i].j1); 

            }
        }


        console.log(sequenceUni);

        let arrVal = getValuesCells(arrCells);
        let arrSP = makeArrDeep(arrVal, 4);
        console.log(arr);
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

    isSolved(arr, arrCells, size){
        let i=0;
        let solve = false;


        for (let i=0;i<size;i++) {
            for(let j=0;j<size;j++) {
                if (i<size-1 &&j<size-1) {
                    console.log(arrCells[i][j])
                    if (arrCells[i][j].value === arrCells[i][j].order) {

                        solve=true;
                    }
                    else {
                        return;
                    }
                }
                else {
                    console.log('work')
                }
/*
                    if (arrCells[size-1][size-1].value === '') {
                        solve=true;
                    }
                    else {
                        solve=false;

                    }

*/

            }

        }
        if (solve) {
            let $congratulations = makeElem('div', 'congratulations', 'Congratulations! You won!');
            $body.appendChild($congratulations);
        }
        console.log(arrCells)

    }

    sizeField() {

           // game.init($fieldSize.value.slice(0,1));

    }
}


let game = new Game();
game.init(4);
$resetBTN.addEventListener('click', () => game.init(4));
//let cellsArr = game.init(4);

$fieldSize.addEventListener('change', () =>{
    game.init($fieldSize.value.slice(0,1));
})