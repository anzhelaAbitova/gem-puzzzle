const body = await import('./body.js')
    .then(obj => obj.default)
    .catch(err => console.log(err))

const Cell = await import('./Cell.js')
    .then(obj => obj.default)
    .catch(err => console.log(err))

const utils = await import('./utils.js')
    .then(obj => obj.default)
    .catch(err => console.log(err))

const vars = await import('./vars.js')
    .then(obj => obj.default)
    .catch(err => console.log(err))

export default class Game {
    init = async (size = 4) => {
        body.elements.timer.innerHTML = '';
        body.elements.gameBoard.innerHTML = '';

        if (!size) size = $fieldSize.value;
        body.elements.counter = 0;
        body.elements.movesCount.innerHTML = String(body.elements.counter);

        console.log(body.elements.counter);
        let cells = [];
        for (let i = 0; i < size; ++i) {
            vars.arr[i] = []
            for (let j = 0; j < size; ++j) {
                vars.arr[i][j] = (i + 1 == size && j + 1 == size) ? '' : i * size + j + 1;
            }
        }

        let sequence = this.cellsShuffle(cells, vars.arr, size);
        let order = 0;
        utils.makeImgArr(vars.images);
        this.renderCells(sequence, vars.arr, order, size, cells);

        body.elements.imagesPuzzleBTN.addEventListener('click', () => {
            let ranImg = vars.images[Math.floor(Math.random() * vars.images.length)];
            this.renderCells(sequence, vars.arr, order, size, cells, ranImg);
            body.elements.solvePuzzleBTN.addEventListener('click', () => {
                game.solvePuzzle(cells, sequence, size, order, ranImg);
            })
            /*body.elements.reviveGame.addEventListener('click', () => {
                game.getSavedGame(sequence, size, order, cells, ranImg);
            })*/
        })


        body.elements.solvePuzzleBTN.addEventListener('click', () => {
            game.solvePuzzle(cells, sequence, size, order);
        })
        console.log(cells)
        body.elements.saveGameBTN.addEventListener('click', () => {
            this.saveGame(cells);
        });
        window.addEventListener('onbeforeunload', () => {
            game.saveGame(cells, savedGamescount);
        })
        utils.makeTimer(body.elements.timer);

        if (utils.get('gameState') !== '') {
            if (!document.querySelector('.revive-game')) {
                let $reviveGame = (!document.querySelector('revive-game')) ? utils.makeElem('button', 'revive-game', 'Revive game') : document.querySelector('revive-game');
                body.elements.lowerGameMenu.prepend($reviveGame);
                $reviveGame.addEventListener('click', () => {
                    game.getSavedGame(sequence, size, order, cells);
                })
            }
        }

        return cells;
    }

    renderCells(sequence = null, arr, order = null, size, cells, image = null) {
        console.log(order)
        body.elements.gameBoard.innerHTML = '';
        for (let i = 0; i < size; ++i) {
            let $row = utils.makeElem('div', 'row');
            let tempArr = []
            for (let j = 0; j < size; ++j) {
                order++;
                let cell = new Cell(i, j, arr[i][j], order, size, image);

                if (cell.dom.innerHTML !== '') {
                    cell.dom.setAttribute('draggable', true);
                } else {
                    cell.dom.setAttribute('draggable', false);
                }
                cell.dom.addEventListener('click', function (e) {
                    cell.moveCell(e);
                    utils.isSolved(cells, size, body.elements);
                });
                if (cell.value !== '') {
                    if (image !== null) {
                        cell.dom.style.backgroundImage = `url(${image})`;
                        let boardSize = vars.pageHeight / 2
                        let cellSize = boardSize / parseInt(size)
                        let cellPlace = (cell.value % parseInt(size)) !== 0 ? (cell.value % parseInt(size)) - 1 : parseInt(size) - 1
                        let cellY = Math.floor(cell.value % parseInt(size)) !== 0 ? Math.floor(cell.value / parseInt(size)) : Math.floor(cell.value / parseInt(size)) - 1
                        let position = `-${cellSize * cellPlace}px -${cellSize * cellY}px`;
                        cell.dom.style.backgroundPosition = position
                        console.log(cell.value, cellSize, cellPlace, position);

                        cell.dom.style.backgroundSize = `${boardSize}px`;
                        cell.dom.style.backgroundRepeat = 'no-repeat';
                        cell.dom.style.color = `#FEFCFA`;
                        cell.dom.style.textShadow = `1px 1px 4px #000`;
                    }
                }
                cell.drag(cell);

                tempArr.push(cell);
                $row.appendChild(cell.dom);
            }
            cells.push(tempArr);
            body.elements.gameBoard.appendChild($row);
        }
    }

