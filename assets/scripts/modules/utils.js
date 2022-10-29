const makeElem = (type, className, text = '') => {
    let el = document.createElement(type);
    el.classList.add(className);
    let textNode = document.createTextNode(text);
    el.appendChild(textNode);
    return el;
}

function makeArrDeep(arr, width) {
    return arr.reduce((rows, key, index) => (index % width == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows, []);
};

function chunk(arr, size) {
    var res = [];
    for (let i = 0; i < arr.length; i = i + size)
        res.push(arr.slice(i, i + size));
    console.log(arr.slice(i, i + size))
    return res;
}

const makeImgArr = (arr) => {
    for (let i = 1; i <= 150; i++) {
        arr.push(`./box/${i}.jpg`);
    }
    return arr;
}


const playSound = (audio) => {
    audio.currentTime = 0;
    audio.play();
}

const swap = (arr, i1, j1, i2, j2) => {
    let temp = arr[i1][j1];
    arr[i1][j1] = arr[i2][j2];
    arr[i2][j2] = temp;
    return {
        i1,
        j1,
        i2,
        j2
    };
}

const unswap = (item, empty) => {
    let temp = empty;
    empty = item;
    item = temp;
    return item;
}

const countMoves = (counter) => {
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
const set = (name, value) => window.localStorage.setItem(name, JSON.stringify(value));

function manhattan(pos0, pos1) {

    let d1 = Math.abs(pos1.posX - pos0.posX);
    let d2 = Math.abs(pos1.posY - pos0.posY);
    return d1 + d2;
}

function byField(field) {
    return (a, b) => a[field] > b[field] ? 1 : -1;
}

function unduplicate(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === arr[i + 1]) {
            continue
        } else {
            result.push(arr[i])

        }
    }
    return result;
}


function makeTimer(el) {
    el.innerHTML = '';
    let constDate = 0;
    constDate = Date.parse(new Date());

    const checkTime = () => {
        let dateNow = Date.parse(new Date());
        let time = dateNow - constDate;
        time = time / 1000;

        el.innerHTML = `${String(Math.floor(time / 60))}:${String(Math.floor(time % 60))}`;

        setTimeout(checkTime, 1000);
    };
    setTimeout(checkTime, 1000);
}

function dragStart(ev) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
    ev.dataTransfer.setDragImage(ev.target, 100, 100);
    return true;
}

function dragDrop(ev) {
    var data = ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
    ev.stopPropagation();
    return false;
}

const isSolved = (arrCells, size, els) => {
    let solve = false;

console.log(arrCells)
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
            $congratulations.innerHTML = `Congratulations! You won! Time: ${els.timer.innerHTML}. Moves: ${els.counter}`;
            els.gameMenu.innerHTML = ''
            els.gameMenu.appendChild($congratulations);
        }

    }
}

export default {
    makeElem,
    makeArrDeep,
    chunk,
    makeImgArr,
    playSound,
    swap,
    unswap,
    countMoves,
    getValuesCells,
    get,
    set,
    manhattan,
    byField,
    unduplicate,
    makeTimer,
    dragStart,
    dragDrop,
    isSolved
}