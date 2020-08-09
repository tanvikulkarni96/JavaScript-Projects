document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    var squares = Array.from(document.querySelectorAll('.grid div'))

    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#startBtn')

    var timerId
    const width = 10
    var score = 0

    const colors = [
        'green',
        'blue',
        'brown',
        'orange',
        'red'
    ]

    //The tetrominoes

    const ltetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const ztetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
        
    ]

    const ttetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width * 2 + 1, width + 2],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const otetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const itetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],        
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominos = [ltetromino, ztetromino, ttetromino, otetromino, itetromino]

    var currentPosition = 4

    //select a random tetromino
    var randomTetromino
    let nextRandomTetromino = Math.floor(Math.random()*theTetrominos.length)
    randomTetromino = nextRandomTetromino
    var currentRotation = 0
    var currentTetromino = theTetrominos[nextRandomTetromino][currentRotation]

    //draw selected tetromino
    function draw()
    {
        currentTetromino.forEach(index =>
            {
                squares[index + currentPosition].classList.add('tetromino')
                squares[index + currentPosition].style.backgroundColor = colors[randomTetromino]
            })
    }

    //undraw the tetromino
    function undraw()
    {
        currentTetromino.forEach(index => 
        {
           squares[index + currentPosition].classList.remove('tetromino')
           squares[index + currentPosition].style.backgroundColor = ''

        })
    }

    function freeze()
    {
        if(currentTetromino.some(index => squares[currentPosition + index + width].classList.contains('taken')))
        {
            currentTetromino.forEach(index => squares[currentPosition + index].classList.add('taken'))
            randomTetromino = nextRandomTetromino
            nextRandomTetromino = Math.floor(Math.random() * theTetrominos.length)
            currentTetromino = theTetrominos[randomTetromino][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
        }
    }

    //assign a function to key codes
    function control(e)
    {
        if(e.keyCode === 37)
        {
            moveLeft()
        }
        else if(e.keyCode === 38)
        {
            rotate()
        }
        else if(e.keyCode === 39)
        {
            moveRight()
        }
        else if(e.keyCode === 40)
        {
            moveDown()
        }
    }

    document.addEventListener('keyup',control)

    //move the tetromino down
    function moveDown()
    {
        undraw()
        currentPosition += width
        draw()
        freeze()
        addScore()
        gameOver()
    }

    //move the tetromino to the left, check for edge and blockages
    function moveLeft()
    {
        undraw()
        const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge)
            currentPosition -= 1
        if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition += 1
        draw()
    }

    //move the tetromino to right, check for edge and blockages
    function moveRight()
    {
        undraw()
        const isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % 10 === 9)

        if(!isAtRightEdge)
            currentPosition +=1
        if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition -= 1
        draw()
    }

    //rotate the tetromino
    function rotate()
    {
        undraw()
        currentRotation++
        if(currentRotation == 4)
            currentRotation = 0;
        currentTetromino = theTetrominos[randomTetromino][currentRotation]
        draw()
    }

    //showing next tetromino in the mini grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 1

    const upNextTetrominos = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //ltetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //ztetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //ttetromino
        [0, 1, displayWidth, displayWidth + 1], //otetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //itetromino
    ]

    function displayShape()
    {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''   
        })

        upNextTetrominos[nextRandomTetromino].forEach(index => {
            displaySquares[index + displayIndex].classList.add('tetromino')
            displaySquares[index + displayIndex].style.backgroundColor = colors[nextRandomTetromino]
        })
    }

    //Adding functionality to Start/Stop Button
    startBtn.addEventListener('click', () =>{
        if(timerId)
        {
            clearInterval(timerId)
            timerId = null
            scoreDisplay.innerHTML = 'PAUSED'
        }
        else
        {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandomTetromino = Math.floor(Math.random() * theTetrominos.length)
            scoreDisplay.innerHTML = 'Score : 0'
            displayShape()
        }
    })

    //Displaying score
    function addScore()
    {
        for(let i = 0; i < 199; i += width)
        {
            const rows = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            if(rows.every(index => squares[index].classList.contains('taken')))
            {
                score += 10
                scoreDisplay.innerHTML = 'Score : ' + score
                rows.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //Game over function
    function gameOver()
    {
        if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            scoreDisplay.innerHTML = 'Game Over'
            clearInterval(timerId)
        }
    }
})

