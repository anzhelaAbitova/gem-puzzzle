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
        lowerGameMenu: null,
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
        this.elements.audio.src = './../sound.mp3';

        this.elements.lowerGameMenu = utils.makeElem('div', 'game-menu');
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
        bodyContent.appendChild(this.elements.lowerGameMenu);
        this.elements.gameMenu.appendChild(this.elements.resetBTN);
        this.elements.gameMenu.appendChild(this.elements.saveGameBTN);
        this.elements.gameMenu.appendChild(this.elements.fieldSize);
        this.elements.gameMenu.appendChild(this.elements.solvePuzzleBTN);
        this.elements.lowerGameMenu.appendChild(this.elements.imagesPuzzleBTN);
        this.elements.lowerGameMenu.appendChild(this.elements.movesCount);
        this.elements.lowerGameMenu.appendChild(this.elements.timer);
        //const bodyImg = document.querySelector('body');
        //bodyImg.style.backgroundImage = 'url("https://4.downloader.disk.yandex.ru/preview/59bb6df28cc9cdf751282c1297ecf3649300ac79d2eaa8cbbf0e59cdf5ef5d93/inf/hkuY32pFS-S6gqiuR6PNWjMIJUEXhvyxCuvRTaqYC53Pfy1emPG76askoHaoqJwG9mYtsXXH3vJS19rEIR9xKg%3D%3D?uid=92464393&filename=clouds-1.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=92464393&tknv=v2&size=1841x977")';
    },
};