$(() => {
  console.log('js loaded')

  //-----------------------------------------VARIABLES-----------------------------------------
  const $board = $('.gameboard')
  const width = 20
  const mazeArray = [26, 33, 46, 53, 66, 73, 86, 93, 101, 102, 103, 104, 105, 106, 113, 114, 115, 116, 117, 118, 168, 169, 170, 171, 188, 191, 208, 211, 228, 229, 230, 231, 281, 282, 283, 284, 285, 286, 293, 294, 295, 296, 297, 298, 306, 313, 326, 333, 346, 353, 366, 373]
  let pacPosition = 0
  // let currentPac = 0
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

  //generate food
  function makeFood() {
    $squares.addClass('food')
  } makeFood()

  //create maze
  mazeArray.forEach(mazeId => {
    $(`[id='${mazeId}']`).removeClass('food')
    $(`[id='${mazeId}']`).addClass('wall')
  })


  // function to randomly generate superfood
  // function makeSuperFood() {
  //   for(let i = 0; i<10; i++) {
  //     $($squares[Math.floor(Math.random()*$squares.length)]).addClass('big-food')
  //   }
  // } makeSuperFood()


  // function to move pacman
  function movePac() {
    const nextPac =
    // currentPac = currentPac === 3 ? 0 : currentPac + 1
    $squares.eq(pacPosition)
      .addClass('pacman')
      .removeClass('food')
      .removeClass('big-food')
      // .attr('data-step', currentPac)
      .attr('data-direction', direction)
    console.log(pacPosition)
  }

  //-----------------------------------------EVENT LISTENERS-----------------------------------------

  //event listener for key strokes
  $(document).on('keydown', e => {
    $squares.eq(pacPosition).removeClass('pacman')

    // left 37, up 38, right 39, down 40
    switch(e.keyCode) {
      case 37: if(pacPosition % width > 0){
        const newPosition = pacPosition - 1
        if (mazeArray.includes(newPosition)) return
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
