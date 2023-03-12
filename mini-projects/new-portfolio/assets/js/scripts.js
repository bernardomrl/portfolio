const blob = document.querySelector('.blob')
const dot = document.querySelector('.dot')

window.onpointermove = event => {
    const { clientX, clientY } = event;

    let bgposX = clientX * 0.15
    let bgposY = clientY * 0.15

    dot.animate({
        backgroundPosition: `-${bgposX}px -${bgposY}px`
    }, { duration: 1000, fill: "forwards" })

    blob.animate({
        left: `${clientX}px`,
        top: `${clientY}px`,
    }, { duration: 3000, fill: "forwards" })
}

var typed = new Typed('#typed', {
    strings: ['Desenvolvedor FullStack.', 'Apaixonado por tecnologia.'],
    typeSpeed: 70,
    backSpeed: 50,
    backDelay: 5000,
    showCursor: false,
    loop: true
})

typed.start()
feather.replace()