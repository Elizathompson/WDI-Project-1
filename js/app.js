$(() => {
  console.log('js loaded')
  const width = 20
  const ghostMovementOptions = [-1, 1, -width, width]
  let ghostPosition
  const ghostDirections = {
    'orange-ghost': ghostMovementOptions[0],
    'red-ghost': ghostMovementOptions[1],
    'cyan-ghost': ghostMovementOptions[2],
    'pink-ghost': ghostMovementOptions[3]
  }

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
    clydeInterval = setInterval(() => moveGhost('orange-ghost'), 500)
    blinkyInterval = setInterval(() => moveGhost('red-ghost'), 500)
    inkyInterval = setInterval(() => moveGhost('cyan-ghost'), 500)
    pinkyInterval = setInterval(() => moveGhost('pink-ghost'), 500)
  }
  //----------Ghost Functions----------

  // makeGhosts is called in startGame and puts each ghost at a specific index on the gameboard and adds a class depending on which ghost it is
  function makeGhosts(){
    $squares.eq(209).addClass('orange-ghost')
    $squares.eq(190).addClass('red-ghost')
    $squares.eq(210).addClass('cyan-ghost')
    $squares.eq(189).addClass('pink-ghost')
  }

  function moveGhost(ghostClass) {
    const ghostPosition = $(`.gameboard .${ghostClass}`).index()
    const newGhostPosition = ghostPosition + ghostDirections[ghostClass]
    while (mazeArray.includes(newGhostPosition) || !(newGhostPosition % width > -1) ||
    !(newGhostPosition - width > 0) || !(newGhostPosition % width < width -1) || !(newGhostPosition + width < width*width)){
      ghostDirections[ghostClass] = ghostMovementOptions[Math.floor(Math.random()* 4)]
      console.log(ghostMovementOptions[Math.floor(Math.random()* 4)])
      return false
    }
    $squares.eq(ghostPosition).removeClass(ghostClass)
    $squares.eq(newGhostPosition).addClass(ghostClass)
  }

  //need function that changes colour of all the ghosts when superfood is eaten by pacman. Similar logic to when food is eaten except I want to remove the normal ghost classes, add a new generic blue  ghost class for a set interval. At interval end I want the old classes to go back on. Use CSS animation to make the temp blue class blink like the superFoodIndex


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

  //track score
  // need to add scoring that takes into account if pac eats ghosts when they have the temp class after eating superfood
  function checkForPoints(location){
    if (location.hasClass('food')) {
      updateScore(10)
    }
    if (location.hasClass('big-food')) {
      updateScore(50)
    }
    if (location.hasClass('orange-ghost') || location.hasClass('red-ghost') || location.hasClass('cyan-ghost') || location.hasClass('pink-ghost')) {
      gameOver()
    }
  }

  // function pacDies(){
  //   gameOver()
  // }

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
    })
  }

  welcomeToGame()
  //event listener to reset game on click
  $restartButton.on('click', restartGame)
  // event listener to start game on click
  $startButton.on('click', startGame)


})
