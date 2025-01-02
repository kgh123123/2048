export default class Tile {
    #tileElement
    #x
    #y
    #value

    /* tile의 초기값 2 또는 4로 설정 */
    constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
        this.#tileElement = document.createElement("div")
        this.#tileElement.classList.add("tile")
        tileContainer.append(this.#tileElement)
        this.value = value
    }

    get value() {
        return this.#value
    }

    /* set : 지정한 속성 값의 변경을 시도 */
    /* v를 화면에 표시, 값의 크기에 따라 배경색이 점점 어두워짐, text 색 설정정 */
    set value(v) {
        this.#value = v
        this.#tileElement.textContent = v
        const power = Math.log2(v)
        const backgroundLightness = 100 - power * 9
        this.#tileElement.style.setProperty("--background-lightness", `${backgroundLightness}%`)
        this.#tileElement.style.setProperty("--text-lightness", `${ backgroundLightness <= 50 ? 90 : 10} %`)
    }

    /* #x에 전달된 value 값 저장 */
    set x(value) {
        this.#x = value
        this.#tileElement.style.setProperty("--x", value)
    }   

    /* #y에 전달된 value 값 저장 */
    set y(value) {
        this.#y = value
        this.#tileElement.style.setProperty("--y", value)
    }

    remove() {
        this.#tileElement.remove()
    }

    /* this.#tileElement가 transition 끝날 때까지 대기 */
    waitForTransition(animation = false) {
        return new Promise(resolve => {
            this.#tileElement.addEventListener(
                animation ? "animationend" : "transitionend",
                resolve,
                {
                    once: true,
                }
            )
        })
    }
}