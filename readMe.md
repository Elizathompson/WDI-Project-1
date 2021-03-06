# General Assembly Project 1 : Simple front-end game

### Timeframe
7 days

## Technologies used

* JavaScript (ES6) + jQuery
* HTML5 + HTML5 Audio
* SCSS + CSS Animation
* GitHub

## Installation

1. Clone or download the repo
1. Open the `index.html` in your browser of choice

## My Game - Pac Man

![Pac Man](https://user-images.githubusercontent.com/44023542/51036211-5831f680-15a4-11e9-9cc3-1b84e3c42ae0.png)

You can find a hosted version here ----> [charlottemorgan.github.io/WDI-Project-1](https://charlottemorgan.github.io/WDI-Project-1/)

### Game overview
Pac Man is my own re-creation of the classic Pac Man arcade game. The aim of the game is to eat all of the food on the board while gaining as many points as possible, while avoiding the ghosts.

If Pac Man eats a flashing superfood this turns the ghosts blue. Bonus points can be gained by eating the ghosts while they are blue.

### Controls
- Pac Man movements: ← ↑ → ↓ keys

### Game Instructions
1. The game begins with a welcome screen which introduces the game as well as providing instructions. The game is started by clicking on the "Start Game" button.

![screenshot - Start Screen](https://user-images.githubusercontent.com/44023542/51035857-4ac83c80-15a3-11e9-980b-2bd75a688de0.png)

2. After the start button has been clicked a 3 second countdown begins and shows on the screen. The keys are disabled during the countdown, once the countdown has finished the game starts and the player can begin moving Pac Man.

![screenshot - countdown](https://user-images.githubusercontent.com/44023542/51035886-67647480-15a3-11e9-86f7-8dbe04c3eb55.png)

3. Points are gained every time Pac Man eats food. The ghosts are chasing Pac Man by default.

![screenshot - score](https://user-images.githubusercontent.com/44023542/51035926-8531d980-15a3-11e9-8fae-23ac3be372db.png)

4. If Pac Man eats flashing superfood he gets extra points and the ghosts turn blue. While the ghosts are blue they move away from Pac Man.

![screenshot - blue ghosts](https://user-images.githubusercontent.com/44023542/51035980-ab577980-15a3-11e9-8b4e-4c769efeafb3.png)

5. If Pac Man eats a blue ghost the player gets bonus points and the ghost changes into a pair of moving eyes. The eyes will then find their way back to the ghosts initial start position and then change back into their normal state eg. Clyde the orange ghost

![screenshot - eyes](https://user-images.githubusercontent.com/44023542/51036084-f6718c80-15a3-11e9-8e71-588f401c5b07.png)

6. If Pac Man runs into a ghost in its normal form, or is caught by a chasing ghost, then the game is over and the players score is displayed, along with the option to play again.

![screenshot - End Modal Successful](https://user-images.githubusercontent.com/44023542/51036160-2751c180-15a4-11e9-90f5-8e5a7bef375f.png)

## Process

The starting point for this game was creating a grid on which to build the rest of the game. I created the grid by using JavaScript to generate 400 divs each with an ID and a class of 'food'. After the grid had been created I added the maze, the function for this loops over the array of indexes and adds a class of 'maze' at each index.

The superfood is generated at random points on the grid 10 times using a for loop. It will only generate superfood where there is already food, avoiding the maze. It removes the class of 'food' from the div and adds the class of 'superfood'.

PacMans movement is on a keyup event listener and has conditions to prevent his movement outside of the grid or through walls.

The ghosts move on separate intervals, with their start position hard coded. Each move the ghost makes is based on the current location of PacMan and is decided in a function  "makeIntelligentMove" - If the next move the ghost is going to make isn't closer to PacMan then the ghost has to make a new choice. This logic is reversed to make the ghosts move away from PacMan when they turn blue.

### Challenges

The biggest challenge for this project was definitely the ghost movement logic and the functions to achieve this were quite complex for my level of ability at the time of the project. I enjoyed the challenge as it pushed me to learn new content.

### Wins

A big win for this game was to get the ghosts changing to blue when the superfood is eaten and then also having the blue ghosts turn to eyes when they are eaten by PacMan. In addition it was a win to get the eyes to return to their home position and "respawn" into normal ghosts again.

## Future features

In the future I would like to try and rebuild PacMan using slightly different logic to make the ghost movement more fluid and responsive.

I would also like to add in harder levels and more randomly generating food eg bonus cherries
