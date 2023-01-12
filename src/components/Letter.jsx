import React, { useState } from 'react'

const Letter = ({ letter, rowIndex, colIndex, coords, setMoves, setWasGuessed, wasGuessed }) => {

    const [color, setColor] = useState(null)
    const [wasClicked, setWasClicked] = useState(false)

    const handleClick = () => {
        if(wasClicked) return // is this safe from quick dbl clicks??
        
        let isSecretLetter = false
        coords.forEach((row, ri) => {
            
            if(row[0] === rowIndex && row[1] === colIndex) {
                setColor('blue')
                isSecretLetter = true
                const updatedGuesses = [...wasGuessed]
                console.log("updated guesses " +updatedGuesses)
                updatedGuesses[ri] = true
                setWasGuessed(updatedGuesses)
            }
        })
        if(!isSecretLetter) {
            setColor('red')
            setMoves((prevState) => (prevState+1))
        }
        setWasClicked(true)
        

        //update prop to return letter, coordinate (for position on display), and ... iforgot
        
    }

    return (
        <td style={{backgroundColor: color}} onClick={handleClick}>
            {letter}
        </td>
    )
}

export default Letter