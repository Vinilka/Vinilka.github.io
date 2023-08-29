import platform from '../img/platform.png'
import hills from '../img/hills.png'
import background from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'
import playerRunLeft from '../img/playerMoveLeft.png'
import playerRunRight from '../img/playerMoveRight.png'
import playerStandLeft from '../img/playerStandLeft.png'
import playerStandRight from '../img/playerStandRight.png'
import playerJumpRight from '../img/playerJumpRight.png'
import playerJumpLeft from '../img/playerJumpLeft.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1


class Player {
  constructor() {
    this.speed = 10
    this.position = {
      x: 100,
      y: 100
    }
    // gravity //
    this.velocity = {       
      x: 0, 
      y: 1
    }
    this.width = 134
    this.height = 150

    this.image = createImage(playerStandRight)
    this.frames = 0
    this.sprites = {
      stand: {
        right: createImage(playerStandRight),
        left: createImage(playerStandLeft),
        cropWidth: 387.375
      },
      run: {
        right: createImage(playerRunRight),
        left: createImage(playerRunLeft),
        cropWidth: 395
      },
      jump: {
        right: createImage(playerJumpRight),
        left: createImage(playerJumpLeft),
        cropWidth: 395
      }
    }

    this.currentSprite = this.sprites.stand.right
    this.currentCropWidth = this.sprites.stand.cropWidth
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      -5,
      this.currentCropWidth, 
      454,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  updatePlayerFrame() {
    this.frames++
    
    if
      (this.frames >= 16
      && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left))
        this.frames = 0
    else if
      (this.frames >= 20
      && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left))
        this.frames = 0
      else if
      (this.frames >= 30
      && (this.currentSprite === this.sprites.jump.right || this.currentSprite === this.sprites.jump.left))
        this.frames = 0
  }

  update() {

    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity
  }
}

class Platform {
  constructor({x,y, image}) {
    this.position = {
      x,
      y
    }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x,this.position.y)
  }
}

class GenericObject {
  constructor({x,y, image}) {
    this.position = {
      x,
      y
    }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x,this.position.y)
  }
}

function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}


let platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)
  
let player = new Player()
let platforms = []

let genericObject = []

let lastKey
const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  },
  up: {
    pressed: false
  }
}

let scrollPlatform = 0
  
// function after dying//
function init() {

  platformImage = createImage(platform)
  
  player = new Player()
  platforms = [
    new Platform({
    x: platformImage.width * 4 + 250,
    y: 270,
    image: platformSmallTallImage
  }),
    new Platform({
    x: -1,
    y: 470,
    image: platformImage
  }),
  new Platform({
    x: platformImage.width - 1,
    y: 470,
    image: platformImage
  }),
  new Platform({
    x: platformImage.width * 2 + 100,
    y: 470,
    image: platformImage
  }),
    new Platform({
    x: platformImage.width * 3,
    y: 470,
    image: platformImage
    }),
  new Platform({
    x: platformImage.width * 4,
    y: 470,
    image: platformImage
  }),
  new Platform({
    x: platformImage.width * 5 + 600,
    y: 470,
    image: platformImage
  })
  ]


genericObject = [
  new GenericObject({
    x: 0,
    y: 0,
    image: createImage(background)
  }),
  new GenericObject({
    x: 0,
    y: 0,
    image: createImage(hills)
  })
]
scrollPlatform = 0
}

function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  genericObject.forEach(genericObject => {
    genericObject.draw()
  })
  
  platforms.forEach(platform => {
    platform.draw()
  })

  player.updatePlayerFrame()
  player.update()

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed
  }
  else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollPlatform === 0 && player.position.x > 0)) {
    player.velocity.x = -player.speed
  }
  else {
    player.velocity.x = 0
    if (keys.right.pressed) {
      scrollPlatform += player.speed
      platforms.forEach(platform => {
        platform.position.x -= player.speed
      })
      genericObject.forEach(genericObject => {
      genericObject.position.x -= player.speed * .66
      })
    } else if (keys.left.pressed && scrollPlatform > 0) {
      scrollPlatform -= player.speed
      platforms.forEach(platform => {
        platform.position.x += player.speed
      })
      genericObject.forEach(genericObject => {
        genericObject.position.x += player.speed * .66
        })
    }
  }


  // platfrom collision //
  platforms.forEach(platform => {
    if (player.position.y + player.height <= platform.position.y
    && player.position.y + player.height + player.velocity.y >= platform.position.y
    && player.position.x + player.width >= platform.position.x
    && player.position.x <= platform.position.x + platform.width) {
    player.velocity.y = 0
    }
  })

  // sprite switch //
  if (keys.up.pressed) {
    player.frames = 1
    player.currentSprite = player.sprites.jump.right
    player.currentCropWidth = player.sprites.jump.cropWidth
  } else if (
    keys.right.pressed &&
    lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
    player.frames = 1
    player.currentSprite = player.sprites.run.right
    player.currentCropWidth = player.sprites.run.cropWidth
  } else if (
    keys.left.pressed &&
    lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
    player.frames = 1
    player.currentSprite = player.sprites.run.left
    player.currentCropWidth = player.sprites.run.cropWidth
  } else if (
    !keys.left.pressed &&
    lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
    player.frames = 1
    player.currentSprite = player.sprites.stand.left
    player.currentCropWidth = player.sprites.stand.cropWidth
  } else if (
    !keys.right.pressed &&
    lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
    player.frames = 1
    player.currentSprite = player.sprites.stand.right
    player.currentCropWidth = player.sprites.stand.cropWidth
  }

// win condition //
  if (scrollPlatform > platformImage.width * 5 + 300) {
    console.log('you win')
  }
  
// lose condition //
  if (player.position.y > canvas.width) {
    init()
  }
}

init()
animate()

addEventListener('keydown', ({key}) => {
  switch (key) {

    case 'a':
    case 'ArrowLeft':
      keys.left.pressed = true
      lastKey = 'left'
      break
    
    case 's':
    case 'ArrowDown':
      break
    
    case 'd':
    case 'ArrowRight':
      keys.right.pressed = true
      lastKey = 'right'
      break
    
    case 'w':
    case 'ArrowUp':
      keys.up.pressed = true
      player.velocity.y -= 20
      break
    
  }
})

addEventListener('keyup', ({key}) => {
  switch (key) {

    case 'a':
    case 'ArrowLeft':
      keys.left.pressed = false
      break
    
    case 's':
    case 'ArrowDown':
      break
    
    case 'd':
    case 'ArrowRight':
      keys.right.pressed = false
      break
    
    case 'w':
    case 'ArrowUp':
      keys.up.pressed = false
      break
    
  }
})
