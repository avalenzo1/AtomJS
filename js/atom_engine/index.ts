/** 
 * Copyright (C) 2021-22 Atom Engine JS
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * Coded by Anthony Valenzo <avalenzo@cps.edu>
 * Version 0.0.5 Alpha Build 15
*/

"use strict";

let keys = new Array();

let STAGE_QUERY: string = "canvas-container";
let FRAMES_PER_SECOND = 60;
let GAME_FONTS = {
      "arial": "bold 12px Arial",
      "lcd": "12px lcdSolid"
    };
let VIEWPORT = {
      x: 0,
      y: 0,
      WIDTH: (1920/2),
      HEIGHT: (1080/2),
      LIMIT_X: 1000,
      LIMIT_Y: 1000,
    };
let ruleSets = {
  ImageSmoothing: false,
}
let audCtx = new AudioContext();

var Atom = (function () {
  const container = document.querySelector(STAGE_QUERY);

  const initialize = (canvas) => {
    let dpr = window.devicePixelRatio || 1;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    let ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return ctx;
  };

  function require(url: URL, callback) {
    var head = document.head;
    var script:any = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
  }

  class Layer {
    canvas: any;
    zIndex: any;
    callback: any;
    ctx: any;
    constructor(zIndex: number) {
      this.zIndex = zIndex
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("id", this.zIndex);
      this.canvas.style.zIndex = this.zIndex;
      this.canvas.width = VIEWPORT.WIDTH;
      this.canvas.height = VIEWPORT.HEIGHT;
      container.appendChild(this.canvas);
      this.ctx = initialize(document.getElementById(this.zIndex));
      this.ctx.mozImageSmoothingEnabled = ruleSets.ImageSmoothing;
      this.ctx.webkitImageSmoothingEnabled = ruleSets.ImageSmoothing;
      this.ctx.msImageSmoothingEnabled = ruleSets.ImageSmoothing;
      this.ctx.imageSmoothingEnabled = ruleSets.ImageSmoothing;
      // callback.apply(this, args);
    }

    // loop(callback) {
    //   callback.apply(this);
    //   setInterval(loop, (1000 / FRAMES_PER_SECOND))
    // }
  }

  class GameObject {
    weight: number;
    direction: string;
    speed: number;
    friction: number;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    w: number;
    h: number;
    ctx: any;
    constructor(ctx, x, y, w, h, weight: number) {
      this.ctx = ctx
      this.direction = "down";
      this.x = x ?? 0;
      this.y = y ?? 0;
      this.velocityX = 0;
      this.velocityY = 0;
      this.w = w ?? 10;
      this.h = h ?? 10;
      this.weight = weight;
      this.friction = 0.92;
      this.speed = this.weight;
    }
  }

  class StaticImg extends GameObject {
    img: HTMLImageElement;
    src: any;
    
    constructor(ctx: any, src: any, x, y, width, height, weight = 0) {
      super(ctx, x, y, width, height, weight);
      this.src= src;
      this.img = new Image();
      this.img.src = this.src;
      this.ctx = ctx;
    }


    draw() {
      this.ctx.drawImage(this.img, (this.x - VIEWPORT.x), (this.y - VIEWPORT.y));
    }
  }
  
  class Square extends GameObject {
    width: number;
    height: number;
    color: any;
    constructor(ctx, x, y, w, h, weight, color) {
      super(ctx, x, y, w, h, weight);
      this.color = color;
    }
  
    draw() {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect((this.x - VIEWPORT.x), (this.y - VIEWPORT.y), this.w, this.h)
    }
  }
  
  class Circle extends GameObject {
    width: number;
    height: number;
    color: string;
    constructor(ctx, x, y, w, h, weight, color) {
      super(ctx, x, y, w, h, weight);
      this.color = color;
    }
  
    draw() {
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.ctx.arc((this.x - VIEWPORT.x), (this.y - VIEWPORT.y), this.w, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  class CustomShape extends GameObject {
    width: number;
    height: number;
    color: string;
    parameters: Array<number>;

    constructor(ctx, x, y, w, h, parameters, weight, color) {
      super(ctx, x, y, w, h, weight);
      this.parameters = parameters;
      this.color = color;
    }

    draw() {
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.parameters.forEach((e) => {
        if (e[0] === "MoveTo" || e[0] === "mTo") this.ctx.moveTo(((e[1] + this.x) - VIEWPORT.x), ((e[2] + this.y) - VIEWPORT.y))
        if (e[0] === "LineTo" || e[0] === "lTo") this.ctx.lineTo(((e[1] + this.x) - VIEWPORT.x), ((e[2] + this.y) - VIEWPORT.y));
      });
      this.ctx.fill();
    }
  }
  
  class Sprite extends GameObject {
    src: any;
    img: HTMLImageElement;
    cycles: any;
    cycleFrame: number;
    img_crop;
    constructor(ctx, x, y, w, h, src, cycles, weight = 10) {
      super(ctx, x, y, w, h, weight);
      this.src = src;
      this.img = new Image();
      this.img.src = this.src;
  
      this.cycles = cycles;
      this.cycleFrame = 0;
    }
  
    draw() {
      this.img_crop = {
        sx: this.cycles[this.direction][this.cycleFrame][0],
        sy: this.cycles[this.direction][this.cycleFrame][1],
        sw: this.cycles[this.direction][this.cycleFrame][2],
        sh: this.cycles[this.direction][this.cycleFrame][3],
        dw: this.cycles[this.direction][this.cycleFrame][4],  
        dh: this.cycles[this.direction][this.cycleFrame][5],
      };
      if (!this.cycles) throw new Error("Parameters for image were not found.");
  
      this.ctx.drawImage(this.img, this.img_crop.sx, this.img_crop.sy, this.img_crop.sw, this.img_crop.sh, (this.x - VIEWPORT.x), (this.y - VIEWPORT.y), this.img_crop.dw, this.img_crop.dh);
    }
  }

  
  class CollisionShape {
    x: number;
    y: number;
    w: number;
    h: number;
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
  }
  
  class Player extends Sprite {
    controller: any;
    bindKeys: any;
    originX: number;
    originY: number;
    
    constructor(ctx, oX, oY, x, y, w, h, src, cycles, controller, bindKeys, weight = 10) {
      super(ctx, x, y, w, h, src, cycles, weight);
      this.controller = controller;
      this.bindKeys = bindKeys;
      this.originX = oX ?? this.x;
      this.originY = oY ?? this.y;

      document.addEventListener("keydown", (e) => {
        keys = keys.filter(x => x !== e.key);
        keys.push(e.key);
      
        if (keys.includes('ArrowUp') || keys.includes('ArrowDown') || keys.includes('ArrowLeft') || keys.includes('ArrowRight')) {
          this.move(keys);
        }
      });
      
      document.addEventListener("keyup", (e) => {
        keys = keys.filter(x => x !== e.key);
      });

      this.updateVIEWPORT();
    }

    updateVIEWPORT() {
      VIEWPORT.x = (this.x + this.originX) - (VIEWPORT.WIDTH / 2);
      VIEWPORT.y = (this.y + this.originY) - (VIEWPORT.HEIGHT / 2);

      if (VIEWPORT.x < 0) VIEWPORT.x = 0;
      if (VIEWPORT.y < 0) VIEWPORT.y = 0;  
      
      if (VIEWPORT.x > (VIEWPORT.LIMIT_X - VIEWPORT.WIDTH)) VIEWPORT.x = (VIEWPORT.LIMIT_X - VIEWPORT.WIDTH)
      if (VIEWPORT.y > (VIEWPORT.LIMIT_Y - VIEWPORT.HEIGHT)) VIEWPORT.y = (VIEWPORT.LIMIT_Y - VIEWPORT.HEIGHT)
    }

    draw() {
      this.velocityY *= this.friction;
      this.y += this.velocityY;
      this.velocityX *= this.friction;
      this.x += this.velocityX;

      if (this.x < 0) {
        this.x = 0;
      }

      if (this.y < 0) {
        this.y = 0;
      }

      this.img_crop = {
        sx: this.cycles[this.direction][this.cycleFrame][0],
        sy: this.cycles[this.direction][this.cycleFrame][1],
        sw: this.cycles[this.direction][this.cycleFrame][2],
        sh: this.cycles[this.direction][this.cycleFrame][3],
        dw: this.cycles[this.direction][this.cycleFrame][4],  
        dh: this.cycles[this.direction][this.cycleFrame][5],
      };

      if (this.x >= (VIEWPORT.LIMIT_X - this.img_crop.dw)) {
        this.x = VIEWPORT.LIMIT_X - this.img_crop.dw;
      }
      
      if (this.y >= (VIEWPORT.LIMIT_Y - this.img_crop.dh)) {
        this.y = VIEWPORT.LIMIT_Y - this.img_crop.dh;
      }
      
      if (!this.cycles) throw new Error("Parameters for image were not found.");
  
      this.ctx.drawImage(this.img, this.img_crop.sx, this.img_crop.sy, this.img_crop.sw, this.img_crop.sh, (this.x - VIEWPORT.x), (this.y - VIEWPORT.y), this.img_crop.dw, this.img_crop.dh);

      this.updateVIEWPORT();
    }

    move(keys) {
      if (keys.includes('Control')) {
        this.speed = (this.weight * 1.5);
      }
      
      if (keys.includes('ArrowLeft')) {
        this.direction = "left";
        if (this.velocityX > -this.speed) {
          this.velocityX--;
        }
      }
      
      if (keys.includes('ArrowUp')) {
        this.direction = "up";
        if (this.velocityY > -this.speed) {
          this.velocityY--;
        }
      }
  
      if (keys.includes('ArrowDown')) {
        this.direction = "down";
        if (this.velocityY < this.speed) {
          this.velocityY++;
        }
      }
  
      if (keys.includes('ArrowRight')) {
        this.direction = "right"; 
        if (this.velocityX < this.speed) {
          this.velocityX++;
        }
      }
  
      if (keys.includes('ArrowLeft') && keys.includes('ArrowUp')) {
        this.direction = "up_left"
      }
  
      if (keys.includes('ArrowRight') && keys.includes('ArrowUp')) {
        this.direction = "up_right"
      }
  
      if (keys.includes('ArrowLeft') && keys.includes('ArrowDown')) {
        this.direction = "down_left"
      }
  
      if (keys.includes('ArrowRight') && keys.includes('ArrowDown')) {
        this.direction = "down_right"
      }
    }
  }

  class KinematicBody {

  }

  class Fonts {
    constructor() {

    }
  }
  
  class Sound {
    src: any;
    sound: HTMLAudioElement;
    source: MediaElementAudioSourceNode;
    constructor(src) {
      this.src = src;
      this.sound = new Audio(this.src);
      this.source = audCtx.createMediaElementSource(this.sound);
      this.source.connect(audCtx.destination);
    }
  
    play() {
      this.sound.play();
    }
  
    pause() {
      this.sound.pause();
    }

    loop(boolean: boolean) {
      this.sound.loop = boolean;
    }
  }

  return {
    initialize, require, Square, Circle, Sprite, Player, Sound, Layer, StaticImg, CustomShape
  };
})();
