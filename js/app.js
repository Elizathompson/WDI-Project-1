$(() => {
  console.log('js loaded')

  //-----------------------------------------VARIABLES-----------------------------------------
  const $board = $('.gameboard')
  const width = 20
  let pacPosition = 0
  let currentPac = 0
  let direction = 'forward'

  // create board
  $board.attr('data-width', width)
  for(let i = 0; i<width*width; i++) {
    $board.append($('<div id='+ i +' />'))
  }

  // generate pacman
  const $squares = $('.gameboard div')
  $squares.eq(pacPosition).addClass('pacman')

  //-----------------------------------------FUNCTIONS-----------------------------------------

  //function to create maze
  function makeMaze() {
    $('#4,#5,#6,#7,#8,#9,#10,#11').addClass('wall')
  } makeMaze()
  

  //function to generate food
  function makeFood() {
    $squares.addClass('food')
  } makeFood()


  // function to move pacman
  function movePac() {
    currentPac = currentPac === 3 ? 0 : currentPac + 1
    $squares.eq(pacPosition)
      .addClass('pacman')
      .removeClass('food')
      .removeClass('big-food')
      .attr('data-step', currentPac)
      .attr('data-direction', direction)
    console.log(pacPosition)
  }

  //if pacPosition === div with class of 'wall' do not move pac



  //-----------------------------------------EVENT LISTENERS-----------------------------------------

  //event listener for key strokes
  $(document).on('keydown', e => {
    $squares.eq(pacPosition).removeClass('pacman')

    // left 37, up 38, right 39, down 40
    switch(e.keyCode) {
      case 37: if(pacPosition % width > 0){
        pacPosition--
        direction = 'backward'
      }
        break
      case 38: if(pacPosition - width >= 0) {
        pacPosition -= width
        direction = 'up'
      }
        break
      case 39: if(pacPosition % width < width-1) {
        pacPosition++
        direction = 'forward'
      }
        break
      case 40: if(pacPosition + width < width*width){
        pacPosition += width
        direction = 'down'
      }
        break
    }

    movePac()

  })



})
