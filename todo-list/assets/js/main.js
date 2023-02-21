document.body.classList.remove("stop-transition")

const   input = document.querySelector('[data-input]'),
        list = document.querySelector('[data-ul]'),
        text = input.value
    
input.addEventListener('keydown',
function(event){
    if(!event){
        event = window.event
    }
    if(event.keyCode === 13){
        submit()
    }
}, false)

function submit(){
    if(input.value === ''){
        input.placeholder = "write something first.."
        input.classList.add("effect")
        input.readOnly = true
        setTimeout(() => {
            input.classList.remove("effect")
            input.readOnly = false
            input.placeholder = "enter your to-do"
        }, "2500")
        setTim
    } else {
        addItem()
    }
    resetInput()
}

function warnTimeout(){

}

function resetInput(){
    input.value = ''
}

function addItem(){
    let text = input.value,
        item = document.createElement('li')

    item.innerHTML = text;
    item.classList.add('todo-item')

    list.appendChild(item)

    item.addEventListener('click', () => {
        if(item.classList.contains('completed')){
            item.classList.remove('completed')
        } else {
            item.classList.add('completed')
        }
    })
    item.addEventListener('contextmenu', e => {
        e.preventDefault()
        item.remove()
    })
}