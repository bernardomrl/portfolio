const text = document.querySelector('.blurry-text')

let counter = 0

const max = 100
const seconds = 2
const interval = ((seconds * 1000) / max)

const loop = setInterval(function () {
    text.innerHTML = `${counter}%`
    if (counter === max) {
        stop()
    }
    counter++
}, interval)

function stop() {
    clearInterval(loop)
}