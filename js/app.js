$(() => {
  console.log('js loaded')

  //---------VARIABLES---------
  const $board = $('.gameboard')
  console.log($board)
  // const $food = $('.food')
  // const $wall = $('.wall')
  // const $pac = $('.pacman')
  const width = 20
  let pacPosition = 0
  let currentPac = 0
  let direction = 'forward'

  $board.attr('data-width', width)



  for(let i = 0; i<width*width; i++) {
    $board.append($('<div id='+ i +' />'))
  }

  const $squares = $('.gameboard div')
  $squares.eq(pacPosition).addClass('pacman')


  //---------FUNCTIONS---------
  //function to create maze
  function makeMaze() {
    $('#4,#5,#6,#7,#8,#9,#10,#11').addClass('wall')
  } makeMaze()

  //function to generate food
  function makeFood() {
    $squares.addClass('food')
  } makeFood()


  //this function runs based on the keystroke. If pacs position on the grid then add 1 to current position of pac. Add the class of pacman to the div at the new position and remove the class of food so that we no longer see the food.
  function movePac() {
    currentPac = currentPac === 3 ? 0 : currentPac + 1
    $squares.eq(pacPosition)
      .addClass('pacman')
      .removeClass('food')
      .removeClass('big-food')
      .attr('data-step', currentPac)
      .attr('data-direction', direction)
  }


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
