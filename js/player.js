var entities = {
  player_1: {
    controls: {
      ArrowUp: false,
      ArrowRight: false,
      ArrowLeft: false,
      ArrowDown: false,
      Controls: false
    },
    cyclesBindingKeys: {
      up: ["ArrowUp"],
      down: ["ArrowDown"],        
      left: ["ArrowLeft"],
      right: ["ArrowRight"],
      up_right: ["ArrowUp", "ArrowRight"],
      up_left: ["ArrowUp", "ArrowLeft"],
      down_right: ["ArrowDown", "ArrowRight"],
      down_left: ["ArrowDown", "ArrowLeft"]
    },
    cycles: {
      up: [
        [19,0,19,60,40,120]
      ],
      down: [
        [0,0,19,60,40,120]
      ] ,        
      left: [
        [57,0,19,60,40,120]
      ],
      right: [
        [38,0,19,60,40,120]
      ],
      up_right: [
        [147,0,19,60,40,120]
      ],
      up_left: [
        [124,0,19,60,40,120]
      ],
      down_right: [
        [78,0,19,60,40,120]
      ],
      down_left: [
        [101,0,19,60,40,120]
      ]
    }
  },
  dog: {
    cycles: {
      up: [
        [28,0,19,60,54,120]
      ],
      down: [
        [0,0,27,60,54,120]
      ],
    }
  }
}
