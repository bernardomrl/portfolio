const button = document.querySelector('[data-button]'),
    input = document.querySelector('[data-input]')

button.addEventListener('click', () => {
    input.classList.toggle('input-active')
})