    imagePuzzle(size, arrCells) {

    }

    cellsShuffle(arrCells, arr, size) {

        vars.ei = size - 1;
        vars.ej = size - 1;
        let sequence = [];
        let swapMean = 0;
        for (let i = 0; i < 1600; ++i) {
            if (Math.round((size - 1) * Math.random()) == 0) {
                if (vars.ei != 0) {
                    swapMean = utils.swap(vars.arr, vars.ei, vars.ej, --vars.ei, vars.ej);

                }
            } else if (Math.round((size - 1) * Math.random()) == 1) {
                if (vars.ej != (size - 1)) {
                    swapMean = utils.swap(arr, vars.ei, vars.ej, vars.ei, ++vars.ej);

                }
            } else if (Math.round((size - 1) * Math.random()) == 2) {
                if (vars.ei != (size - 1)) {
                    swapMean = utils.swap(arr, vars.ei, vars.ej, ++vars.ei, vars.ej);

                }
            } else if (Math.round((size - 1) * Math.random()) == 3) {
                if (vars.ej != 0) {
                    swapMean = utils.swap(arr, vars.ei, vars.ej, vars.ei, --vars.ej);
                }
            }
            if (swapMean !== 0) {
                sequence.push(swapMean);

            }
        }
        return sequence;
    }

    saveGame(cells) {
        utils.set(`gameState`, JSON.stringify(cells));
    }

    getSavedGame(sequence, size, order, image = null) {
        let state = JSON.parse((get('gameState')));
        state = state.flat()


        let arrVal = getValuesCells(state);
        let arrSP = makeArrDeep(arrVal, size);

        if (image !== null) {
            this.renderCells(sequence, arrSP, order, size, state, image);
        } else {
            this.renderCells(sequence, arrSP, order, size, state);
        }
    }

    solvePuzzle(arrCells, sequence, size, order, image) {
        let sequenceUni = Array.from(new Set(sequence));
        sequenceUni = sequenceUni.reverse();

        for (let i = 0; i < sequenceUni.length; ++i) {
            if (sequenceUni[i].i2) {
                utils.swap(arr, sequenceUni[i].i2, sequenceUni[i].j2, sequenceUni[i].i1, sequenceUni[i].j1);
            }
        }
        /*   
        arrCells = arrCells.flat(1);
        arrCells = arrCells.slice(0, size*size);
        arrCells = arrCells.sort(byField('value'));
        arrCells.push(arrCells[0]);
        arrCells.shift();
*/
        let arrSolve = [];
        for (let i = 1; i < size * size; i++) {
            arrSolve.push(`${i}`);
        }
        arrSolve.push('');
        let arrSP = makeArrDeep(arrSolve, size);

        $gameBoard.innerHTML = '';
        if (image !== null) {
            this.renderCells(sequence, arrSP, order, size, arrCells, image);
            if (!document.querySelector('.congratulations')) {
                let $congratulations = makeElem('div', 'congratulations');
                $congratulations.innerHTML = 'You are a cheater!';
                $body.appendChild($congratulations);
            }
        } else {
            this.renderCells(sequence, arrSP, order, size, arrCells);
        }
    }

    chooseSavedGame() {

    }

    /* isSolved(arr, arrCells, size) {
        let solve = false;


        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                console.log(arrCells[i][j].posX)

                if (i !== size - 1 && j !== size - 1) {

                    if (arrCells[i][j].value === arrCells[i][j].order) {
                        solve = true;
                    } else {
                        console.log('testrrrrr')
                        return;
                    }
                }
            }

        }
        if (solve) {
            if (!document.querySelector('.congratulations')) {
                let $congratulations = makeElem('div', 'congratulations');
                $congratulations.innerHTML = `Congratulations! You won! Time: ${$timer.innerHTML}. Moves: ${counter}`;
                $body.appendChild($congratulations);
            }

        }
        console.log(arrCells)

    } */
}