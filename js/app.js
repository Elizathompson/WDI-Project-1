$(() => {
  console.log('js loaded')

  //-----------------------------------------VARIABLES-----------------------------------------
  const $board = $('.gameboard')
  const width = 20
  const mazeArray = [26, 33, 46, 53, 66, 73, 86, 93, 101, 102, 103, 104, 105, 106, 113, 114, 115, 116, 117, 118, 168, 169, 170, 171, 188, 191, 208, 211, 228, 229, 230, 231, 281, 282, 283, 284, 285, 286, 293, 294, 295, 296, 297, 298, 306, 313, 326, 333, 346, 353, 366, 373]
  const directions = {
    '-1': 'backward',
    [`-${width}`]: 'up',
    1: 'forward',
    [`${width}`]: 'down'
  }
  let pacPosition = 0
  let $squares



  //-----------------------------------------FUNCTIONS-----------------------------------------

  //start game
  function startGame() {
    createBoard()
    makePac()
    makeFood()
    createMaze()
    startMovement()
    makeSuperFood()
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
    $squares.eq(pacPosition).addClass('pacman')
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
      console.log('superfood', superFoodId)
      while (mazeArray.includes(superFoodId)) {
        console.log('chancing things')
        superFoodId = Math.floor(Math.random()*$squares.length)
      }
      const superFoodLocation = $($squares[superFoodId])
      superFoodLocation.addClass('big-food')
    }
  }


  // function to move pacman
  function movePac(movement) {
    const newPosition = pacPosition + movement
    if (mazeArray.includes(newPosition)) return
    $squares.eq(pacPosition).removeClass('pacman')
    pacPosition = newPosition
    $squares.eq(pacPosition)
      .addClass('pacman')
      .removeClass('food')
      .removeClass('big-food')
      .attr('data-direction', directions[movement] )
  }

  //-----------------------------------------EVENT LISTENERS-----------------------------------------

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
