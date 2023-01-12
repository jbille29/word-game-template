import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Letter from './components/Letter';

const App = () => {
  const [grid, setGrid] = useState(initializeGrid(randomWord()));
  const [coordinates, setCoordinates] = useState([])
  const [path, setPath] = useState([]);
  

  const [secretWord, setSecretWord] = useState('snicker')
  const [wordData, setWordData] = useState(new Array(secretWord.length))
  const [moves, setMoves] = useState(0);
  const [wasGuessed, setWasGuessed] = useState(new Array(secretWord.length).fill(false))
  
  let myGrid = null
  let coords = []
  
  function initializeGrid(word) {
    // code to create the initial grid of letters goes here
    
    return [['w','a','s','d'],['d','r','t','y'],['d','o','b','x'],['l','v','c','a']]
  }

  const checkInBounds = (coordinate) => {
    return (coordinate < 0 || coordinate > 3)
  }

  const checkConflict = (x, y, grid) => {
    return grid[x][y] !== ''
  }

  const endPath = (letter, grid) => {
    let isItSo = false
    grid.forEach(row => {
      row.forEach((el, colIndex) => {
        if(row.length-1 === colIndex) {
          if(el === letter) 
            isItSo = true
        }
      })
    })
    return isItSo
  }

  const getNextRow = (currentRow) =>{
    let nextRow = null
    do {
      const randomRowMove = Math.floor(Math.random() * 3);
      if (randomRowMove === 0) {
        nextRow = currentRow - 1
        // check if in bounds
      } else if (randomRowMove === 1) {
        nextRow = currentRow
      } else {
        nextRow = currentRow + 1
      }
    }while(checkInBounds(nextRow)) 
    return nextRow
  }

  const getNextCol = (currentCol) =>{
    let nextCol = null
    do {
      const randomColMove = Math.floor(Math.random() * 3);
      if (randomColMove === 0) {
        nextCol = currentCol - 1
      } else if (randomColMove === 1) {
        nextCol = currentCol
      } else {
        nextCol = currentCol + 1
      }
    }while(checkInBounds(nextCol)) 
    return nextCol
  }
  
  const generateGrid = () => {
   
    let currentRow, nextRow, nextCol = null
    let currentCol = 0
    coords = []
    // create grid
    // place first letter in maze
    // generate random number from 0 to 4
    currentRow = (Math.floor(Math.random() * 4))
    // assign myGrid[randomeNuimber][0] = secretword[0]
    myGrid[currentRow][currentCol] = secretWord[0]
    setGrid(myGrid)
    coords.push([currentRow, currentCol])
    setCoordinates(coords)
    
    
     // get next col
    for (let i = 1; i < secretWord.length; i++) {
     
      let conflict = false
      let count = 0
      do{
        nextRow = getNextRow(currentRow)
        nextCol = getNextCol(currentCol)
        conflict = checkConflict(nextRow, nextCol, myGrid)
        count++
        if(count === 9) {
          console.log('we sure did skip this here blah blah bhaskipped')
        }
        
        //if there is a conflict and we have not already detected 10 conflicts loop again
      } while(conflict && count < 10)
      
      myGrid[nextRow][nextCol] = secretWord[i]
      coords.push([nextRow, nextCol])
      setCoordinates(coords)
      setWordData()
      setGrid(myGrid)
      console.log(secretWord[i] + ' placed')
      myGrid.forEach(row => {
        console.log(row)
      })

      console.log('is it true: ' + endPath(secretWord[secretWord.length-1], myGrid))

      currentCol = nextCol
      currentRow = nextRow
    }     
  }

  const fillGrid = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    myGrid.forEach((row, rowIndex) => {
      row.forEach((el, colIndex) => {
        if(el === '') myGrid[rowIndex][colIndex] = characters[Math.floor(Math.random()* 26)]
      })
    })

    myGrid.forEach(row => {
      console.log(row)
    })

    console.log((coords))
  }

  function runCanvas () {

  }

  useEffect(()=> {

    do {
      myGrid = [...Array(4)].map(e => Array(4).fill(''));
      generateGrid()
    } while(!endPath(secretWord[secretWord.length-1], myGrid))

    fillGrid()
    console.log(wasGuessed)
    
  }, [])
  
  function randomWord() {
    // code to select a random word from a list goes here
    return 'ducks'
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    const guess = event.target.elements.guess.value;
    if (guess === path.map(([row, col]) => grid[row][col]).join('')) {
      setMessage('You guessed the word correctly!');
      resetGame();
    } else {
      setMoves(moves - 1);
      setMessage('Incorrect guess. Try again.');
      if (moves === 0) {
        setMessage('You have used all of your moves. Game over.');
        resetGame();
      }
    }
  }
  
  function resetGame() {
    setGrid(initializeGrid(randomWord()));
    setPath([]);
    setMoves(5);
  }
  
  return (
    <div className='App'>
      <h1>Word Maze</h1>
      <div className='word'>
        {
          wasGuessed.map((letterGuessed, letterIndex) => (
            <h3 className='letters-guessed'>{letterGuessed? secretWord[letterIndex] : ' '}</h3>
          ))
        }
      </div>
      <div className='board-container'>
        {/*<canvas id="myCanvas">
        </canvas>*/ }
        
        <table id="overlay">
          <tbody>
            {grid && grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((letter, colIndex) => (
                  <Letter key={colIndex} letter={letter} rowIndex={rowIndex} colIndex={colIndex} coords={coordinates} setMoves={setMoves} setWasGuessed={setWasGuessed} wasGuessed={wasGuessed}/>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>{moves} /6 moves</p>
    </div>
  );
}

export default App
