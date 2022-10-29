'use strict';
const body = await import('./modules/body.js')
  .then(obj => obj.default)
  .catch(err => console.log(err))

const Game = await import('./modules/Game.js')
  .then(obj => obj.default)
  .catch(err => console.log(err))

body.init()

let game = new Game();
game.init(4);
body.elements.resetBTN.addEventListener('click', () => game.init(4));

body.elements.fieldSize.addEventListener('change', () =>{
    game.init(body.elements.fieldSize.value.slice(0,1));
})