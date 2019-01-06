$(() => {
  console.log('js loaded')

  //-----------------------------------------VARIABLES-----------------------------------------
  const $board = $('.gameboard')
  const width = 20
  const mazeArray = [26, 33, 46, 53, 66, 73, 86, 93, 101, 102, 103, 104, 105, 106, 113, 114, 115, 116, 117, 118, 281, 282, 283, 284, 285, 286, 293, 294, 295, 296, 297, 298, 306, 313, 326, 333, 346, 353, 366, 373]
  const directions = {
    '-1': 'backward',
    [`-${width}`]: 'up',
    1: 'forward',
    [`${width}`]: 'down'
  }
  const $scoreBoard = $('.score-board')
  let pacPosition = 0
  let $squares
  let score = 0
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

  //start game
  function startGame() {
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

  function moveClyde(){
    const newClydePosition = clydePosition + ghostMovementOptions[movementDirectionClyde]
    if (mazeArray.includes(newClydePosition))
      return movementDirectionClyde = Math.floor(Math.random()* 3)
    $squares.eq(clydePosition).removeClass('orange-ghost')
    clydePosition = newClydePosition
    $squares.eq(clydePosition).addClass('orange-ghost')
  }

  function moveBlinky(){
    const newBlinkyPosition = blinkyPosition + ghostMovementOptions[movementDirectionBlinky]
    if (mazeArray.includes(newBlinkyPosition))
      return movementDirectionBlinky = Math.floor(Math.random()* 3)
    $squares.eq(blinkyPosition).removeClass('red-ghost')
    blinkyPosition = newBlinkyPosition
    $squares.eq(blinkyPosition).addClass('red-ghost')
  }

  function moveInky(){
    const newInkyPosition = inkyPosition + ghostMovementOptions[movementDirectionInky]
    if (mazeArray.includes(newInkyPosition))
      return movementDirectionInky = Math.floor(Math.random()* 3)
    $squares.eq(inkyPosition).removeClass('cyan-ghost')
    inkyPosition = newInkyPosition
    $squares.eq(inkyPosition).addClass('cyan-ghost')
  }


  function movePinky(){
    const newPinkyPosition = pinkyPosition + ghostMovementOptions[movementDirectionPinky]
    if (mazeArray.includes(newPinkyPosition))
      return movementDirectionPinky = Math.floor(Math.random()* 3)
    $squares.eq(pinkyPosition).removeClass('pink-ghost')
    pinkyPosition = newPinkyPosition
    $squares.eq(pinkyPosition).addClass('pink-ghost')
  }
  //reset game on click
  // function resetGame(){
  //   $(document).off('keydown')
  //   // need event listener for the click on reset button
  //   startGame()
  // }

  // create board
  function createBoard(){
    $board.attr('data-width', width)
    for(let i = 0; i<width*width; i++) {
      $board.append($('<div id='+ i +' />'))
    }
    $squares = $('.gameboard div')
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
      let superFoodId = Math.floor(Math.random()*$squares.length)
      while (mazeArray.includes(superFoodId) || pacPosition === superFoodId || clydePosition === superFoodId || blinkyPosition === superFoodId || inkyPosition === superFoodId || pinkyPosition === superFoodId) {
        superFoodId = Math.floor(Math.random()*$squares.length)
      }
      const superFoodLocation = $($squares[superFoodId])
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
    alert('game is over')
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
  startGame()



})
