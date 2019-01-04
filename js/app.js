$(() => {
  console.log('js loaded')

  //---------VARIABLES---------
  const $board = $('.gameboard')
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

  const $grid = $('.gameboard div')
  $grid.eq(pacPosition).addClass('pacman')


  //---------FUNCTIONS---------

  //this function runs based on the keystroke. If pacs position on the grid then add 1 to current position of pac. Add the class of pacman to the div at the new position and remove the class of food so that we no longer see the food.
  function movePac() {
    currentPac = currentPac === 3 ? 0 : currentPac + 1
    $grid.eq(pacPosition)
      .addClass('pacman')
      // .removeClass('food')
      // .removeClass('big-food')
      .attr('data-step', currentPac)
      .attr('data-direction', direction)
  }


  //event listener for key strokes
  $(document).on('keydown', e => {
    $grid.eq(pacPosition).removeClass('pacman')

    // left 37, up 38, right 39, down 40
    switch(e.keyCode) {
      case 37: if(pacPosition % width > 0){
        pacPosition--
        direction = 'backward'
      }
        break
      case 38: if(pacPosition - width >= 0) pacPosition -= width
        break
      case 39: if(pacPosition % width < width-1) {
        pacPosition++
        direction = 'forward'
      }
        break
      case 40: if(pacPosition + width < width*width) pacPosition += width
        break
    }

    movePac()

  })




})
