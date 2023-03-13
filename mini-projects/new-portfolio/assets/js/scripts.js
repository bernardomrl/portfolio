const blob = document.querySelector('.blob')
const dot = document.querySelector('.dot')

window.onpointermove = event => {
    const { clientX, clientY } = event;

    let bgposX = clientX * 0.05
    let bgposY = clientY * 0.05

    dot.animate({
        backgroundPosition: `-${bgposX}px -${bgposY}px`
    }, { duration: 1000, fill: "forwards" })

    blob.animate({
        left: `${clientX}px`,
        top: `${clientY}px`,
    }, { duration: 10000, fill: "forwards" })
}

var typed = new Typed('#typed', {
    strings: ['Desenvolvedor FullStack.', 'Apaixonado por tecnologia.'],
    typeSpeed: 75,
    backSpeed: 25,
    backDelay: 10000,
    showCursor: false,
    loop: true
})

typed.start()
feather.replace()