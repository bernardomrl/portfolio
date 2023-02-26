document.body.classList.remove('transition')
const   form = document.querySelector('[data-form]'),
        input = document.querySelector('[data-input]'),
        list = document.querySelector('[data-list]'),
        todos = JSON.parse(localStorage.getItem('todos')),
        wait = 5000

if(todos){
    todos.forEach(todo => addTodo(todo))
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    addTodo()
})

function addTodo(todo){
    let todoText = input.value
    if(todo){
        todoText = todo.text
    }
    if(todoText){
        const todoItem = document.createElement('li')
        todoItem.classList.add('form-item')
        if(todo && todo.checked){
            todoItem.classList.add('checked')
        }
        todoItem.innerText = todoText

        todoItem.addEventListener('click', () => {
            todoItem.classList.toggle('checked')
        })

        todoItem.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            todoItem.remove()
            updateLS()
        })

        list.appendChild(todoItem)
        input.value = ''
        updateLS()
    }
}

function updateLS(){
    todoItem = document.querySelectorAll('li')
    const todos = []

    todoItem.forEach(todoItem => {
        todos.push({
            text: todoItem.innerText,
            checked: todoItem.classList.contains('checked')
        })
    })

    localStorage.setItem('todos', JSON.stringify(todos))
}