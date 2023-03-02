const circle = document.querySelector('.circle-menu'),
    container = document.getElementById('container'),
    nav = document.getElementById('nav'),
    openButton = document.querySelector('[data-open]'),
    closeButton = document.querySelector('[data-close]')


openButton.addEventListener('click', () => {
    circle.classList.add('menu-open')
    container.classList.add('container-open')
    nav.classList.add('nav-open')
})
closeButton.addEventListener('click', () => {
    circle.classList.remove('menu-open')
    container.classList.remove('container-open')
    nav.classList.remove('nav-open')
})