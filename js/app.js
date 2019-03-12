$(() => {
  //-----------------------------------------VARIABLES-----------------------------------------
  const width = 20
  const pacChomp = document.querySelector('.eat')
  //----------Ghost Variables----------
  const ghostMovementOptions = [-1,1,-width,width]
  let blueTimerId = 0
  const ghostInfo = {
    orange: {
      startPosition: 209,
      position: 209,
      direction: -1,
      eyes: false,
      blue: false,
      timerId: 0,
      speed: 650
    },
    red: {
      startPosition: 190,
      position: 190,
      direction: 1,
      eyes: false,
      blue: false,
      timerId: 0,
      speed: 500
    },
    cyan: {
      startPosition: 210,
      position: 210,
      direction: -width,
      eyes: false,
      blue: false,
      timerId: 0,
      speed: 300
    },
    pink: {
      startPosition: 189,
      position: 189,
      direction: width,
      eyes: false,
      blue: false,
      timerId: 0,
      speed: 800
    }
  }
  const pacInfo = {
    startPosition: 270,
    position: 270,
    currentStep: 0,
    canMove: true,
    timerId: 0
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
  const $endScreen = $('.end')
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
  let playing = true

  //-----------------------------------------FUNCTIONS-----------------------------------------
  // welcomeToGame is called on page load and gives player option to start game on button click
  function welcomeToGame(){
    $startScreen.show()
    // $board.hide()
    $scoreBoard.show()
    $endScreen.hide()
    $startScreenHeader.text('Welcome to Pac Man')
    $startScreenPara.text('Click the button to start the game')
    destroyBoard()
    createBoard()
    updateScore(0)
    makePac()
    createMaze()
    makeGhosts()
    makeSuperFood()
  }

  // startGame is called when $startButton is clicked
  function startGame() {
    $scoreBoard.show()
    $startScreen.hide()
    $endScreen.hide()
    let i = 3
    const $countdown = $('<div />').addClass('countdown')
    $countdown.appendTo('.main')
    const startCountdown = setInterval(() => {
      $countdown.text(i)
      i --
      if (i < 0) {
        $countdown.css('display', 'none')
        startGhosts()
        clearInterval(startCountdown)
        startMovement()
      }
    }, 1000)
  }

  //--------------------GHOSTS--------------------

  // FUNTION TO RESET GHOST POSITIONS

  function startGhosts() {
    resetGhostPositions()
    Object.keys(ghostInfo).forEach((ghostClass, i) => {
      setTimeout(() => {
        ghostInfo[ghostClass].timerId = setInterval(() => {
          moveGhost(ghostClass)
        }, ghostInfo[ghostClass].speed)
      }, 1000 * (i+1))
    })
  }

  function resetGhostPositions() {
    Object.keys(ghostInfo).forEach(ghostClass => {
      ghostInfo[ghostClass].position = ghostInfo[ghostClass].startPosition
    })
  }

  // FUNCTION TO MAKE THE GHOSTS AND START AT CERTAIN POSITION
  function makeGhosts(){
    Object.keys(ghostInfo).forEach(ghostClass => {
      $squares.eq(ghostInfo[ghostClass].startPosition).addClass(`${ghostClass} ghost`)
    })
  }

  function makeIntelligentMove(currentPosition, newPosition, destination, isToward) {
    for (let x = 0; x < 20; x++) {
      if (
        !moveIsIntelligent(currentPosition, newPosition, destination, isToward) ||
        !moveIsValid(newPosition)
      ) {
        newPosition = getPossibleMove(currentPosition)
      }
    }

    for (let x = 0; x < 3; x++) {
      if(!moveIsValid(newPosition)) {
        newPosition = getPossibleMove(currentPosition)
      }
    }

    return newPosition
  }

  //FUNCTION TO MOVE THE GHOSTS
  function moveGhost(ghostClass) {
    const ghostToMove = ghostInfo[ghostClass]
    let newGhostPosition = getPossibleMove(ghostToMove.position)
    const $currentGhostSquare = $squares.eq(ghostToMove.position)

    if(ghostToMove.blue) {
      newGhostPosition = makeIntelligentMove(ghostToMove.position, newGhostPosition, pacInfo.position, false)
    } else if(ghostToMove.eyes) {
      newGhostPosition = makeIntelligentMove(ghostToMove.position, newGhostPosition, ghostToMove.startPosition, true)
    } else {
      newGhostPosition = makeIntelligentMove(ghostToMove.position, newGhostPosition, pacInfo.position, true)
    }

    const $newGhostSquare = $squares.eq(newGhostPosition)

    $newGhostSquare.addClass(`${ghostClass} ghost`)
    if(ghostToMove.blue) $newGhostSquare.addClass('blue')
    if(ghostToMove.eyes) $newGhostSquare.addClass('eyes')

    if(
      (ghostToMove.position === ghostToMove.startPosition) &&
      $newGhostSquare.hasClass('eyes')
    ) {
      $newGhostSquare.removeClass('blue eyes')
      ghostToMove.blue = false
      ghostToMove.eyes = false
    }

    if (
      $currentGhostSquare.hasClass('pacman') &&
      !$currentGhostSquare.hasClass('blue') &&
      !$currentGhostSquare.hasClass('eyes')
    ) {
      gameOver()
    }

    $currentGhostSquare.removeClass(`${ghostClass} ghost blue eyes`)

    ghostToMove.position = newGhostPosition
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
  function moveIsIntelligent(currentPosition, newPosition, destination, moveToward) {
    if(moveToward) return Math.abs(currentPosition - destination) > Math.abs(newPosition - destination)
    return Math.abs(currentPosition - destination) < Math.abs(newPosition - destination)
  }

  //FUNCTION TO TURN THE GHOSTS BLUE - CALLED IN POINTS FUNCTION WHEN SUPERFOOD IS EATEN
  function changeGhostsToBlue() {
    clearTimeout(blueTimerId)

    $('.ghost').addClass('blue')
    Object.keys(ghostInfo).forEach(ghostClass => {
      ghostInfo[ghostClass].blue = true
    })
    blueTimerId = setTimeout(() => {
      $('.ghost.blue').removeClass('blue')
      Object.keys(ghostInfo).forEach(ghostClass => {
        ghostInfo[ghostClass].blue = false
      })
    }, 3500)
  }

  //--------------------GAMEBOARD--------------------

  // FUNCTION TO CREATE THE GAMEBOARD
  function createBoard(){
    $board.attr('data-width', width)
    for(let i = 0; i<width*width; i++) $board.append($('<div class="food" id='+ i +' />'))
    $squares = $('.gameboard div')
  }

  // FUNCTION TO CLEAR THE BOARD ON GAME RESET
  function destroyBoard() {
    pacInfo.position = pacInfo.startPosition
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
    $squares.eq(pacInfo.startPosition)
      .removeClass('food')
      .addClass('pacman')
  }

  function playChomp(fileName){
    if (playing === true) {
      pacChomp.src = `assets/${fileName}.wav`
      pacChomp.currentTime = 0
      pacChomp.play()
      playing = false
    } pacChomp.addEventListener('ended', () => playing = true )
  }

  function playDeath() {
    pacChomp.pause()
    document.querySelector('.death').play()
  }


  // FUNCTION TO MOVE PACMAN
  function movePac(movement) {
    pacInfo.currentStep = pacInfo.currentStep === 1 ? 0 : pacInfo.currentStep + 1
    const newPosition = pacInfo.position + movement
    if (mazeArray.includes(newPosition)) return
    $squares.eq(pacInfo.position).removeClass('pacman')
    pacInfo.position = newPosition
    const $pacSquare = $squares.eq(pacInfo.position)
    checkForPoints(pacInfo.position)
    $pacSquare.addClass('pacman')
      .removeClass('food')
      .removeClass('big-food')
      .attr('data-direction', directions[movement])
      .attr('data-step', pacInfo.currentStep )

    if (!$squares.toArray().some(square => square.classList.contains('food'))){
      gameOver()
    }

    if (
      $pacSquare.hasClass('ghost') &&
      !$pacSquare.hasClass('blue') &&
      !$pacSquare.hasClass('eyes')
    ){
      gameOver()
    }
  }

  //  FUNCTION TO ALLOW MOVEMENT TO START ON KEYDOWN
  function startMovement(){
    $(document).on('keyup', e => {
      // backward 37, up 38, forward 39, down 40
      switch(e.keyCode) {
        case 37: if(pacInfo.position % width > 0){
          movePac(-1)
        }
          break
        case 38: if(pacInfo.position - width >= 0) {
          movePac(-width)
        }
          break
        case 39: if(pacInfo.position % width < width-1) {
          movePac(1)
        }
          break
        case 40: if(pacInfo.position + width < width*width){
          movePac(width)
        }
          break
      }
    })
  }
  function stopMovement(){
    $(document).off('keyup')
  }

  //--------------------FOOD--------------------

  // FUNCTION TO GENERATE SUPERFOOD AT RANDOM INDEX
  function makeSuperFood() {
    const $foodSquares = $('.food')
    console.log($foodSquares.length)
    for(let i = 0; i<10; i++) {
      const superFoodIndex = Math.floor(Math.random()*$foodSquares.length)
      $($foodSquares[superFoodIndex]).addClass('big-food').removeClass('food')
    }
  }


  //--------------------SCORING--------------------

  // FUNCTION TO CHECK IF PACMAN CURRENT LOCATION ADDS POINTS ETC
  function checkForPoints(index){
    const $square = $squares.eq(index)
    const ghost = Object.values(ghostInfo).find(ghost => ghost.position === index)
    console.log(ghost)
    if ($square.hasClass('food')) {
      updateScore(10)
      playChomp('pacman_chomp (1)')
    }
    if ($square.hasClass('big-food')) {
      updateScore(50)
      changeGhostsToBlue()
    }
    if ($square.hasClass('ghost') && $square.hasClass('blue')) {
      updateScore(200)
      $square.addClass('eyes')
      ghost.eyes = true
    }
    if ($square.hasClass('ghost') && !$square.hasClass('blue') && !$square.hasClass('eyes')) {
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
    stopMovement()
    playDeath()
    // pacChomp.pause()
    // document.querySelector('.death').play()
    Object.keys(ghostInfo).forEach(ghostClass => {
      clearInterval(ghostInfo[ghostClass].timerId)
    })
    clearInterval(pacInfo.timerId)
    setTimeout(() => {
      $endScreen.show()
      $endScreenHeader.text('Game Over')
      $endScreenPara.text(`You scored ${score} points`)
    },500)
  }

  // FUNCTION TO RESTART GAME ON RESET BUTTON CLICK
  welcomeToGame()

  //-----------------------------------------EVENT LISTENERS-----------------------------------------

  //event listener to reset game on click
  $restartButton.on('click', welcomeToGame)
  // event listener to start game on click
  $startButton.on('click', startGame)
  // $(document).on('keydown', playChomp)


})
