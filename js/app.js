$(() => {
  //-----------------------------------------VARIABLES-----------------------------------------
  const width = 20
  const pacChomp = document.querySelector('audio')
  //----------Ghost Variables----------
  const ghostMovementOptions = [-1,1,-width,width]
  const ghostDirections = {
    'orange': ghostMovementOptions[0],
    'red': ghostMovementOptions[1],
    'cyan': ghostMovementOptions[2],
    'pink': ghostMovementOptions[3]
  }
  const ghostObjects = [
    {
      color: 'orange',
      startPosition: 209,
      position: 209,
      direction: '',
      eyes: false
    },
    {
      'color': 'red',
      startPosition: 190,
      'position': 190,
      'direction': '',
      'eyes': false
    },
    {
      'color': 'cyan',
      startPosition: 210,
      'position': 210,
      'direction': '',
      'eyes': false
    },
    {
      'color': 'pink',
      startPosition: 189,
      'position': 189,
      'direction': '',
      'eyes': false
    }
  ]
  let clydeInterval
  let blinkyInterval
  let inkyInterval
  let pinkyInterval
  let blueGhosts
  let blueGhostTimer
  let eyesPosition
  const clydeStart = 209
  const blinkyStart = 190
  const inkyStart = 210
  const pinkyStart = 189
  const ghostPositions = {
    'orange': clydeStart,
    'red': blinkyStart,
    'cyan': inkyStart,
    'pink': pinkyStart
  }
  const directions = {
    '-1': 'backward',
    [`-${width}`]: 'up',
    1: 'forward',
    [`${width}`]: 'down'
  }
  //----------Board Variables----------
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
  const mazeArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 39, 59, 79, 99, 119, 139, 159, 179, 199, 219, 239, 259, 279, 299, 319, 339, 359, 379, 302, 303, 304, 305, 306, 307, 312, 313, 314, 315, 316, 317, 42, 43, 44, 45, 62, 63, 64, 65, 47, 48, 67, 68, 54, 55, 56, 57, 74, 75, 76, 77, 51, 52, 71, 72, 102, 103, 104, 105, 142, 143, 144, 145, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 154, 155, 156, 157, 352, 353, 354, 355, 356, 357, 342, 343, 344, 345, 346, 347, 349, 289,309, 329, 350, 330, 310, 290, 182, 183, 202, 222, 242, 262, 263, 243, 223, 203, 185, 205, 225, 245, 265, 195, 215, 235, 255, 275, 276, 256, 236, 216, 196, 197, 217, 237, 257, 277, 267, 272]

  let $squares
  let score = 0
  //----------Pac Variables----------
  let pacPosition = 270
  let pacMoves = true
  let pacInterval
  let currentStep = 0
  let playing = true



  //-----------------------------------------FUNCTIONS-----------------------------------------

  // welcomeToGame is called on page load and gives player option to start game on button click
  function welcomeToGame(){
    $startScreen.show()
    // $board.hide()
    $scoreBoard.hide()
    $endScreen.hide()
    $startScreenHeader.text('Welcome to Pac Man')
    $startScreenPara.text('Click the button to start the game')
    destroyBoard()
    createBoard()
    makeFood()
    makePac()
    createMaze()
    makeSuperFood()
    makeGhosts()
  }

  // startGame is called when $startButton is clicked
  function startGame() {
    // $board.show()
    $scoreBoard.show()
    $startScreen.hide()
    $endScreen.hide()
    resetGhostPositions()


    startMovement()


    setTimeout(() => {
      clydeInterval = setInterval(() => moveGhost('orange'), 650)
    }, 1000)
    setTimeout(() => {
      blinkyInterval = setInterval(() => moveGhost('red'), 300)
    }, 4000)
    setTimeout(() => {
      inkyInterval = setInterval(() => moveGhost('cyan'), 800)
    }, 2000)
    setTimeout(() => {
      pinkyInterval = setInterval(() => moveGhost('pink'), 1200)
    }, 3000)
    pacInterval = setInterval(() => pacMoves = true, 50)
  }

  //--------------------GHOSTS--------------------

  // FUNTION TO RESET GHOST wallPositions

  function resetGhostPositions() {
    Object.values(ghostObjects).forEach(ghost => {
      ghost.position = ghost.startPosition
    })
  }

  // FUNCTION TO MAKE THE GHOSTS AND START AT CERTAIN POSITION
  function makeGhosts(){
    $squares.eq(ghostObjects[0].startPosition).addClass('orange ghost')
    $squares.eq(ghostObjects[1].startPosition).addClass('red ghost')
    $squares.eq(ghostObjects[2].startPosition).addClass('cyan ghost')
    $squares.eq(ghostObjects[3].startPosition).addClass('pink ghost')
  }



  //FUNCTION TO MOVE THE GHOSTS
  function moveGhost(ghostClass) {
    console.log('ghosts are blue',blueGhosts)
    const ghostToMove = ghostObjects.find(ghost => ghost.color === ghostClass)
    const ghostPosition = ghostPositions[ghostClass]
    const pacPosition = $('.pacman').index()
    let newGhostPosition = getPossibleMove(ghostPosition)
    const eyesPosition = $squares.eq(ghostPosition).hasClass('eyes')
    console.log('inside movement')


    for (let x = 0; x < 20; x++) {
      if (!moveIsValid(newGhostPosition) ||
      !moveIsIntelligent(ghostPosition, newGhostPosition, pacPosition, blueGhosts) ||
      !moveIsIntelligent(ghostPosition, newGhostPosition, ghostToMove.startPosition, !eyesPosition)
      ) {
        console.log('changing move to find intelligent one')
        newGhostPosition = getPossibleMove(ghostPosition)
      }
    }

    for (let x = 0; x < 3; x++) {
      if(
        !moveIsValid(newGhostPosition)
      ) {
        console.log('ignoring intelligent move rule')
        newGhostPosition = getPossibleMove(ghostPosition)
      }
    }

    ghostToMove.direction = ghostDirections[ghostClass]
    ghostToMove.position += ghostDirections[ghostClass]

    $squares.eq(ghostPosition).removeClass(`${ghostClass} ghost blue`)
    $squares.eq(newGhostPosition).addClass(`${ghostClass} ghost`)
    if(blueGhosts) $squares.eq(newGhostPosition).addClass('blue')
    if(eyesPosition) $squares.eq(newGhostPosition).addClass('eyes')

    if ($squares.eq(newGhostPosition).hasClass('pacman') && !blueGhosts && !eyesPosition) gameOver()

    ghostPositions[ghostClass] = newGhostPosition
  }

  // FUNCTION TO FIND THE NEXT MOVE FOR THE GHOSTS
  function getPossibleMove(ghostPosition) {
    const wallPositions = getWallPosition(ghostPosition)
    const possibleMoves = ghostMovementOptions.filter(index => !wallPositions.includes(index))
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)] + ghostPosition
  }

  function getWallPosition(ghostPosition) {
    return ghostMovementOptions.filter(index => $squares.eq(ghostPosition+index).hasClass('wall'))
  }

  // FUNCTION TO CHECK IF THE GHOST IS ALLOWED TO MOVE TO NEXT POSITION SELECTED
  function moveIsValid(newGhostPosition) {
    if($squares.eq(newGhostPosition).hasClass('ghost')) return false

    if (
      mazeArray.includes(newGhostPosition) ||
      newGhostPosition - width < -width ||
      newGhostPosition % width === width ||
      newGhostPosition % width === 0 || //right works
      newGhostPosition + width >= width*width
    ){
      return false
    }

    return true
  }

  // FUNCTION TO CHECK IF MOVE IS TOWARDS PAC OR AWAY FROM PAC WHEN BLUE
  function moveIsIntelligent(currentPosition, newPosition, destination, ghostClassIs) {
    if(ghostClassIs) return Math.abs(currentPosition - destination) < Math.abs(newPosition - destination)
    return Math.abs(currentPosition - destination) > Math.abs(newPosition - destination)
  }

  //FUNCTION TO TURN THE GHOSTS BLUE - CALLED IN POINTS FUNCTION WHEN SUPERFOOD IS EATEN
  function changeGhostsToBlue() {
    blueGhosts = true
    // ghostObjects.forEach(ghost => $squares.eq(ghost.position).addClass('blue'))
    setTimeout(() => {
      blueGhosts = false
    }, 3500)
  }

  // function respawnGhost(){
  //   eyesPosition === clydeStart)
  //   ghostObjects.forEach(ghost => $squares.eq(ghost.position).removeClass('eyes'))
  // }

  //FUNCTION TO TURN THE GHOSTS BACK TO NORMAL AFTER BEING BLUE FOR SET TIME\
  // DONT NEED THIS NOW SINCE ITS ALL HANDLED IN MOVEMENT CODE
  // function showGhostAgain(){
  //   blueGhosts = false
  //   // ghostObjects.forEach(ghost => $squares.eq(ghost.position).removeClass('blue'))
  // }

  //--------------------GAMEBOARD--------------------

  // FUNCTION TO CREATE THE GAMEBOARD
  function createBoard(){
    $board.attr('data-width', width)
    for(let i = 0; i<width*width; i++) {
      $board.append($('<div id='+ i +' />'))
    }
    $squares = $('.gameboard div')
  }

  // FUNCTION TO CLEAR THE BOARD ON GAME RESET
  function destroyBoard() {
    pacPosition = 270
    score = 0
    $board.empty()
  }

  // FUNCTION TO CREATE THE INTERNAL MAZE
  function createMaze(){
    mazeArray.forEach(mazeId => {
      $(`[id='${mazeId}']`).removeClass('food')
      $(`[id='${mazeId}']`).addClass('wall')
    })
  }

  //--------------------PACMAN--------------------

  // FUNCTION TO MAKE PACMAN
  function makePac(){
    $squares.eq(pacPosition)
      .removeClass('food')
      .addClass('pacman')
  }

  function playChomp(){
    if (playing === true) {
      pacChomp.src = 'assets/pacman_chomp (1).wav'
      pacChomp.play()
      playing = false
    } pacChomp.addEventListener('ended', () => playing = true )
  }



  // FUNCTION TO MOVE PACMAN
  function movePac(movement) {
    currentStep = currentStep === 1 ? 0 : currentStep + 1
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
      .attr('data-step', currentStep )
    // if pacsquare has class of any of the ghosts then run game over
    if (!$squares.toArray().some(square => square.classList.contains('food'))){
      setTimeout(gameOver(),1000)
    }
  }

  //  FUNCTION TO ALLOW MOVEMENT TO START ON KEYDOWN
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

  //--------------------FOOD--------------------

  //  FUNCTION TO GENERATE FOOD ON ALL SQUARES
  function makeFood() {
    $squares.addClass('food')
  }

  // FUNCTION TO GENERATE SUPERFOOD AT RANDOM INDEX
  function makeSuperFood() {
    for(let i = 0; i<10; i++) {
      let superFoodIndex = Math.floor(Math.random()*$squares.length)
      while (
        mazeArray.includes(superFoodIndex) ||
        pacPosition === superFoodIndex ||
        Object.values(ghostPositions).includes(superFoodIndex)) {
        superFoodIndex = Math.floor(Math.random()*$squares.length)
      }
      const superFoodLocation = $($squares[superFoodIndex])
      superFoodLocation.addClass('big-food')
      superFoodLocation.removeClass('food')
    }
  }


  //--------------------SCORING--------------------

  // FUNCTION TO CHECK IF PACMAN CURRENT LOCATION ADDS POINTS ETC
  function checkForPoints(location){
    if (location.hasClass('food')) {
      updateScore(10)
      playChomp()
    }
    if (location.hasClass('big-food')) {
      updateScore(50)
      changeGhostsToBlue()
    }
    if (location.hasClass('ghost') && location.hasClass('blue')) {
      updateScore(200)
      location.addClass('eyes')
      clearTimeout(blueGhostTimer)
    }
    if (location.hasClass('ghost') && !location.hasClass('blue') && !location.hasClass('eyes')) {
      gameOver()
    }
  }

  // FUNCTION TO UPDATE SCOREBOARD
  function updateScore(points) {
    score += points
    $scoreBoard.text(`Current Score ${score}`)
  }

  //--------------------END GAME--------------------

  // FUNCTION FOR GAMEOVER
  function gameOver(){
    clearInterval(clydeInterval)
    clearInterval(blinkyInterval)
    clearInterval(inkyInterval)
    clearInterval(pinkyInterval)
    clearInterval(pacInterval)
    $board.hide()
    $scoreBoard.hide()
    $endScreen.show()
    $endScreenHeader.text('Game Over!!!')
    $endScreenPara.text(`You scored ${score} points`)
    $(document).off('keydown')
  }

  // FUNCTION TO RESTART GAME ON RESET BUTTON CLICK
  function restartGame() {
    welcomeToGame()
  }


  welcomeToGame()

  //-----------------------------------------EVENT LISTENERS-----------------------------------------

  //event listener to reset game on click
  $restartButton.on('click', restartGame)
  // event listener to start game on click
  $startButton.on('click', startGame)

  // $(document).on('keydown', playChomp)


})
