const cards = document.querySelectorAll('.card')

cards.forEach(card => {
    card.addEventListener('click', () => {
        removeClasses()
        card.classList.add('open')
    })
})

function removeClasses() {
    cards.forEach(card => {
        card.classList.remove('open')
    })
}