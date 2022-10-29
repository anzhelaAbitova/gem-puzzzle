const body = await import('./body.js')
  .then(obj => obj.default)
  .catch(err => console.log(err))

const utils = await import('./utils.js')
  .then(obj => obj.default)
  .catch(err => console.log(err))

const vars = await import('./vars.js')
  .then(obj => obj.default)
  .catch(err => console.log(err))

export default class Cell {
    constructor(posX, posY, value, order, gridSize, image = null) {
        this.posX = posX;
        this.posY = posY;
        this.value = value;
        this.dom = this.makeCell();
        this.order = order;
        this.gridSize = gridSize;
        this.image = image;
    }

    makeCell() {
        let el = utils.makeElem('div', 'cell', this.value);
        el.id = `${this.posX} ${this.posY}`;
        if (this.value === '') el.classList.add('empty');

        return el;
    }

    moveCell(e, drop = null) {
        let event = e || window.e,
            emptyPrev = (this) ? this : event.srcElement || event.target,
            i = (this.posX || this.posX >= 0) ? this.posX : emptyPrev.id.charAt(0),
            j = (this.posY || this.posY >= 0) ? this.posY : emptyPrev.id.charAt(2);

        console.log(emptyPrev);

        if ((i == vars.ei && Math.abs(j - vars.ej) == 1) || (j == vars.ej && Math.abs(i - vars.ei) == 1)) {
            let emptyNow = document.getElementById(`${vars.ei} ${vars.ej}`);

            console.log(this)
            if (drop !== null) {
                emptyNow = drop || document.querySelector('.empty');
            }

            if (emptyPrev.image !== null || emptyPrev.dom.style.backgroundImage) {
                emptyNow.image = emptyPrev.image || emptyPrev.style.backgroundImage;
                emptyNow.style.backgroundImage = `url(${emptyPrev.image})`;
                emptyNow.style.backgroundPosition = `${emptyPrev.dom.style.backgroundPosition}`;
            }
            emptyNow.value = emptyPrev.value || emptyPrev.innerHTML;
            console.log(emptyPrev);

            emptyNow.innerHTML = (emptyPrev.dom.innerHTML || emptyPrev.dom.innerHTML === '') ? emptyPrev.dom.innerHTML : emptyPrev.innerHTML;
            emptyNow.classList.remove('empty');



            emptyPrev.dom.innerHTML = "";
            emptyPrev.value = '';
            emptyPrev.dom.classList.add('empty');
            console.log(emptyNow.style.backgroundImage);
            emptyPrev.dom.style.backgroundImage = '';

            utils.countMoves(body.elements.counter);
            utils.playSound(body.elements.audio);
            body.elements.movesCount.innerHTML = String(body.elements.counter);
            vars.ei = i;
            vars.ej = j;
            let victory = true;
            for (i = 0; i < this.gridSize; ++i)
                for (j = 0; j < this.gridSize; ++j)
                    if (i + j != (this.gridSize + 2) && document.getElementById(`${i} ${j}`).innerHTML != i * (this.gridSize) + j + 1) {
                        victory = false;
                        break;
                    }
        }
    }

    drag(cellDrag) {
        //console.log(cellDrag)
        cellDrag.dom.addEventListener('dragstart', (e) => {
            //e.dataTransfer.setData("application/my-app", e.target.id);
            //e.dataTransfer.dropEffect = "move";
            //console.log(e.target)
            cellDrag.moveCell();
        });
        let emptyNow = document.querySelector('.empty');

        if (emptyNow) {
            emptyNow.addEventListener('dragenter', (e) => e.preventDefault);
            emptyNow.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            emptyNow.addEventListener('drop', (e) => {
                //e.preventDefault();
                this.moveCell(e, e.target);
                //const data = e.dataTransfer.getData("application/my-app");
                //e.target.appendChild(document.getElementById(data));

                //e.preventDefault();
                console.log(this);
                //dragDrop(cellDrag);
            });
        }
    }
}