$(() => {
  console.log('js loaded')
  const width = 20
  const ghostMovementOptions = [-1, 1, -width, width]
  let ghostPosition
  let newGhostPosition
  const ghostDirections = {
    'orange': ghostMovementOptions[0],
    'red': ghostMovementOptions[1],
    'cyan': ghostMovementOptions[2],
    'pink': ghostMovementOptions[3]
  }
  const ghostObjects = [
    {
      'color': 'orange',
      'position': 209,
      'direction': ''
    },
    {
      'color': 'red',
      'position': 190,
      'direction': ''
    },
    {
      'color': 'cyan',
      'position': 210,
      'direction': ''
    },
    {
      'color': 'pink',
      'position': 189,
      'direction': ''
    }
  ]

  //-----------------------------------------VARIABLES-----------------------------------------
  const $board = $('.gameboard')
  const $scoreBoard = $('.score-board')
  const $endScreen = $('.game-over')
  const $endScreenHeader = $endScreen.find('h2')
  const $endScreenPara = $endScreen.find('p')
  const $restartButton = $('.restart')
  const $startScreen = $('.welcome')
  const $startScreenHeader = $startScreen.find('h1')
  const $startScreenPara = $startScreen.find('p')
  const $startButton = $('.start')
  const mazeArray = [26, 33, 46, 53, 66, 73, 86, 93, 101, 102, 103, 104, 105, 106, 113, 114, 115, 116, 117, 118, 281, 282, 283, 284, 285, 286, 293, 294, 295, 296, 297, 298, 306, 313, 326, 333, 346, 353, 366, 373]
  const directions = {
    '-1': 'backward',
    [`-${width}`]: 'up',
    1: 'forward',
    [`${width}`]: 'down'
  }
  let pacPosition = 0
  let $squares
  let score = 0
  let blueGhosts
  let pacMoves = true
  let pacInterval
  //----------Ghost Variables----------
  let clydeInterval
  let blinkyInterval
  let inkyInterval
  let pinkyInterval
  //-----------------------------------------FUNCTIONS-----------------------------------------

  // welcomeToGame is called on page load and gives player option to start game on button click
  function welcomeToGame(){
    $startScreen.show()
    $board.hide()
    $scoreBoard.hide()
    $endScreen.hide()
    $startScreenHeader.text('Welcome to Pac Man')
    $startScreenPara.text('Click the button to start the game')
  }

  // startGame is called when $startButton is clicked
  function startGame() {
    $board.show()
    $scoreBoard.show()
    $startScreen.hide()
    $endScreen.hide()
    destroyBoard()
    createBoard()
    makeFood()
    makePac()
    createMaze()
    startMovement()
    makeSuperFood()
    makeGhosts()
    clydeInterval = setInterval(() => moveGhost('orange'), 500)
    blinkyInterval = setInterval(() => moveGhost('red'), 500)
    inkyInterval = setInterval(() => moveGhost('cyan'), 500)
    pinkyInterval = setInterval(() => moveGhost('pink'), 500)
    pacInterval = setInterval(() => pacMoves = true, 200)
  }
  //----------Ghost Functions----------

  // makeGhosts is called in startGame and puts each ghost at a specific index on the gameboard and adds a class depending on which ghost it is
  function makeGhosts(){
    $squares.eq(209).addClass('orange ghost')
    $squares.eq(190).addClass('red ghost')
    $squares.eq(210).addClass('cyan ghost')
    $squares.eq(189).addClass('pink ghost')
  }

  function moveGhost(ghostClass) {
    let occupied = false

    const ghostPosition = $(`.gameboard .${ghostClass}.ghost`).index()
    const newGhostPosition = ghostPosition + ghostDirections[ghostClass]

    if($squares.eq(newGhostPosition).hasClass('ghost')){
      occupied = true
    }

    if (
      mazeArray.includes(newGhostPosition) ||
      newGhostPosition - width < 0 ||
      newGhostPosition % width === 0 ||
      newGhostPosition % width === width - 1 ||
      newGhostPosition + width >= width*width ||
      occupied
    ){
      ghostDirections[ghostClass] = ghostMovementOptions[Math.floor(Math.random()* 4)]
      return false
    }

    $squares.eq(ghostPosition).removeClass(`${ghostClass} ghost blue`)
    $squares.eq(newGhostPosition).addClass(`${ghostClass} ghost`)

    ghostObjects.find(ghost => ghost.color === ghostClass).direction = ghostDirections[ghostClass]
    const index = ghostObjects.findIndex(ghost => ghost.color === ghostClass)
    ghostObjects[index].position += ghostDirections[ghostClass]


    if(blueGhosts) $squares.eq(newGhostPosition).addClass('blue')

    if ($squares.eq(newGhostPosition).hasClass('pacman')) gameOver()
  }

  // create board
  function createBoard(){
    $board.attr('data-width', width)
    for(let i = 0; i<width*width; i++) {
      $board.append($('<div id='+ i +' />'))
    }
    $squares = $('.gameboard div')
  }

  function destroyBoard() {
    clearInterval(clydeInterval)
    clearInterval(blinkyInterval)
    clearInterval(inkyInterval)
    clearInterval(pinkyInterval)
    pacPosition = 0
    score = 0
    $board.empty()
  }

  // generate pacman
  function makePac(){
    $squares.eq(pacPosition)
      .removeClass('food')
      .addClass('pacman')
  }

  //generate food
  function makeFood() {
    $squares.addClass('food')
  }

  //create maze
  function createMaze(){
    mazeArray.forEach(mazeId => {
      $(`[id='${mazeId}']`).removeClass('food')
      $(`[id='${mazeId}']`).addClass('wall')
    })
  }

  // function to randomly generate superfood
  function makeSuperFood() {
    for(let i = 0; i<10; i++) {
      let superFoodIndex = Math.floor(Math.random()*$squares.length)
      while (mazeArray.includes(superFoodIndex) || pacPosition === superFoodIndex || ghostPosition === superFoodIndex) {
        superFoodIndex = Math.floor(Math.random()*$squares.length)
      }
      const superFoodLocation = $($squares[superFoodIndex])
      superFoodLocation.addClass('big-food')
      superFoodLocation.removeClass('food')
    }
  }

  // function to move pacman
  function movePac(movement) {
    const newPosition = pacPosition + movement
    if (mazeArray.includes(newPosition)) return
    $squares.eq(pacPosition).removeClass('pacman')
    pacPosition = newPosition
    const pacSquare = $squares.eq(pacPosition)
    checkForPoints(pacSquare)
    pacSquare.addClass('pacman')
      .removeClass('food')
      .removeClass('big-food')
      .attr('data-direction', directions[movement])
    // if pacsquare has class of any of the ghosts then run game over
    if (!$squares.toArray().some(square => square.classList.contains('food'))){
      setTimeout(gameOver(),1000)
    }
  }



  function changeGhostsToBlue() {
    blueGhosts = true
    ghostObjects.forEach(ghost => $squares.eq(ghost.position).addClass('blue'))
    setTimeout(showGhostAgain,3500)
  }

  // function changeGhostToEyes(){
  //   // blueGhosts = true
  //   ghostObjects.forEach(ghost => $squares.eq(ghost.position).addClass('eyes'))
  // }

  function showGhostAgain(){
    blueGhosts = false
    ghostObjects.forEach(ghost => $squares.eq(ghost.position).removeClass('blue'))
  }

  //track score
  function checkForPoints(location){
    if (location.hasClass('food')) {
      updateScore(10)
    }
    if (location.hasClass('big-food')) {
      updateScore(50)
      changeGhostsToBlue()
    }
    if (location.hasClass('ghost') && location.hasClass('blue')) {
      updateScore(200)
      location.addClass('eyes')
    }
    if (location.hasClass('ghost') && !location.hasClass('blue')) {
      gameOver()
    }
  }

  //update score
  function updateScore(points) {
    score += points
    $scoreBoard.text(`Current Score ${score}`)
  }

  //end game
  function gameOver(){
    clearTimeout(blinkyInterval)
    $board.hide()
    $scoreBoard.hide()
    $endScreen.show()
    $endScreenHeader.text('Game Over!!!')
    $endScreenPara.text(`You scored ${score} points`)
    $(document).off('keydown')
  }

  function restartGame() {
    welcomeToGame()
  }

  //allows movement
  function startMovement(){
    $(document).on('keydown', e => {
      if (!pacMoves) return
      // backward 37, up 38, forward 39, down 40
      switch(e.keyCode) {
        case 37: if(pacPosition % width > 0){
          movePac(-1)
        }
          break
        case 38: if(pacPosition - width >= 0) {
          movePac(-width)
        }
          break
        case 39: if(pacPosition % width < width-1) {
          movePac(1)
        }
          break
        case 40: if(pacPosition + width < width*width){
          movePac(width)
        }
          break
      }
      pacMoves = false
    })
  }

  welcomeToGame()
  //event listener to reset game on click
  $restartButton.on('click', restartGame)
  // event listener to start game on click
  $startButton.on('click', startGame)


})
