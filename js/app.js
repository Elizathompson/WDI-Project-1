$(() => {
  console.log('js loaded')

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
  const width = 20
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
  const ghostMovementOptions = [-1, 1, -width, width]
  let clydePosition
  let clydeInterval
  let movementDirectionClyde = Math.floor(Math.random()* 3)
  let blinkyPosition
  let blinkyInterval
  let movementDirectionBlinky = Math.floor(Math.random()* 3)
  let inkyPosition
  let inkyInterval
  let movementDirectionInky = Math.floor(Math.random()* 3)
  let pinkyPosition
  let pinkyInterval
  let movementDirectionPinky = Math.floor(Math.random()* 3)




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
    createBoard()
    makeFood()
    makePac()
    createMaze()
    startMovement()
    makeSuperFood()
    makeGhosts()
    clydeInterval = setInterval(moveClyde, 500)
    blinkyInterval = setInterval(moveBlinky, 300)
    inkyInterval = setInterval(moveInky, 700)
    pinkyInterval = setInterval(movePinky, 900)
  }
  //----------Ghost Functions----------

  // makeGhosts is called in startGame and puts each ghost at a specific index on the gameboard and adds a class depending on which ghost it is
  function makeGhosts(){
    clydePosition =  209
    $squares.eq(clydePosition).addClass('orange-ghost')
    blinkyPosition = 190
    $squares.eq(blinkyPosition).addClass('red-ghost')
    inkyPosition = 210
    $squares.eq(inkyPosition).addClass('cyan-ghost')
    pinkyPosition = 189
    $squares.eq(pinkyPosition).addClass('pink-ghost')
  }

  // moveClyde is called inside the startGame function where we set the interval for Clyde which determines how quickly he moves around the gameboard. Inside this function we are setting a  new variable which says that the newClydePosition is clydes current position plus a random movement picked from the ghostMovementOptions array. Then we are checking to see if the new position that we want him to move to is included within the mazeArray, if it is then we want the function to find a new location for Clyde as we dont want him walking through the maze walls. If the new position index isnt included in the mazeArray then we are removing clyde from his current position and adding a clas at his new position to show the movement.
  function moveClyde(){
    const newClydePosition = clydePosition + ghostMovementOptions[movementDirectionClyde]
    if (mazeArray.includes(newClydePosition))
      return movementDirectionClyde = Math.floor(Math.random()* 3)
    $squares.eq(clydePosition).removeClass('orange-ghost')
    clydePosition = newClydePosition
    $squares.eq(clydePosition).addClass('orange-ghost')
  }

  // moveBlinky is called inside the startGame function where we set the interval for Blinky which determines how quickly he moves around the gameboard
  function moveBlinky(){
    const newBlinkyPosition = blinkyPosition + ghostMovementOptions[movementDirectionBlinky]
    if (mazeArray.includes(newBlinkyPosition))
      return movementDirectionBlinky = Math.floor(Math.random()* 3)
    $squares.eq(blinkyPosition).removeClass('red-ghost')
    blinkyPosition = newBlinkyPosition
    $squares.eq(blinkyPosition).addClass('red-ghost')
  }

  // moveInky is called inside the startGame function where we set the interval for Inky which determines how quickly he moves around the gameboard
  function moveInky(){
    const newInkyPosition = inkyPosition + ghostMovementOptions[movementDirectionInky]
    if (mazeArray.includes(newInkyPosition))
      return movementDirectionInky = Math.floor(Math.random()* 3)
    $squares.eq(inkyPosition).removeClass('cyan-ghost')
    inkyPosition = newInkyPosition
    $squares.eq(inkyPosition).addClass('cyan-ghost')
  }

  // movePinky is called inside the startGame function where we set the interval for Pinky which determines how quickly he moves around the gameboard
  function movePinky(){
    const newPinkyPosition = pinkyPosition + ghostMovementOptions[movementDirectionPinky]
    if (mazeArray.includes(newPinkyPosition))
      return movementDirectionPinky = Math.floor(Math.random()* 3)
    $squares.eq(pinkyPosition).removeClass('pink-ghost')
    pinkyPosition = newPinkyPosition
    $squares.eq(pinkyPosition).addClass('pink-ghost')
  }

  //need function that changes colour of all the ghosts when superfood is eaten by pacman. Similar logic to when food is eaten except I want to remove the normal ghost classes, add a new generic blue  ghost class for a set interval. At interval end I want the old classes to go back on. Use CSS animation to make the temp blue class blink like the superFoodIndex


  // create board
  function createBoard(){
    $board.attr('data-width', width)
    const $boardLength = $board.find('div')
    console.log($boardLength)
    if( $boardLength.length === 0){
      for(let i = 0; i<width*width; i++) {
        $board.append($('<div id='+ i +' />'))
      }
      $squares = $('.gameboard div')
    }
  }

  // generate pacman
  function makePac(){
    $squares.eq(pacPosition)
      .removeClass('food')
      .addClass('pacman')
  }

  //generate food
  function makeFood() {
    $squares.eq(20).addClass('food')
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
      while (mazeArray.includes(superFoodIndex) || pacPosition === superFoodIndex || clydePosition === superFoodIndex || blinkyPosition === superFoodIndex || inkyPosition === superFoodIndex || pinkyPosition === superFoodIndex) {
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
    $endScreenPara.text(`You scored ${score}`)
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
