import Grid from "./Grid.js"
import Tile from "./Tile.js"

/* 주어진 문자열과 값이 일치하는 id 속성의 값을 가진 요소 객체를 반환 */
const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
setupInput()

function setupInput() {
    /* addEventListener : 특정 이벤트가 발생했을 시 특정 함수 실행 */
    window.addEventListener("keydown", handleInput, { once : true })
}

/* async : 이 함수는 비동기적인 함수이고 Promise를 반환한다고 선언 */
/* async 함수에 await를 붙이면, 해당 Promise의 상태가 바뀔 때까지 코드가 기다린다. */
async function handleInput(e) {
    
    /* switch 문 : switch 문의 조건건을 평가하여 그 값과 일치하는 표현식을 갖는 case 문으로 실행 순서를 이동 */
    switch (e.key) {
        case "ArrowUp" :
            /* 움직일 수 없으면 다시 함수 실행 */
            if (!canMoveUp()) {
                setupInput()
                return
            }
            await moveUp()
            break

        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput()
                return
            }
            await moveDown()
            break

        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput()
                return
            }
            await moveLeft()
            break

        case "ArrowRight":
            if (!canMoveRight()) {
                setupInput()
                return
            }
            await moveRight()
            break

        default:
        setupInput()
        return
    }
    
    grid.cells.forEach(cell => cell.mergeTiles ())

    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    /* 더 이상 움직일 수 없으면 game end */
    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            alert("You lose ㅋ")
        })
        return
    }

    setupInput()
}

function moveUp() {
    return slideTiles(grid.cellsByColumn)
}

/* map : 각 요소를 변환하여 새로운 배열로 반환 */
function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
    return slideTiles(grid.cellsByRow)
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map(Row => [...Row].reverse()))
}

function slideTiles(cells) {
    
    /* 모든 비동기 작업이 완료되면 실행 */
    return Promise.all(
    
    /* flat : 배열 평탄환(다차원 배열 -> 일차원 배열열)
       ['apple', ['banana', 'orange', ['melon']]]
       -> ['apple', 'banana', 'orange', 'melon']
       map : 배열 내의 모든 요소 각각에 대하여 주어진 함수를 호출한 결과를 모아
             새로운 배열을 반환
       flatmap = flat + map */

    cells.flatMap(group => {
        const promises = []

      /* 인덱스 1부터 이동 */
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell

        /* 현재 위치의 바로 앞쪽 cell부터 이동 가능한 위치 탐색 */
        for (let j = i - 1; j >= 0; j--) {
            const moveToCell = group[j]

            /* 이동 불가능 break */
            if(!moveToCell.canAccept(cell.tile)) break
            /* 현재 타일이 이동할 수 있는 최종 목적지 */
            lastValidCell = moveToCell
        }
        
        /* 이동가능한 위치가 있으면 */
        if (lastValidCell != null) {
            /* 새로운 애니메이션 있을 때마다 배열에 추가 */
            promises.push(cell.tile.waitForTransition())

            if (lastValidCell.tile != null) {
                /* cell 병합 */
                lastValidCell.mergeTile = cell.tile
            } else {
                /* 현재 타일을 해당 위치로 이동 */
                lastValidCell.tile = cell.tile
            }
            cell.tile = null
        }
      }  
      return promises
    }))
}

function canMoveUp() {
    return canMove(grid.cellsByColumn)
}

function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

function canMoveLeft() {
    return canMove(grid.cellsByRow)
}

function canMoveRight() {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

/* 타일 이동 가능성 확인 */
function canMove(cells) {
    /* some : 각 요소들 중 하나라도 true를 리턴하면 값은 true */
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false
            if (cell.tile == null) return false
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile)
        })
    })

}