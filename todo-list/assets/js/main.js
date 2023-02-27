document.body.classList.remove('transition')
const form = document.querySelector('[data-form]'),
    input = document.querySelector('[data-input]'),
    list = document.querySelector('[data-list]'),
    todos = JSON.parse(localStorage.getItem('todos')),
    wait = 5000

if (todos) {
    todos.forEach(todo => addTodo(todo))
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    addTodo()
})

function addTodo(todo) {
    let todoText = input.value
    if (todo) {
        todoText = todo.text
    }
    if (todoText) {
        const todoItem = document.createElement('li')
        todoItem.classList.add('form-item')
        if (todo && todo.checked) {
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

function updateLS() {
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


const button = document.querySelector('.language-button'),
    pageTitle = document.querySelector('title'),
    mainTitle = document.querySelector('.main-title'),
    inputPlaceholder = document.querySelector('.form-input'),
    instructionText1 = document.querySelector('[data-itext-1]'),
    instructionText2 = document.querySelector('[data-itext-2]'),
    instructionBoldText1 = document.querySelector('[data-bold-1]'),
    instructionBoldText2 = document.querySelector('[data-bold-2]')


button.addEventListener('click', () => {
    const language = button.classList

    if (language.contains('english')) {
        language.remove('english')
        language.add('brazilian')
        button.textContent = 'Português'
        pageTitle.textContent = 'Lista de Tarefas'
        mainTitle.textContent = 'Tarefas ✏️'
        inputPlaceholder.placeholder = 'digite sua tarefa'
        instructionText1.textContent = 'para marcar como concluido.'
        instructionBoldText1.textContent = 'Botão Esquerdo'
        instructionText2.textContent = 'para excluir tarefa.'
        instructionBoldText2.textContent = 'Botão Direito'
    } else {
        language.remove('brazilian')
        language.add('english')
        button.textContent = 'English'
        pageTitle.textContent = 'To-do list'
        mainTitle.textContent = 'To-do list ✏️'
        inputPlaceholder.placeholder = 'enter your to-do'
        instructionText1.textContent = 'to toggle completed.'
        instructionBoldText1.textContent = 'Left Click'
        instructionText2.textContent = 'to delete todo.'
        instructionBoldText2.textContent = 'Right Click'
    }
})
