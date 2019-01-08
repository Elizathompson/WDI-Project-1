$(() => {
  console.log('js loaded')
  //-----------------------------------------VARIABLES-----------------------------------------
  const width = 20
  //----------Ghost Variables----------
  const ghostMovementOptions = [-1,1,-width,width]
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
  let clydeInterval
  let blinkyInterval
  let inkyInterval
  let pinkyInterval
  let blueGhosts
  let blueGhostTimer
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
  const mazeArray = [46, 53, 66, 73, 86, 93, 102, 103, 104, 105, 106, 113, 114, 115, 116, 117, 282, 283, 284, 285, 286, 293, 294, 295, 296, 297, 306, 313, 326, 333, 346, 353]
  let $squares
  let score = 0
  //----------Pac Variables----------
  let pacPosition = 0
  let pacMoves = true
  let pacInterval



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
    blinkyInterval = setInterval(() => moveGhost('red'), 200)
    inkyInterval = setInterval(() => moveGhost('cyan'), 700)
    pinkyInterval = setInterval(() => moveGhost('pink'), 900)
    pacInterval = setInterval(() => pacMoves = true, 200)
  }

  //--------------------GHOSTS--------------------

  // FUNCTION TO MAKE THE GHOSTS AND START AT CERTAIN POSITION
  function makeGhosts(){
    $squares.eq(209).addClass('orange ghost')
    $squares.eq(190).addClass('red ghost')
    $squares.eq(210).addClass('cyan ghost')
    $squares.eq(189).addClass('pink ghost')
  }

  //FUNCTION TO MOVE THE GHOSTS
  function moveGhost(ghostClass) {
    const ghostPosition = $(`.gameboard .${ghostClass}.ghost`).index()
    const pacPosition = $('.pacman').index()
    let attempts = 20
    let newGhostPosition = getPossibleMove(ghostPosition)
    const ghostIsBlue = $squares.eq(ghostPosition).hasClass('blue')

    while(
      !moveIsValid(newGhostPosition) ||
      !moveIsIntelligent(ghostPosition, newGhostPosition, pacPosition, ghostIsBlue)
    ) {
      newGhostPosition = getPossibleMove(ghostPosition)
      attempts--

      if(!attempts) return false
    }

    $squares.eq(ghostPosition).removeClass(`${ghostClass} ghost blue`)
    $squares.eq(newGhostPosition).addClass(`${ghostClass} ghost`)

    ghostObjects.find(ghost => ghost.color === ghostClass).direction = ghostDirections[ghostClass]
    const index = ghostObjects.findIndex(ghost => ghost.color === ghostClass)
    ghostObjects[index].position += ghostDirections[ghostClass]

    if(blueGhosts) $squares.eq(newGhostPosition).addClass('blue')

    if ($squares.eq(newGhostPosition).hasClass('pacman')) gameOver()
  }

  // FUNCTION TO FIND THE NEXT MOVE FOR THE GHOSTS
  function getPossibleMove(ghostPosition) {
    return ghostMovementOptions[Math.floor(Math.random() * ghostMovementOptions.length)] + ghostPosition
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
  function moveIsIntelligent(currentPosition, newPosition, pacPosition, isBlue) {
    if(isBlue) return Math.abs(currentPosition - pacPosition) < Math.abs(newPosition - pacPosition)
    return Math.abs(currentPosition - pacPosition) > Math.abs(newPosition - pacPosition)
  }


  //FUNCTION TO TURN THE GHOSTS BLUE - CALLED IN POINTS FUNCTION WHEN SUPERFOOD IS EATEN
  function changeGhostsToBlue() {
    blueGhosts = true
    ghostObjects.forEach(ghost => $squares.eq(ghost.position).addClass('blue'))
    blueGhostTimer = setTimeout(showGhostAgain,3500)
  }

  // function changeGhostToEyes(location){
  //   if ($squares.eq(location).hasClass('eyes')) {
  //     setTimeout(8000)
  //   }
  // }

  //FUNCTION TO TURN THE GHOSTS BACK TO NORMAL AFTER BEING BLUE FOR SET TIME
  function showGhostAgain(){
    blueGhosts = false
    ghostObjects.forEach(ghost => $squares.eq(ghost.position).removeClass('blue'))
  }

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
    pacPosition = 0
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

  // FUNCTION TO MOVE PACMAN
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
      while (mazeArray.includes(superFoodIndex) || pacPosition === superFoodIndex || ghostPosition === superFoodIndex) {
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
    if (location.hasClass('ghost') && !location.hasClass('blue')) {
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


})
