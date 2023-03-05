const blob = document.querySelector('.blob')
const pointer = document.querySelector('.pointer')

document.body.onmousemove = event => {
    const { clientX, clientY } = event;

    blob.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
    }, { duration: 3000, fill: "forwards" })
}