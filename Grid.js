const Grid_Size = 4
const Cell_Size = 20
const Cell_Gap = 2

/* 클래스 내보내기 */
export default class Grid {
    /* #로 선언된 필드는 객체 외부에서 접근하거나 변경할 수 없는 변수를 정의 */
    #cells

    constructor(gridElement) {
        /* CSS 스타일 선언 객체의 속성에 대한 새 값을 설정 */
        gridElement.style.setProperty("--grid-size", Grid_Size)
        gridElement.style.setProperty("--cell-size", `${Cell_Size}vmin`)
        gridElement.style.setProperty("--cell-gap", `${Cell_Gap}vmin`)

        /* map함수 : 어떤 배열에 있는 모든 요소들의 값을 변경해서 만든 새로운 배열 반환 */
        this.#cells = createCellElemnets(gridElement).map((cellElement, index) => {
            return new Cell(cellElement, index % Grid_Size, Math.floor(index / Grid_Size))
        })
    }

    get cells() {
        return this.#cells
    }
    
    /* grid의 cells을 열 기준으로 그룹화,
    각 셀의 x 값을 기준으로 열, y 값을 기준으로 각 셀을 그 열의 해당 위치에 배치,
    각 열에 해당하는 cellsByColumn 새로운 배열을 반환 */
    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || []
            cellGrid[cell.x][cell.y] = cell
            return cellGrid
        }, [])
    }

    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || []
            cellGrid[cell.y][cell.x] = cell
            return cellGrid
        }, [])
    }

    get #emptyCells() {
        return this.#cells.filter(cell => cell.tile == null)
    }
    
    /* 비어있는 cell 중 무작위로 하나 선택 */
    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
        return this.#emptyCells[randomIndex]
    }
}

/* cellElement와 좌표를 포함하는 cell 객체를 생성 */
class Cell {
    #cellElement
    #x
    #y
    #tile
    #mergeTile

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement
        this.#x = x
        this.#y = y
    }

    /* get : 객체의 속성 값을 반환 */
    get cellElement() {
        return this.#cellElement
    }
    
    get x() {
        return this.#x
    }

    get y() {
        return this.#y
    }

    get tile() {
        return this.#tile
    }

    /* set : 객체의 속성 값을 설정, 변경 */
    set tile(value) {
        this.#tile = value
        if (value == null) return
        this.#tile.x = this.#x
        this.#tile.y = this.#y
    }

    get mergeTile() {
        return this.#mergeTile
    }

    set mergeTile(value) {
        this.#mergeTile = value
        if (value == null) return
        this.#mergeTile.x = this.#x
        this.#mergeTile.y = this.#y
    }

    /* 새 타일 허용 */
    canAccept(tile) {
        return (
            this. tile == null ||
            /* 아직 병합하지 않았고 타일의 값이 동일하면 병합 */
            (this.mergeTile == null && this.tile.value === tile.value)
        )
    }
    
    /* tile 값 합치고 병합된 tile 제거 */
    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return
        this.tile.value = this.tile.value + this.mergeTile.value
        this.mergeTile.remove()
        this.mergeTile = null
    }
}

/* gridElement에 cell을 반복적으로 생성, cllass 추가 */
function createCellElemnets(gridElement) {
    const cells = []
    for (let i = 0; i < Grid_Size * Grid_Size; i++) {
        const cell = document.createElement("div")
        cell.classList.add("cell")
        cells.push(cell)
        gridElement.append(cell)
    }
    return cells
}