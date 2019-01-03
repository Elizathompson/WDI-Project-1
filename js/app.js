$(() => {
  console.log('js loaded')

  //---------VARIABLES---------
  const $board = $('.gameboard')
  const $food = $('.food')
  const $wall = $('.wall')
  const $pac = $('.pacman')
  const width = 5
  let pacPosition = 0
  let currentPac = 0
  let timerId
  let direction = 'forward'

  const $grid = $('.gameboard div')
  $grid.eq(pacPosition).addClass('pacman')


//---------FUNCTIONS---------
  function movePac() {
    clearTimeout(timerId)
    currentPac = currentPac === 3 ? 0 : currentPac + 1
    $grid.eq(pacPosition)
    .addClass('pacman')
    .removeClass('food')
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
    console.log(e.keyCode)

    movePac()

  })




})
