/**
 * Source: setupCanvas() => https://www.html5rocks.com/en/tutorials/canvas/hidpi/ [Not my code]
 * Prototype Game Engine using '2D canvas'
 * 
 * Source: Calculate FPS https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html [Not my code]
*/

"use strict";

var storage = window.localStorage;

let layer = new Atom.Layer(1);
let fixedGui = new Atom.Layer(2);

layer.ctx.fillStyle = "#ffffff"
layer.ctx.font = '12px Verdana';
layer.ctx.fillText(`Loading...`, 0, 10);

var bg = new Atom.Sound("./audio/demo1_melody_only.ogg");
bg.loop(true);
var coordinates = JSON.parse(localStorage.getItem("coordinates")) ?? {x: 110, y: 30};
var spriteObj = new Atom.Player
(
  layer.ctx,
  20,
  60,
  coordinates.x,
  coordinates.y,
  40,
  120,
  "./media/sprite.png",
  entities.player_1.cycles,
  entities.player_1.controls,
  entities.player_1.cyclesBindingKeys,
  10
);

var Circle = new Atom.Circle(
  layer.ctx,
  600,
  500,
  100,
  100,
  20,
  "#ccc"
);

var Block = new Atom.Square(
  layer.ctx,
  600,
  500,
  100,
  100,
  20,
  "#fff"
);

var CustomLinePaths = [
  ["MoveTo", 50, 0],
  ["LineTo", 0, 100],
  ["LineTo", 100, 100],
]

var Custom = new Atom.CustomShape(
  layer.ctx,
  600,
  500,
  10,
  20,
  CustomLinePaths,
  20,
  "#ff0000"
)

var bgX = new Atom.StaticImg(
  layer.ctx,
  "./media/bg.png"
);

console.table(VIEWPORT);

const times = new Array();
let fps;

document.addEventListener("DOMContentLoaded", () => { 
  const loop = () => {
    layer.ctx.clearRect(0, 0, VIEWPORT.WIDTH, VIEWPORT.HEIGHT);
    layer.ctx.fillStyle = "#255669"
    layer.ctx.fillRect(0, 0, VIEWPORT.WIDTH, VIEWPORT.HEIGHT);

    bgX.draw();
    spriteObj.draw();
    Circle.draw();
    Block.draw();
    Custom.draw();

    fixedGui.ctx.clearRect(0, 0, VIEWPORT.WIDTH, VIEWPORT.HEIGHT);
    fixedGui.ctx.fillStyle = "#000000"
    fixedGui.ctx.fillStyle = "#fff200"
    fixedGui.ctx.font = GAME_FONTS.lcd;
    fixedGui.ctx.fillText(`GLOBAL::Player => X: ${parseInt(spriteObj.x)} Y: ${parseInt(spriteObj.y)} FPS: ${fps}`, 0, 10);
    fixedGui.ctx.fillText(`GLOBAL::Viewport => X: ${parseInt(VIEWPORT.x)} Y: ${parseInt(VIEWPORT.y)}`, 0, 30);

    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
      }
      times.push(now);
      fps = times.length;
      loop();
    });
  }
  void loop();
});

window.addEventListener("keyup", (e) => {
  keys = keys.filter(x => x !== e.key);
  switch (e.key) {
    case 'c':
      storage.clear();
      break;
    case 's':
      var saved_coordinates = {x: spriteObj.x, y: spriteObj.y};
      storage.setItem('coordinates', JSON.stringify(saved_coordinates));
      console.log(storage.coordinates);
      break;
    case 'p':
      bg.play();
      break;
  }
});
