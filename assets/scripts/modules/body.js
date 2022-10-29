const utils = await import('./utils.js')
  .then(obj => obj.default)
  .catch(err => console.log(err))

export default {
    elements: {
        gameBoard: null,
        resetBTN: null,
        saveGameBTN: null,
        gameMenu: null,
        audio: null,
        imagesPuzzleBTN: null,
        movesCount: null,
        timer: null,
        fieldSize: null,
        solvePuzzleBTN: null,
        counter: 0,
    },

    init() {
        this.elements.gameBoard = utils.makeElem('div', 'game-board');
        this.elements.resetBTN = utils.makeElem('button', 'reset-btn', 'New game');
        this.elements.saveGameBTN = utils.makeElem('button', 'savegame-btn', 'Save game');
        this.elements.gameMenu = utils.makeElem('div', 'game-menu');
        this.elements.audio = utils.makeElem('audio', 'cells-audio');
        this.elements.audio.src = 'assets/audio/sound.mp3';

        this.elements.footer = utils.makeElem('footer', 'footer');
        const footerUl = utils.makeElem('ul', 'footer--ul');
        const footerLi1 = utils.makeElem('li', 'footer--li', '');
        footerLi1.innerHTML = `<a href="https://github.com/anzhelaAbitova">Anzhela Abitova</a>`
        const footerLi2 = utils.makeElem('li', 'footer--li', 'Gem Puzzle');
        const footerLi3 = utils.makeElem('li', 'footer--li', '2020');
        footerUl.appendChild(footerLi1);
        footerUl.appendChild(footerLi2);
        footerUl.appendChild(footerLi3);
        this.elements.footer.appendChild(footerUl);

        this.elements.imagesPuzzleBTN = utils.makeElem('button', 'images-puzzle', 'Images puzzle');
        this.elements.movesCount = utils.makeElem('div', 'moves-count', String(this.elements.counter));
        this.elements.timer = utils.makeElem('div', 'timer');
        this.elements.fieldSize = utils.makeElem('select', 'field-size');
        this.elements.solvePuzzleBTN = utils.makeElem('button', 'solve-puzzle', 'Solve puzzle');

        for (let i = 3; i < 9; i++) {
            let option = new Option(`${i}x${i}`, `${i}x${i}`);
            this.elements.fieldSize.appendChild(option);
            if (i === 4) {
                option.selected = true
            }
        }

        const bodyContent = document.querySelector('main');
        bodyContent.appendChild(this.elements.audio);
        bodyContent.appendChild(this.elements.gameMenu);
        bodyContent.appendChild(this.elements.gameBoard);
        bodyContent.appendChild(this.elements.footer);
        this.elements.gameMenu.appendChild(this.elements.resetBTN);
        this.elements.gameMenu.appendChild(this.elements.saveGameBTN);
        this.elements.gameMenu.appendChild(this.elements.fieldSize);
        this.elements.gameMenu.appendChild(this.elements.solvePuzzleBTN);
        this.elements.gameMenu.appendChild(this.elements.imagesPuzzleBTN);
        this.elements.gameMenu.appendChild(this.elements.movesCount);
        this.elements.gameMenu.appendChild(this.elements.timer);
    },
};